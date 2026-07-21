import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const migrationPlanFixtureRoot = fileURLToPath(new URL("./migration-plan/", import.meta.url));

/** @returns {Record<string, string>} */
export function migrationPlanFixtureHashes() {
  /** @type {Record<string, string>} */
  const hashes = {};
  for (const relativePath of listFiles(migrationPlanFixtureRoot)) {
    const absolutePath = `${migrationPlanFixtureRoot}/${relativePath}`;
    hashes[relativePath] = createHash("sha256").update(readFileSync(absolutePath)).digest("hex");
  }
  return hashes;
}

/** @param {string} root @param {string} [prefix] @returns {string[]} */
function listFiles(root, prefix = "") {
  return readdirSync(`${root}/${prefix}`, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = `${prefix}${entry.name}`;
      return entry.isDirectory() ? listFiles(root, `${relativePath}/`) : [relativePath];
    })
    .sort();
}
