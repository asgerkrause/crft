import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { validateFindingPath } from "../contracts/finding.mjs";

/**
 * Create an isolated temporary fixture and register cleanup with node:test.
 * @param {{ after: (callback: () => void) => void }} t
 * @param {Record<string, string>} [files]
 */
export function createFixture(t, files = {}) {
  const root = mkdtempSync(join(tmpdir(), "seess-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));

  for (const [relativePath, contents] of Object.entries(files)) {
    const pathError = validateFindingPath(relativePath);
    if (pathError || typeof contents !== "string") {
      throw new TypeError("fixture files must map relative POSIX paths to strings");
    }
    const path = join(root, relativePath);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents);
  }
  return root;
}
