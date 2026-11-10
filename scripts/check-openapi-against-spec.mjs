import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules = [
  "specification/002. Authorization/api-contract.md",
  "specification/005. Identity and User Retention/api-contract.md",
  "specification/006. Tickets and Dynamic Fields/api-contract.md",
  "specification/007. Audit and API Contracts/api-contract.md",
];

// Known generator defects are deviations, NOT spec amendments.
// --strict fails on these too. The default rejects all other differences.
const knownMissing200 = new Set([
  "GET /api/v0/ticket-types",
  "GET /api/v0/ticket-types/{ticketTypeId}",
  "PATCH /api/v0/ticket-types/{ticketTypeId}",
  "GET /api/v0/ticket-types/{ticketTypeId}/templates",
  "GET /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}",
  "PATCH /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}",
  "POST /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/publish",
  "POST /api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/retire",
]);

const cell = (s) => s.trim().replaceAll(String.fromCharCode(96), "").trim();
const row = (s) => s.slice(1, -1).split("|").map(cell);
const same = (a, b) =>
  JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

function compareSet(actual, expected, label, errors) {
  if (!same(actual, expected)) {
    errors.push(
      label +
        ": expected [" +
        [...expected].join(", ") +
        "], generated [" +
        [...actual].join(", ") +
        "]",
    );
  }
}

function readContracts() {
  const operations = new Map();
  const schemas = new Map();

  for (const file of modules) {
    const lines = fs.readFileSync(path.join(root, file), "utf8").split("\n");
    let section = "";
    let current = null;
    for (const line of lines) {
      if (line === "## 1. Operation contracts") {
        section = "operations";
        continue;
      }
      if (line === "## 2. Request and response DTOs") {
        section = "schemas";
        continue;
      }
      if (line === "## 3. Authorization, validation and behavior") {
        section = "";
        continue;
      }
      if (section === "schemas" && line.startsWith("### ")) {
        current = line.slice(4);
        if (current === "Shared response DTOs") {
          current = null;
        } else {
          if (schemas.has(current)) {
            throw new Error("Duplicate authored DTO: " + current);
          }
          schemas.set(current, { file, fields: [] });
        }
        continue;
      }
      if (!line.startsWith("|") || /^\|\s*-{3,}/.test(line)) continue;
      const columns = row(line);

      if (
        section === "operations" &&
        /^(GET|POST|PATCH|DELETE|PUT)$/.test(columns[0])
      ) {
        if (columns.length !== 9) {
          throw new Error("Invalid operation table row in " + file);
        }
        const [
          method, endpoint, query, request, success, response, message, authz,
          errors,
        ] = columns;
        const key = method + " " + endpoint;
        if (operations.has(key)) throw new Error("Duplicate operation " + key);
        operations.set(key, {
          method: method.toLowerCase(),
          endpoint,
          query: query === "-" ? [] : query.split(","),
          request,
          success,
          response,
          message,
          authz,
          errorStatuses: errors.split(","),
        });
      }
      if (
        section === "schemas" &&
        current &&
        columns.length === 4 &&
        columns[0] !== "Field"
      ) {
        const [field, type, required] = columns;
        if (!["yes", "no"].includes(required)) {
          throw new Error("Invalid required flag " + current + "." + field);
        }
        schemas.get(current).fields.push({
          field,
          type,
          required: required === "yes",
        });
      }
    }
  }
  return { operations, schemas };
}

function refName(x) {
  return x?.$ref?.match(/^#\/components\/schemas\/([^/]+)$/)?.[1] ?? null;
}

function matchesType(actual, type) {
  if (type === "any") return true;
  if (type.startsWith("enum:")) {
    const items = type.slice(5).split(",");
    return (
      actual?.type === "string" &&
      (same(actual.enum ?? [], items) ||
        (typeof actual.pattern === "string" &&
          same(actual.pattern.split("|"), items)))
    );
  }
  if (type.startsWith("array<")) {
    return (
      actual?.type === "array" &&
      matchesType(actual.items, type.slice(6, -1))
    );
  }
  if (type === "uuid" || type === "date-time") {
    return actual?.type === "string" && actual.format === type;
  }
  if (["string", "integer", "number", "boolean", "object"].includes(type)) {
    return actual?.type === type;
  }
  return refName(actual) === type;
}

function checkResponse(doc, generated, expected) {
  const response = generated.responses?.[expected.success];
  const wrapperName = refName(response?.content?.["application/json"]?.schema);
  const wrapper = doc.components?.schemas?.[wrapperName];
  const data = wrapper?.properties?.data;
  if (!data) return "missing success envelope or data schema";
  for (const name of ["success", "statusCode", "message", "error", "meta", "data"]) {
    if (!wrapper.properties[name]) return "response envelope lacks " + name;
  }
  if (expected.response === "Void") {
    return wrapperName === "ApiResponseVoidBasicMeta"
      ? null
      : "expected Void envelope";
  }
  if (expected.response === "IdResponse") {
    return wrapperName === "ApiResponseMapStringUUIDBasicMeta"
      ? null
      : "expected ID creation envelope";
  }
  if (expected.response.endsWith("[]")) {
    return refName(data.items) === expected.response.slice(0, -2)
      ? null
      : "expected array DTO " + expected.response;
  }
  return refName(data) === expected.response
    ? null
    : "expected data DTO " + expected.response;
}

function checkQueryExtensions(doc, errors) {
  const file = path.join(
    root,
    "specification/004. Query Filtering/11-appendices.md",
  );
  const content = fs.readFileSync(file, "utf8");
  const section = content.split("## 11.5 Static Operation Capability Matrix")[1]
    ?.split("## 11.6")[0];
  if (!section) {
    errors.push("Missing normative query field/operator matrix");
    return;
  }
  const tick = String.fromCharCode(96);
  const rows = section.split("\n").filter((line) => line.startsWith("| " + tick + "/api/v0/"));
  if (rows.length !== 5) {
    errors.push("Expected five normative query field/operator list definitions");
  }
  for (const line of rows) {
    const parts = line.slice(1, -1).split("|").map((s) => s.trim());
    if (parts.length !== 3) {
      errors.push("Malformed query matrix row: " + line);
      continue;
    }
    const endpoint = parts[0].replaceAll(tick, "");
    const op = doc.paths?.[endpoint]?.get;
    if (!op) {
      errors.push("Missing generated query operation GET " + endpoint);
      continue;
    }
    const filter = (op.parameters ?? []).find((p) => p.name === "filterBy");
    const sort = (op.parameters ?? []).find((p) => p.name === "sortBy");
    const expectedFilter = {};
    for (const group of parts[1].split("•")) {
      const colon = group.indexOf(":");
      if (colon < 0) {
        errors.push("Bad field/operator group: " + group);
        continue;
      }
      const fields = group.slice(0, colon).split(tick).filter((_, i) => i % 2 === 1);
      const operators = group.slice(colon + 1).split(",").map((x) => x.trim());
      for (const field of fields) {
        expectedFilter[field] = operators;
      }
    }
    const actualFilter = filter?.["x-filter-by"] ?? {};
    compareSet(
      Object.keys(actualFilter),
      Object.keys(expectedFilter),
      "GET " + endpoint + " filterable paths",
      errors,
    );
    for (const [field, operators] of Object.entries(expectedFilter)) {
      compareSet(
        actualFilter[field] ?? [],
        operators,
        "GET " + endpoint + " " + field + " filter operators",
        errors,
      );
    }
    const sortable = parts[2].split(tick).filter((_, i) => i % 2 === 1);
    compareSet(
      sort?.["x-sort-by"] ?? [],
      sortable,
      "GET " + endpoint + " sortable paths",
      errors,
    );
  }
}

function audit(doc, spec, strict) {
  const errors = [];
  const known = [];
  const seen = new Set();
  const { operations, schemas } = spec;
  checkQueryExtensions(doc, errors);

  for (const [key, contract] of operations) {
    const op = doc.paths?.[contract.endpoint]?.[contract.method];
    if (!op) {
      errors.push("Missing generated operation " + key);
      continue;
    }
    seen.add(key);
    const params = op.parameters ?? [];
    compareSet(
      params.filter((p) => p.in === "query").map((p) => p.name),
      contract.query,
      key + " query parameters",
      errors,
    );
    compareSet(
      params.filter((p) => p.in === "path").map((p) => p.name),
      [...contract.endpoint.matchAll(/\{([^}]+)\}/g)].map((x) => x[1]),
      key + " path parameters",
      errors,
    );
    const request = refName(op.requestBody?.content?.["application/json"]?.schema) ?? "-";
    if (request !== contract.request) {
      errors.push(
        key + ": expected request DTO " + contract.request + ", got " + request,
      );
    }
    for (const status of contract.errorStatuses) {
      if (!op.responses?.[status]) {
        errors.push(key + ": missing documented error status " + status);
      }
    }
    if (!op.responses?.[contract.success]) {
      if (contract.success === "200" && knownMissing200.has(key)) {
        known.push(key + ": OpenAPI omits required HTTP 200 response");
      } else {
        errors.push(key + ": missing required success HTTP " + contract.success);
      }
    } else {
      const issue = checkResponse(doc, op, contract);
      if (issue) errors.push(key + ": " + issue);
    }
  }

  for (const [endpoint, group] of Object.entries(doc.paths ?? {})) {
    for (const verb of Object.keys(group)) {
      if (!["get", "post", "patch", "delete", "put"].includes(verb)) continue;
      const key = verb.toUpperCase() + " " + endpoint;
      if (!seen.has(key)) errors.push("Unspecified generated operation " + key);
    }
  }

  const requestSchemas = new Set(
    [...operations.values()]
      .map((op) => op.request)
      .filter((name) => name !== "-"),
  );
  for (const [name, contract] of schemas) {
    const found = doc.components?.schemas?.[name];
    if (!found) {
      if (name === "TicketTypeInfo") {
        known.push("TicketTypeInfo response component is not generated");
      } else {
        errors.push("Missing generated DTO schema " + name);
      }
      continue;
    }
    compareSet(
      Object.keys(found.properties ?? {}),
      contract.fields.map((x) => x.field),
      name + " fields",
      errors,
    );
    for (const field of contract.fields) {
      const p = found.properties?.[field.field];
      if (!p) continue;
      if (!matchesType(p, field.type)) {
        errors.push(
          name + "." + field.field + ": expected " + field.type +
            ", generated " + JSON.stringify(p),
        );
      }
      if (requestSchemas.has(name)) {
        const required = (found.required ?? []).includes(field.field);
        if (required !== field.required) {
          errors.push(
            name + "." + field.field + ": required=" + field.required +
              " but generated=" + required,
          );
        }
      }
    }
  }

  // Catch new or resolved deviations instead of broadly swallowing failures.
  const missingKnown = [...knownMissing200].filter((key) => {
    const c = operations.get(key);
    return c && !doc.paths?.[c.endpoint]?.[c.method]?.responses?.["200"];
  }).length;
  const missingTypeSchema = doc.components?.schemas?.TicketTypeInfo ? 0 : 1;
  if (known.length !== missingKnown + missingTypeSchema) {
    errors.push("Known-deviation ledger changed; review approved exceptions");
  }
  if (strict) {
    errors.push(...known.map((x) => "KNOWN BACKEND DEVIATION: " + x));
  }
  return { errors, known, matched: seen.size };
}

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const input =
  args.find((arg) => arg !== "--strict") ??
  path.join(
    root,
    "_backend/server/apps/web/src/main/resources/static/api/docs/openapi.yaml",
  );

try {
  if (!fs.existsSync(input)) {
    throw new Error("Backend-generated OpenAPI file not found: " + input);
  }
  const spec = readContracts();
  const doc = yaml.load(fs.readFileSync(input, "utf8"));
  const result = audit(doc, spec, strict);
  console.log(
    "Spec-first OpenAPI check: " + spec.operations.size +
      " specified operations, " + spec.schemas.size +
      " authored DTO contracts, " + result.matched +
      " generated operations matched.",
  );
  for (const gap of result.known) console.warn("KNOWN DEVIATION: " + gap);
  for (const error of result.errors) console.error("CONTRACT MISMATCH: " + error);
  if (result.errors.length) {
    console.error("OpenAPI/spec parity failed (" + result.errors.length + " issues)");
    process.exitCode = 1;
  } else {
    console.log("No unacknowledged deviations; run --strict for full parity.");
  }
} catch (error) {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
