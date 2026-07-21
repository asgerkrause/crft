import { closeSync, constants, fstatSync, lstatSync, openSync, readSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

export const MAX_TEXT_BYTES = 1024 * 1024;
const EXCLUDED_DIRECTORIES = new Set([".git", "node_modules", "dist", "build", ".cache", "coverage", ".ssh", "ssh"]);

/**
 * Record every descendant without following symbolic links. Adoption integrity
 * uses the complete result; consumer collection may prune excluded directories.
 * @param {string} root
 * @param {{ pruneExcluded?: boolean, prune?: (entry: { relative: string, kind: "file" | "directory" | "symlink" | "other", excluded: boolean }) => boolean }} [options]
 * @returns {{ absolute: string, relative: string, kind: "file" | "directory" | "symlink" | "other", excluded: boolean }[]}
 */
export function enumerateTree(root, options = {}) {
  if (lstatSync(root).isSymbolicLink()) throw new TypeError("traversal root must not be a symlink");
  const entries = [];
  visit(root, root, entries, Boolean(options.pruneExcluded), options.prune);
  return entries;
}

/**
 * Walk consumer-eligible regular files, retaining the legacy narrow API.
 * @param {string} root
 * @returns {{ absolute: string, relative: string }[]}
 */
export function walkFiles(root) {
  return enumerateTree(root, { pruneExcluded: true })
    .filter((entry) => entry.kind === "file" && !entry.excluded)
    .map(({ absolute, relative: path }) => ({ absolute, relative: path }));
}

/**
 * Read a bounded regular file through a descriptor tied to the lstat identity.
 * @param {string} path
 * @param {number} [maxBytes]
 * @returns {{ bytes: Buffer } | { reason: "symlink" | "non-regular" | "oversized" | "unreadable" | "changed" }}
 */
export function readStableFile(path, maxBytes = MAX_TEXT_BYTES) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new TypeError("maxBytes must be a positive integer");

  let before;
  try {
    before = lstatSync(path);
  } catch {
    return { reason: "unreadable" };
  }
  if (before.isSymbolicLink()) return { reason: "symlink" };
  if (!before.isFile()) return { reason: "non-regular" };
  if (before.size > maxBytes) return { reason: "oversized" };

  let descriptor;
  try {
    descriptor = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  } catch {
    return { reason: "unreadable" };
  }
  try {
    const opened = fstatSync(descriptor);
    if (!sameIdentity(before, opened)) return { reason: "changed" };
    const bytes = Buffer.alloc(opened.size);
    let offset = 0;
    while (offset < bytes.length) {
      const count = readSync(descriptor, bytes, offset, bytes.length - offset, null);
      if (!count) return { reason: "changed" };
      offset += count;
    }
    const after = lstatSync(path);
    const finished = fstatSync(descriptor);
    if (!sameIdentity(before, after) || !sameIdentity(opened, finished) || finished.size !== bytes.length) {
      return { reason: "changed" };
    }
    return { bytes };
  } catch {
    return { reason: "unreadable" };
  } finally {
    closeSync(descriptor);
  }
}

/**
 * Inspect text eligibility without concealing why a source record was skipped.
 * @param {string} path
 * @param {number} [maxBytes]
 * @returns {{ text: string } | { reason: "symlink" | "non-regular" | "oversized" | "binary" | "unreadable" | "changed" }}
 */
export function inspectTextFile(path, maxBytes = MAX_TEXT_BYTES) {
  const result = readStableFile(path, maxBytes);
  if ("reason" in result) return result;
  if (result.bytes.includes(0)) return { reason: "binary" };
  return { text: result.bytes.toString("utf8") };
}

/**
 * Read at most `maxBytes` bytes from a stable non-binary regular file.
 * @param {string} path
 * @param {number} [maxBytes]
 * @returns {string | undefined}
 */
export function readTextFile(path, maxBytes = MAX_TEXT_BYTES) {
  const result = inspectTextFile(path, maxBytes);
  return "text" in result ? result.text : undefined;
}

/** @param {string} root @param {string} directory @param {ReturnType<typeof enumerateTree>} entries @param {boolean} pruneExcluded @param {((entry: { relative: string, kind: "file" | "directory" | "symlink" | "other", excluded: boolean }) => boolean) | undefined} prune */
function visit(root, directory, entries, pruneExcluded, prune) {
  const names = readdirSync(directory).sort(compareText);
  for (const name of names) {
    const absolute = join(directory, name);
    let stat;
    try {
      stat = lstatSync(absolute);
    } catch {
      entries.push({ absolute, relative: relativePath(root, absolute), kind: "other", excluded: isExcluded(name) });
      continue;
    }
    const kind = stat.isSymbolicLink() ? "symlink" : stat.isDirectory() ? "directory" : stat.isFile() ? "file" : "other";
    const entry = { absolute, relative: relativePath(root, absolute), kind, excluded: isExcluded(name) };
    entries.push(entry);
    if (kind === "directory" && !(pruneExcluded && entry.excluded) && !prune?.(entry)) {
      visit(root, absolute, entries, pruneExcluded, prune);
    }
  }
}

/** @param {import("node:fs").Stats} left @param {import("node:fs").Stats} right */
function sameIdentity(left, right) {
  return left.isFile() && right.isFile() && left.dev === right.dev && left.ino === right.ino;
}

/** @param {string} root @param {string} path */
function relativePath(root, path) {
  return relative(root, path).split("\\").join("/");
}

/** @param {string} name */
export function isExcluded(name) {
  const lower = name.toLowerCase();
  return EXCLUDED_DIRECTORIES.has(name)
    || lower.startsWith(".env")
    || lower.endsWith(".pem")
    || lower.endsWith(".key")
    || lower.includes("ssh");
}

/** @param {string} left @param {string} right */
function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
