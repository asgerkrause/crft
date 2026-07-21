import { closeSync, lstatSync, openSync, readSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

export const MAX_TEXT_BYTES = 1024 * 1024;
const EXCLUDED_DIRECTORIES = new Set([".git", "node_modules", "dist", "build", ".cache", "coverage", ".ssh", "ssh"]);

/**
 * Walk regular files beneath a real root. Entries are relative POSIX paths in lexical order.
 * @param {string} root
 * @returns {{ absolute: string, relative: string }[]}
 */
export function walkFiles(root) {
  if (lstatSync(root).isSymbolicLink()) throw new TypeError("traversal root must not be a symlink");
  /** @type {{ absolute: string, relative: string }[]} */
  const files = [];
  visit(root, root, files);
  return files;
}

/**
 * Read at most `maxBytes` bytes from a regular non-symlink file.
 * @param {string} path
 * @param {number} [maxBytes]
 * @returns {string | undefined}
 */
export function readTextFile(path, maxBytes = MAX_TEXT_BYTES) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new TypeError("maxBytes must be a positive integer");
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > maxBytes) return;

  const descriptor = openSync(path, "r");
  try {
    const buffer = Buffer.alloc(maxBytes + 1);
    const bytes = readSync(descriptor, buffer, 0, buffer.length, 0);
    if (bytes > maxBytes) return;
    return buffer.subarray(0, bytes).toString("utf8");
  } finally {
    closeSync(descriptor);
  }
}

/** @param {string} root @param {string} directory @param {{ absolute: string, relative: string }[]} files */
function visit(root, directory, files) {
  const entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
  for (const entry of entries) {
    if (isExcluded(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      visit(root, path, files);
    } else if (entry.isFile()) {
      files.push({ absolute: path, relative: relative(root, path).split("\\").join("/") });
    }
  }
}

/** @param {string} name */
function isExcluded(name) {
  const lower = name.toLowerCase();
  return EXCLUDED_DIRECTORIES.has(name)
    || lower.startsWith(".env")
    || lower.endsWith(".pem")
    || lower.endsWith(".key")
    || lower.includes("ssh");
}
