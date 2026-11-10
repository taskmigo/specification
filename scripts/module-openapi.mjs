import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules = [
  {
    name: "Authorization",
    file: "specification/002. Authorization/openapi.yaml",
    paths: {
      "/api/v0/statements": ["get", "post"],
      "/api/v0/roles": ["get", "post"],
      "/api/v0/roles/{roleId}/statements": ["patch"],
      "/api/v0/statements/{statementId}": ["delete"],
    },
  },
  {
    name: "Identity",
    file: "specification/005. Identity and User Retention/openapi.yaml",
    paths: {
      "/api/v0/users": ["get", "post"],
      "/api/v0/groups": ["get", "post"],
      "/api/v0/users/{userId}/statements": ["patch"],
      "/api/v0/configuration": ["get", "patch"],
      "/api/v0/users/{userId}": ["delete"],
    },
  },
  {
    name: "Tickets",
    file: "specification/006. Tickets and Dynamic Fields/openapi.yaml",
    paths: {
      "/api/v0/tickets": ["get", "post"],
      "/api/v0/ticket-types": ["get", "post"],
      "/api/v0/ticket-types/{ticketTypeId}/templates": ["get", "post"],
      "/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/retire": [
        "post",
      ],
      "/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}/publish": [
        "post",
      ],
      "/api/v0/tickets/{ticketId}": ["get", "patch"],
      "/api/v0/ticket-types/{ticketTypeId}": ["get", "patch"],
      "/api/v0/ticket-types/{ticketTypeId}/templates/{templateVersionId}": [
        "get",
        "patch",
      ],
    },
  },
  {
    name: "Audit",
    file: "specification/007. Audit and API Contracts/openapi.yaml",
    paths: {
      "/api/v0/audit/{entityType}/logs": ["get"],
    },
  },
];

function blocks(text, startLabel, endLabel, indent) {
  const lines = text.split("\n");
  const start = lines.indexOf(startLabel);
  const end = lines.indexOf(endLabel);
  if (start < 0 || end <= start) {
    throw new Error("Missing OpenAPI section: " + startLabel);
  }

  const result = new Map();
  const startPattern = new RegExp("^ {" + indent + "}([^:]+):$");
  const nextPattern = new RegExp("^ {" + indent + "}[^ ]");
  for (let i = start + 1; i < end; ) {
    const match = lines[i].match(startPattern);
    if (!match) {
      i++;
      continue;
    }

    let j = i + 1;
    while (j < end && !nextPattern.test(lines[j])) {
      j++;
    }

    if (result.has(match[1])) {
      throw new Error("Duplicate OpenAPI key: " + match[1]);
    }
    result.set(match[1], lines.slice(i, j).join("\n").trimEnd());
    i = j;
  }
  return result;
}

function schemaRefs(text) {
  return [...text.matchAll(/#\/components\/schemas\/([A-Za-z0-9_]+)/g)].map(
    (match) => match[1],
  );
}

function methods(text) {
  return [...text.matchAll(/^    (get|post|patch|delete|put):$/gm)].map(
    (match) => match[1],
  );
}

function assertSame(actual, expected, label) {
  if (JSON.stringify([...actual].sort()) !== JSON.stringify([...expected].sort())) {
    throw new Error("Incorrect " + label + ": " + [...actual].join(", "));
  }
}

async function check() {
  const operations = new Set();
  const allPaths = new Set();

  for (const module of modules) {
    const text = fs.readFileSync(path.join(root, module.file), "utf8");
    await prettier.format(text, { parser: "yaml" });

    if (!text.includes("openapi: 3.1.0")) {
      throw new Error("Missing OpenAPI 3.1 version in " + module.file);
    }
    if (!text.includes("  securitySchemes:\n    taskmigoOAuth:")) {
      throw new Error("Missing OAuth2 security scheme in " + module.file);
    }

    const paths = blocks(text, "paths:", "components:", 2);
    const schemas = blocks(text, "  schemas:", "  securitySchemes:", 4);
    assertSame(paths.keys(), Object.keys(module.paths), module.name + " paths");

    const usedSchemas = new Set();
    const pending = [...paths.values()].flatMap(schemaRefs);
    while (pending.length) {
      const name = pending.pop();
      if (usedSchemas.has(name)) {
        continue;
      }
      const value = schemas.get(name);
      if (!value) {
        throw new Error("Unresolved schema " + name + " in " + module.file);
      }
      usedSchemas.add(name);
      pending.push(...schemaRefs(value));
    }
    assertSame(
      schemas.keys(),
      usedSchemas,
      module.name + " dependency-closed schema set",
    );

    for (const [resource, body] of paths) {
      assertSame(
        methods(body),
        module.paths[resource],
        module.name + " " + resource + " methods",
      );
      if (allPaths.has(resource)) {
        throw new Error("Duplicate path between modules: " + resource);
      }
      allPaths.add(resource);

      for (const method of methods(body)) {
        const key = method.toUpperCase() + " " + resource;
        if (operations.has(key)) {
          throw new Error("Duplicate operation: " + key);
        }
        operations.add(key);
      }
    }

    console.log(
      module.name +
        ": " +
        paths.size +
        " paths, " +
        [...paths.values()].reduce((n, body) => n + methods(body).length, 0) +
        " operations, " +
        schemas.size +
        " local schemas",
    );
  }

  if (operations.size !== 29 || allPaths.size !== 18) {
    throw new Error("Expected 29 operations and 18 paths; found " + operations.size);
  }
  console.log("All module OpenAPI documents are self-contained and non-overlapping.");
}

async function generate(sourceFile) {
  const source = fs.readFileSync(sourceFile, "utf8");
  await prettier.format(source, { parser: "yaml" });

  const paths = blocks(source, "paths:", "components:", 2);
  const schemas = blocks(source, "  schemas:", "  securitySchemes:", 4);
  const scheme = source.split("  securitySchemes:\n")[1]?.trimEnd();
  if (!scheme) {
    throw new Error("No security scheme in backend OpenAPI");
  }

  const ownership = new Set();
  for (const module of modules) {
    const owned = [...paths].filter(([resource]) => resource in module.paths);
    const seen = new Set();
    const pending = owned.flatMap(([, value]) => schemaRefs(value));

    while (pending.length) {
      const name = pending.pop();
      if (seen.has(name)) {
        continue;
      }
      const value = schemas.get(name);
      if (!value) {
        throw new Error("Missing source schema " + name);
      }
      seen.add(name);
      pending.push(...schemaRefs(value));
    }

    const ordered = [...schemas].filter(([name]) => seen.has(name));
    const document = [
      "---",
      "openapi: 3.1.0",
      "info:",
      "  title: Taskmigo " + module.name + " API",
      "  description: Implementation-derived module contract for Taskmigo API v0.",
      "  version: v0",
      "security:",
      "- taskmigoOAuth: []",
      "paths:",
      ...owned.map(([, value]) => value),
      "components:",
      "  schemas:",
      ...ordered.map(([, value]) => value),
      "  securitySchemes:",
      scheme,
      "",
    ].join("\n");

    fs.writeFileSync(path.join(root, module.file), document);
    for (const [resource] of owned) {
      ownership.add(resource);
    }
  }
  assertSame(paths.keys(), ownership, "backend operation ownership");
  await check();
}

try {
  const args = process.argv.slice(2);
  if (args.length === 2 && args[0] === "--generate") {
    await generate(path.resolve(args[1]));
  } else if (args.length === 0 || (args.length === 1 && args[0] === "--check")) {
    await check();
  } else {
    throw new Error(
      "Usage: node scripts/module-openapi.mjs [--check | --generate <backend-openapi.yaml>]",
    );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
