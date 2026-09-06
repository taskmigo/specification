import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const [, , previousTag, head = "HEAD", outputPath] = process.argv;

if (!outputPath) {
  throw new Error(
    "Usage: generate-release-notes.mjs [previous-tag] <head> <output-path>",
  );
}

const repository = process.env.GITHUB_REPOSITORY;
const serverUrl = process.env.GITHUB_SERVER_URL ?? "https://github.com";

if (!repository) {
  throw new Error("GITHUB_REPOSITORY is required to create release-note links");
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    ...options,
  }).trim();
}

function gitOrNull(args) {
  try {
    return git(args);
  } catch {
    return null;
  }
}

function metadataFrom(readme) {
  const frontmatter = readme?.match(/^---\n([\s\S]*?)\n---/m)?.[1];

  if (!frontmatter) {
    return null;
  }

  const metadata = frontmatter.match(/^metadata:\n([\s\S]*?)(?=^\S|$)/m)?.[1];

  if (!metadata) {
    return null;
  }

  const version = metadata.match(/^\s+version:\s*([^\s]+)\s*$/m)?.[1];
  const changelogMatch = metadata.match(/^\s+changelog:\s*(.*)$/m);
  const changelogValue = changelogMatch?.[1].trim();
  let changelog = changelogValue;

  if (changelogValue && /^[|>][-+]?\s*(?:#.*)?$/.test(changelogValue)) {
    const changelogLines = metadata
      .slice(changelogMatch.index + changelogMatch[0].length)
      .split("\n");

    changelog = undefined;

    for (const line of changelogLines) {
      if (!line.trim()) {
        continue;
      }

      if (!/^\s+/.test(line)) {
        break;
      }

      changelog = line.trim();
      break;
    }
  }

  return version && changelog ? { version, changelog } : null;
}

function readmeAt(commit, specPath) {
  return gitOrNull(["show", `${commit}:${specPath}/README.md`]);
}

function versionCommit(specPath, version) {
  const history = gitOrNull([
    "log",
    "--follow",
    "--format=%H",
    "--reverse",
    `-Sversion: ${version}`,
    head,
    "--",
    `${specPath}/README.md`,
  ]);

  return history?.split("\n")[0] ?? head;
}

function compareVersions(left, right) {
  const leftMatch = left
    .replace(/^v/, "")
    .match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  const rightMatch = right
    .replace(/^v/, "")
    .match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);

  if (!leftMatch || !rightMatch) {
    return right.localeCompare(left, undefined, { numeric: true });
  }

  for (let index = 1; index <= 3; index += 1) {
    const difference = Number(rightMatch[index]) - Number(leftMatch[index]);

    if (difference !== 0) {
      return difference;
    }
  }

  const leftPrerelease = leftMatch[4];
  const rightPrerelease = rightMatch[4];

  if (!leftPrerelease && !rightPrerelease) {
    return 0;
  }

  if (!leftPrerelease) {
    return -1;
  }

  if (!rightPrerelease) {
    return 1;
  }

  return rightPrerelease.localeCompare(leftPrerelease, undefined, {
    numeric: true,
  });
}

function encodePath(path) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function changedSpecPaths() {
  const emptyTree = git(["hash-object", "-t", "tree", "/dev/null"]);
  const range = previousTag
    ? `${previousTag}..${head}`
    : `${emptyTree}..${head}`;
  const changedFiles = git([
    "diff",
    "--name-only",
    "-z",
    range,
    "--",
    "specification",
  ]);

  return [
    ...new Set(
      changedFiles
        .split("\0")
        .map((file) => file.match(/^specification\/([^/]+)/)?.[1])
        .filter(Boolean),
    ),
  ].sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true }),
  );
}

function commitsForReadme(specPath) {
  const range = previousTag ? `${previousTag}..${head}` : head;
  const commits = gitOrNull([
    "log",
    "--format=%H",
    "--reverse",
    range,
    "--",
    `${specPath}/README.md`,
  ]);

  return commits ? commits.split("\n") : [];
}

function parentReadmeAt(commit, specPath) {
  const parent = gitOrNull(["rev-parse", `${commit}^`]);

  if (!parent) {
    return null;
  }

  const currentPath = `${specPath}/README.md`;
  const parentReadme = readmeAt(parent, specPath);

  if (parentReadme) {
    return parentReadme;
  }

  const changes = gitOrNull([
    "diff-tree",
    "--no-commit-id",
    "-r",
    "-M",
    "--name-status",
    commit,
  ]);
  const rename = changes
    ?.split("\n")
    .map((line) => line.split("\t"))
    .find(
      ([status, , newPath]) =>
        status?.startsWith("R") && newPath === currentPath,
    );

  return rename ? gitOrNull(["show", `${parent}:${rename[1]}`]) : null;
}

function versionsForSpec(specPath) {
  const versions = new Map();

  for (const commit of commitsForReadme(specPath)) {
    const metadata = metadataFrom(readmeAt(commit, specPath));
    const parentMetadata = metadataFrom(parentReadmeAt(commit, specPath));

    if (
      metadata &&
      (!parentMetadata ||
        metadata.version !== parentMetadata.version ||
        metadata.changelog !== parentMetadata.changelog) &&
      !versions.has(metadata.version)
    ) {
      versions.set(metadata.version, {
        changelog: metadata.changelog,
        commit,
      });
    }
  }

  if (versions.size === 0) {
    const currentMetadata = metadataFrom(readmeAt(head, specPath));

    if (currentMetadata) {
      versions.set(currentMetadata.version, {
        changelog: currentMetadata.changelog,
        commit: versionCommit(specPath, currentMetadata.version),
      });
    }
  }

  return [...versions.entries()].sort(([left], [right]) =>
    compareVersions(left, right),
  );
}

const notes = [];

for (const directory of changedSpecPaths()) {
  const specPath = `specification/${directory}`;
  const versions = versionsForSpec(specPath);

  if (versions.length === 0) {
    continue;
  }

  const specLink = `${serverUrl}/${repository}/tree/${head}/${encodePath(specPath)}`;
  notes.push(`- [${directory}](${specLink}):`);

  for (const [version, { changelog, commit }] of versions) {
    notes.push(
      `  - [v${version}](${serverUrl}/${repository}/commit/${commit}): ${changelog}`,
    );
  }
}

writeFileSync(outputPath, notes.length > 0 ? `${notes.join("\n")}\n` : "");
