import { lstatSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { validateFindingPath } from "../contracts/finding.mjs";

/**
 * Resolve explicit, existing scope paths without following symlinks.
 * @param {{ root: unknown, entrypoint?: unknown, adoption?: unknown }} input
 */
export function resolveScope(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("scope input must be an object");
  }
  const root = resolveRoot(input.root);
  if (input.entrypoint === undefined && input.adoption === undefined) {
    throw new TypeError("scope requires entrypoint or adoption");
  }

  const scope = { root };
  if (input.entrypoint !== undefined) {
    scope.entrypoint = resolveScopedPath(root, input.entrypoint, "file");
  }
  if (input.adoption !== undefined) {
    scope.adoption = resolveScopedPath(root, input.adoption, "directory");
  }
  return scope;
}

/** @param {unknown} root */
export function resolveRoot(root) {
  if (typeof root !== "string" || !isAbsolute(root)) {
    throw new TypeError("root must be an explicit absolute path");
  }
  assertNotSymlink(root);
  const rootPath = safeRealpath(root, "root");
  if (!statSync(rootPath).isDirectory()) throw new TypeError("root must be a directory");
  assertNoSymlink(rootPath, rootPath);
  return rootPath;
}

/**
 * Resolve a root-relative existing path, rejecting every symlink in its path.
 * @param {string} root
 * @param {unknown} path
 * @param {"file" | "directory"} type
 */
export function resolveScopedPath(root, path, type) {
  const pathError = validateFindingPath(path);
  if (pathError) throw new TypeError("scope paths must be relative POSIX paths");

  const candidate = resolve(root, ...path.split("/"));
  assertInsideRoot(root, candidate);
  assertNoSymlink(root, candidate);
  const resolved = safeRealpath(candidate, "scope path");
  assertInsideRoot(root, resolved);
  if (type === "file" && !statSync(resolved).isFile()) throw new TypeError("entrypoint must be a file");
  if (type === "directory" && !statSync(resolved).isDirectory()) throw new TypeError("adoption must be a directory");
  return { absolute: resolved, relative: toRelativePosix(root, resolved) };
}

/** @param {string} root @param {string} candidate */
export function assertInsideRoot(root, candidate) {
  const path = relative(root, candidate);
  if (path === "" || (!path.startsWith("..") && !isAbsolute(path))) return;
  throw new TypeError("path resolves outside root");
}

/** @param {string} root @param {string} candidate */
export function assertNoSymlink(root, candidate) {
  let current = root;
  assertNotSymlink(current);
  const suffix = relative(root, candidate);
  for (const segment of suffix.split(/[/\\]/)) {
    if (!segment) continue;
    current = join(current, segment);
    assertNotSymlink(current);
  }
}

/** @param {string} path */
function assertNotSymlink(path) {
  try {
    if (lstatSync(path).isSymbolicLink()) throw new TypeError("symlinks are not allowed in scope");
  } catch (error) {
    if (error instanceof TypeError) throw error;
    throw new TypeError("scope path does not exist");
  }
}

/** @param {string} path @param {string} label */
function safeRealpath(path, label) {
  try {
    return realpathSync.native(path);
  } catch {
    throw new TypeError(`${label} does not exist`);
  }
}

/** @param {string} root @param {string} path */
function toRelativePosix(root, path) {
  return relative(root, path).split("\\").join("/");
}
