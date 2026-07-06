import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";

const partialNames = ["system.css", "reset.css", "grid.css", "type.css", "wrappers.css", "motion.css", "site.css"] as const;
type Mode = "auto" | "static" | "fluid";
type Action = "create" | "update" | "skip" | "manual";

type Operation = {
	action: Action;
	path?: string;
	reason: string;
};

type Args = {
	project: string;
	mode: Mode;
	dryRun: boolean;
	force: boolean;
	json: boolean;
	importEntry: boolean;
};

const defaultArgs: Args = {
	project: process.cwd(),
	mode: "auto",
	dryRun: false,
	force: false,
	json: false,
	importEntry: true,
};

function usage(message?: string): never {
	if (message) console.error(message);
	console.error(`craft-css-scaffold\n\nUsage:\n  bun ~/craft/scripts/craft-css-scaffold.ts [--project path] [--mode auto|static|fluid] [--dry-run] [--force] [--json] [--no-import]\n\nDefaults: --project cwd --mode auto. Existing files are preserved unless --force is set.`);
	process.exit(message ? 1 : 0);
}

function parseArgs(argv: string[]): Args {
	const args = { ...defaultArgs };
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--help" || arg === "-h") usage();
		if (arg === "--project") {
			const value = argv[++index];
			if (!value) usage("--project requires a path");
			args.project = value;
			continue;
		}
		if (arg === "--mode") {
			const value = argv[++index] as Mode | undefined;
			if (!value || !["auto", "static", "fluid"].includes(value)) usage("--mode must be auto, static, or fluid");
			args.mode = value;
			continue;
		}
		if (arg === "--dry-run") {
			args.dryRun = true;
			continue;
		}
		if (arg === "--force") {
			args.force = true;
			continue;
		}
		if (arg === "--json") {
			args.json = true;
			continue;
		}
		if (arg === "--no-import") {
			args.importEntry = false;
			continue;
		}
		usage(`unknown argument: ${arg}`);
	}
	args.project = resolve(args.project);
	return args;
}

function existsFile(path: string) {
	try {
		return existsSync(path) && statSync(path).isFile();
	} catch {
		return false;
	}
}

function existsDir(path: string) {
	try {
		return existsSync(path) && statSync(path).isDirectory();
	} catch {
		return false;
	}
}

function read(path: string) {
	return readFileSync(path, "utf8");
}

function slash(path: string) {
	return path.split(sep).join("/");
}

function rel(root: string, path: string) {
	return slash(relative(root, path)) || ".";
}

function importPath(fromFile: string, toFile: string) {
	let value = slash(relative(dirname(fromFile), toFile));
	if (!value.startsWith(".")) value = `./${value}`;
	return value;
}

function walk(root: string, skip = new Set([".git", "node_modules", "dist", "build", ".next", ".svelte-kit", "coverage"])): string[] {
	if (!existsDir(root)) return [];
	const entries = readdirSync(root, { withFileTypes: true });
	return entries.flatMap((entry) => {
		if (skip.has(entry.name)) return [];
		const path = join(root, entry.name);
		if (entry.isDirectory()) return walk(path, skip);
		return entry.isFile() ? [path] : [];
	});
}

function detectShell(root: string) {
	const candidates = [
		"src/styles.css",
		"src/app.css",
		"src/styles/global.css",
		"src/lib/styles/global.css",
		"src/lib/global.css",
		"app/globals.css",
		"src/app/globals.css",
		"src/styles/styles.css",
	];
	const existing = candidates.find((candidate) => existsFile(join(root, candidate)));
	return join(root, existing ?? "src/styles.css");
}

function partialDir(root: string, shell: string) {
	const shellDir = dirname(shell);
	if (shellDir.endsWith(`${sep}styles`)) return shellDir;
	if (slash(relative(root, shellDir)).startsWith("app")) return join(shellDir, "styles");
	return join(root, "src", "styles");
}

function resolveMode(root: string, mode: Mode): "static" | "fluid" {
	if (mode !== "auto") return mode;
	const css = walk(root)
		.filter((path) => extname(path) === ".css")
		.slice(0, 80)
		.map((path) => read(path))
		.join("\n");
	return /--l-fluid|--[a-z0-9-]+-(min|max)\s*:/.test(css) ? "fluid" : "static";
}

function shellTemplate(shell: string, partials: string[]) {
	return `@layer global, themes, reset, grid, type, wrappers, motion, project;\n\n${partials.map((path) => `@import "${importPath(shell, path)}";`).join("\n")}\n`;
}

function hasImport(text: string, path: string) {
	const quoted = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`@import\\s+(?:url\\()?['\"]${quoted}['\"]`).test(text);
}

function patchShell(existing: string, shell: string, partials: string[]) {
	const imports = partials
		.map((path) => importPath(shell, path))
		.filter((path) => !hasImport(existing, path))
		.map((path) => `@import "${path}";`);
	const needsPrelude = !/@layer\s+global\s*,\s*themes\s*,\s*reset\s*,\s*grid\s*,\s*type\s*,\s*wrappers\s*,\s*motion/.test(existing);
	if (!needsPrelude && imports.length === 0) return existing;
	const block = `${needsPrelude ? "@layer global, themes, reset, grid, type, wrappers, motion, project;\n" : ""}${imports.join("\n")}\n\n`;
	const charset = existing.match(/^@charset\s+[^;]+;\s*/);
	if (!charset) return block + existing;
	return charset[0] + block + existing.slice(charset[0].length);
}

function writePlanned(root: string, path: string, content: string, force: boolean, dryRun: boolean, operations: Operation[]) {
	if (existsFile(path) && !force) {
		operations.push({ action: "skip", path: rel(root, path), reason: "exists; pass --force to overwrite" });
		return;
	}
	const action: Action = existsFile(path) ? "update" : "create";
	operations.push({ action, path: rel(root, path), reason: action === "create" ? "new scaffold file" : "--force overwrite" });
	if (dryRun) return;
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content.endsWith("\n") ? content : `${content}\n`);
}

function writeShell(root: string, shell: string, partials: string[], force: boolean, dryRun: boolean, operations: Operation[]) {
	if (!existsFile(shell)) {
		operations.push({ action: "create", path: rel(root, shell), reason: "CSS import shell" });
		if (!dryRun) {
			mkdirSync(dirname(shell), { recursive: true });
			writeFileSync(shell, shellTemplate(shell, partials));
		}
		return;
	}
	const existing = read(shell);
	const next = force ? shellTemplate(shell, partials) : patchShell(existing, shell, partials);
	if (next === existing) {
		operations.push({ action: "skip", path: rel(root, shell), reason: "shell already imports scaffold files" });
		return;
	}
	operations.push({ action: "update", path: rel(root, shell), reason: force ? "--force shell rewrite" : "add missing layer/import lines" });
	if (!dryRun) writeFileSync(shell, next.endsWith("\n") ? next : `${next}\n`);
}

function systemTemplate(mode: "static" | "fluid") {
	const scale = mode === "fluid" ? fluidScale() : staticScale();
	return `@layer global, themes;\n\n@layer global {\n  :root {\n    color-scheme: light;\n    interpolate-size: allow-keywords;\n    hanging-punctuation: first last;\n    text-wrap: pretty;\n\n    /* Craft starter values. Replace with project-owned values when brand/source truth exists. */\n${scale}\n\n    --z-base: 0;\n    --z-head: 1000;\n    --z-pop: 2000;\n    --z-modal: 3000;\n    --z-toast: 4000;\n\n    --t-ff-ss: system-ui, sans-serif;\n    --t-ff-se: Georgia, serif;\n    --t-ff-mo: ui-monospace, SFMono-Regular, Consolas, monospace;\n    --t-ff-display: var(--t-ff-ss);\n    --t-ff-hand: cursive;\n    --t-ffs: normal;\n    --t-fw-l: 300;\n    --t-fw-r: 400;\n    --t-fw-b: 700;\n\n    --t-h0-ff: var(--t-ff-display); --t-h0-fw: var(--t-fw-b); --t-h0-ls: -0.04em; --t-h0-mw: 11ch; --t-h0-tt: none;\n    --t-h1-ff: var(--t-ff-display); --t-h1-fw: var(--t-fw-b); --t-h1-ls: -0.035em; --t-h1-mw: 13ch; --t-h1-tt: none;\n    --t-h2-ff: var(--t-ff-display); --t-h2-fw: var(--t-fw-b); --t-h2-ls: -0.03em; --t-h2-mw: 16ch; --t-h2-tt: none;\n    --t-h3-ff: var(--t-ff-display); --t-h3-fw: var(--t-fw-b); --t-h3-ls: -0.02em; --t-h3-mw: 22ch; --t-h3-tt: none;\n    --t-h4-ff: var(--t-ff-ss); --t-h4-fw: var(--t-fw-b); --t-h4-ls: -0.01em; --t-h4-mw: 28ch; --t-h4-tt: none;\n    --t-h5-ff: var(--t-ff-ss); --t-h5-fw: var(--t-fw-b); --t-h5-ls: 0; --t-h5-mw: 34ch; --t-h5-tt: none;\n    --t-h6-ff: var(--t-ff-ss); --t-h6-fw: var(--t-fw-b); --t-h6-ls: 0.02em; --t-h6-mw: 42ch; --t-h6-tt: none;\n    --t-lg-ff: var(--t-ff-ss); --t-lg-fw: var(--t-fw-r); --t-lg-ls: -0.01em; --t-lg-mw: 62ch; --t-lg-tt: none;\n    --t-md-ff: var(--t-ff-ss); --t-md-fw: var(--t-fw-r); --t-md-ls: 0; --t-md-mw: 68ch; --t-md-tt: none;\n    --t-sm-ff: var(--t-ff-ss); --t-sm-fw: var(--t-fw-r); --t-sm-ls: 0; --t-sm-mw: 72ch; --t-sm-tt: none;\n\n    --t-h0: var(--t-h0-fw) var(--t-h0-fs) / var(--t-h0-lh) var(--t-h0-ff);\n    --t-h1: var(--t-h1-fw) var(--t-h1-fs) / var(--t-h1-lh) var(--t-h1-ff);\n    --t-h2: var(--t-h2-fw) var(--t-h2-fs) / var(--t-h2-lh) var(--t-h2-ff);\n    --t-h3: var(--t-h3-fw) var(--t-h3-fs) / var(--t-h3-lh) var(--t-h3-ff);\n    --t-h4: var(--t-h4-fw) var(--t-h4-fs) / var(--t-h4-lh) var(--t-h4-ff);\n    --t-h5: var(--t-h5-fw) var(--t-h5-fs) / var(--t-h5-lh) var(--t-h5-ff);\n    --t-h6: var(--t-h6-fw) var(--t-h6-fs) / var(--t-h6-lh) var(--t-h6-ff);\n    --t-lg: var(--t-lg-fw) var(--t-lg-fs) / var(--t-lg-lh) var(--t-lg-ff);\n    --t-md: var(--t-md-fw) var(--t-md-fs) / var(--t-md-lh) var(--t-md-ff);\n    --t-sm: var(--t-sm-fw) var(--t-sm-fs) / var(--t-sm-lh) var(--t-sm-ff);\n\n    --c-bg: #ffffff;\n    --c-fg: #111111;\n    --c-sur: #f4f4f2;\n    --c-ink: var(--c-fg);\n    --c-mut: color-mix(in srgb, var(--c-fg) 62%, var(--c-bg));\n    --c-bor: color-mix(in srgb, var(--c-fg) 16%, var(--c-bg));\n    --c-acc: #2454ff;\n    --c-acc-ink: #ffffff;\n    --c-sec: #6f4dff;\n    --c-sec-ink: #ffffff;\n    --c-good: #0f7b45;\n    --c-warn: #9a6400;\n    --c-bad: #b42318;\n\n    --c-neu-00: #ffffff;\n    --c-neu-05: color-mix(in srgb, var(--c-fg) 5%, var(--c-bg));\n    --c-neu-10: color-mix(in srgb, var(--c-fg) 10%, var(--c-bg));\n    --c-neu-20: color-mix(in srgb, var(--c-fg) 20%, var(--c-bg));\n    --c-neu-40: color-mix(in srgb, var(--c-fg) 40%, var(--c-bg));\n    --c-neu-60: color-mix(in srgb, var(--c-fg) 60%, var(--c-bg));\n    --c-neu-80: color-mix(in srgb, var(--c-fg) 80%, var(--c-bg));\n    --c-neu-100: #111111;\n    --c-acc-05: color-mix(in srgb, var(--c-acc) 8%, var(--c-bg));\n    --c-acc-20: color-mix(in srgb, var(--c-acc) 24%, var(--c-bg));\n    --c-acc-60: color-mix(in srgb, var(--c-acc) 76%, var(--c-fg));\n    --c-sec-05: color-mix(in srgb, var(--c-sec) 8%, var(--c-bg));\n    --c-sec-20: color-mix(in srgb, var(--c-sec) 24%, var(--c-bg));\n    --c-sec-60: color-mix(in srgb, var(--c-sec) 76%, var(--c-fg));\n    --c-good-sur: color-mix(in srgb, var(--c-good) 14%, var(--c-bg));\n    --c-good-ink: color-mix(in srgb, var(--c-good) 78%, var(--c-fg));\n    --c-good-bor: color-mix(in srgb, var(--c-good) 36%, var(--c-bg));\n    --c-warn-sur: color-mix(in srgb, var(--c-warn) 14%, var(--c-bg));\n    --c-warn-ink: color-mix(in srgb, var(--c-warn) 78%, var(--c-fg));\n    --c-warn-bor: color-mix(in srgb, var(--c-warn) 36%, var(--c-bg));\n    --c-bad-sur: color-mix(in srgb, var(--c-bad) 14%, var(--c-bg));\n    --c-bad-ink: color-mix(in srgb, var(--c-bad) 78%, var(--c-fg));\n    --c-bad-bor: color-mix(in srgb, var(--c-bad) 36%, var(--c-bg));\n\n    --e-btn-sur: var(--c-fg);\n    --e-btn-ink: var(--c-bg);\n    --e-btn-bor: transparent;\n    --e-btn-vis-sur: color-mix(in srgb, var(--e-btn-ink) 15%, var(--e-btn-sur));\n    --e-btn-vis-ink: color-mix(in srgb, var(--e-btn-ink) 82%, var(--e-btn-sur));\n    --e-crd-sur: var(--c-sur);\n    --e-crd-ink: var(--c-ink);\n    --e-crd-bor: transparent;\n    --e-inp-sur: var(--c-bg);\n    --e-inp-ink: var(--c-ink);\n    --e-inp-bor: var(--c-bor);\n    --e-bdg-sur: var(--c-sur);\n    --e-bdg-ink: var(--c-mut);\n    --e-head-sur: color-mix(in srgb, var(--c-bg) 92%, transparent);\n    --e-head-ink: var(--c-ink);\n    --e-foot-sur: var(--c-fg);\n    --e-foot-ink: var(--c-bg);\n\n    --m-td-sf: 50ms;\n    --m-td-f: 120ms;\n    --m-td: 200ms;\n    --m-td-s: 420ms;\n    --m-td-ss: 800ms;\n    --m-tf-i: cubic-bezier(0.5, 0, 0.8, 0);\n    --m-tf-o: cubic-bezier(0.2, 1, 0.5, 1);\n    --m-tf-io: cubic-bezier(0.8, 0, 0.2, 1);\n    --m-tf-s: cubic-bezier(0.16, 1, 0.3, 1);\n    --m-tf: var(--m-tf-o);\n\n    --i-hov-t: 0; --i-hov-f: 1;\n    --i-foc-t: 0; --i-foc-f: 1;\n    --i-prs-t: 0; --i-prs-f: 1;\n    --i-exp-t: 0; --i-exp-f: 1;\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    :root {\n      --m-td-sf: 1ms;\n      --m-td-f: 1ms;\n      --m-td: 1ms;\n      --m-td-s: 1ms;\n      --m-td-ss: 1ms;\n      --m-tf-i: linear;\n      --m-tf-o: linear;\n      --m-tf-io: linear;\n      --m-tf-s: linear;\n      --m-tf: linear;\n    }\n  }\n}\n\n@layer themes {\n  [data-theme=\"tone\"] {\n    --c-bg: var(--c-sur);\n    --c-ink: var(--c-fg);\n  }\n\n  [data-theme=\"accent\"] {\n    --c-bg: var(--c-acc);\n    --c-fg: var(--c-acc-ink);\n    --c-sur: color-mix(in srgb, var(--c-acc-ink) 12%, var(--c-acc));\n    --c-ink: var(--c-acc-ink);\n    --c-mut: color-mix(in srgb, var(--c-acc-ink) 72%, var(--c-acc));\n    --c-bor: color-mix(in srgb, var(--c-acc-ink) 24%, var(--c-acc));\n  }\n\n  [data-theme=\"secondary\"] {\n    --c-bg: var(--c-sec);\n    --c-fg: var(--c-sec-ink);\n    --c-sur: color-mix(in srgb, var(--c-sec-ink) 12%, var(--c-sec));\n    --c-ink: var(--c-sec-ink);\n    --c-mut: color-mix(in srgb, var(--c-sec-ink) 72%, var(--c-sec));\n    --c-bor: color-mix(in srgb, var(--c-sec-ink) 24%, var(--c-sec));\n  }\n\n  [data-theme=\"invert\"] {\n    --c-bg: var(--c-neu-100);\n    --c-fg: var(--c-neu-00);\n    --c-sur: color-mix(in srgb, var(--c-neu-00) 10%, var(--c-neu-100));\n    --c-ink: var(--c-neu-00);\n    --c-mut: color-mix(in srgb, var(--c-neu-00) 70%, var(--c-neu-100));\n    --c-bor: color-mix(in srgb, var(--c-neu-00) 22%, var(--c-neu-100));\n  }\n}\n`;
}

function staticScale() {
	return `    --l-mw: 72rem;\n    --l-mw-sm: 48rem;\n    --l-mw-lg: 90rem;\n    --l-fluid: 0;\n    --l-gc: 12;\n    --l-cs: 1;\n    --l-rs: 1;\n    --l-or: auto;\n    --l-st: 0;\n\n    --s-py: 6rem;\n    --s-px: 1.25rem;\n    --s-ss: 3rem;\n    --s-gp: 1rem;\n    --s-gp-xl: calc(var(--s-gp) * 4);\n    --s-gp-lg: calc(var(--s-gp) * 2);\n    --s-gp-sm: calc(var(--s-gp) * 0.5);\n    --s-gp-xs: calc(var(--s-gp) * 0.25);\n    --s-pd: 1rem;\n    --s-pd-lg: calc(var(--s-pd) * 1.5);\n    --s-pd-sm: calc(var(--s-pd) * 0.66);\n    --s-br: 0.75rem;\n    --s-br-sm: calc(var(--s-br) * 0.66);\n    --s-br-pill: 100vw;\n    --s-bw: 1px;\n\n    --t-h0-fs: 5rem; --t-h0-lh: 0.95;\n    --t-h1-fs: 3.5rem; --t-h1-lh: 0.98;\n    --t-h2-fs: 2.5rem; --t-h2-lh: 1;\n    --t-h3-fs: 2rem; --t-h3-lh: 1.05;\n    --t-h4-fs: 1.5rem; --t-h4-lh: 1.1;\n    --t-h5-fs: 1.25rem; --t-h5-lh: 1.15;\n    --t-h6-fs: 1rem; --t-h6-lh: 1.2;\n    --t-lg-fs: 1.25rem; --t-lg-lh: 1.45;\n    --t-md-fs: 1rem; --t-md-lh: 1.55;\n    --t-sm-fs: 0.875rem; --t-sm-lh: 1.45;`;
}

function fluidScale() {
	return `    --l-mw-min: 30;\n    --l-mw-max: 90;\n    --s-px-min: 1;\n    --s-px-max: 1.5;\n    --l-mw-total: calc(var(--l-mw-max) + var(--s-px-max) * 2);\n    --l-fluid: clamp(0, calc((100vw - var(--l-mw-min) * 1rem) / (var(--l-mw-total) - var(--l-mw-min))), 1);\n    --l-mw: calc((var(--l-mw-total) * 1rem) - (var(--s-px) * 2));\n    --l-mw-sm: calc(var(--l-mw) * 0.72);\n    --l-mw-lg: calc(var(--l-mw) * 1.2);\n    --l-gc: 12;\n    --l-cs: 1;\n    --l-rs: 1;\n    --l-or: auto;\n    --l-st: 0;\n\n    --s-py-min: 4; --s-py-max: 8;\n    --s-ss-min: 2; --s-ss-max: 4;\n    --s-gp-min: 0.75; --s-gp-max: 1.5;\n    --s-pd-min: 0.875; --s-pd-max: 1.5;\n    --s-br-min: 0.5; --s-br-max: 0.875;\n    --s-py: clamp(var(--s-py-min) * 1rem, var(--s-py-min) * 1rem + (var(--s-py-max) - var(--s-py-min)) * var(--l-fluid), var(--s-py-max) * 1rem);\n    --s-px: clamp(var(--s-px-min) * 1rem, var(--s-px-min) * 1rem + (var(--s-px-max) - var(--s-px-min)) * var(--l-fluid), var(--s-px-max) * 1rem);\n    --s-ss: clamp(var(--s-ss-min) * 1rem, var(--s-ss-min) * 1rem + (var(--s-ss-max) - var(--s-ss-min)) * var(--l-fluid), var(--s-ss-max) * 1rem);\n    --s-gp: clamp(var(--s-gp-min) * 1rem, var(--s-gp-min) * 1rem + (var(--s-gp-max) - var(--s-gp-min)) * var(--l-fluid), var(--s-gp-max) * 1rem);\n    --s-pd: clamp(var(--s-pd-min) * 1rem, var(--s-pd-min) * 1rem + (var(--s-pd-max) - var(--s-pd-min)) * var(--l-fluid), var(--s-pd-max) * 1rem);\n    --s-br: clamp(var(--s-br-min) * 1rem, var(--s-br-min) * 1rem + (var(--s-br-max) - var(--s-br-min)) * var(--l-fluid), var(--s-br-max) * 1rem);\n    --s-gp-xl: calc(var(--s-gp) * 4);\n    --s-gp-lg: calc(var(--s-gp) * 2);\n    --s-gp-sm: calc(var(--s-gp) * 0.5);\n    --s-gp-xs: calc(var(--s-gp) * 0.25);\n    --s-pd-lg: calc(var(--s-pd) * 1.5);\n    --s-pd-sm: calc(var(--s-pd) * 0.66);\n    --s-br-sm: calc(var(--s-br) * 0.66);\n    --s-br-pill: 100vw;\n    --s-bw: 1px;\n\n    --t-h0-fs-min: 3; --t-h0-fs-max: 6; --t-h0-lh: 0.95;\n    --t-h1-fs-min: 2.4; --t-h1-fs-max: 4.25; --t-h1-lh: 0.98;\n    --t-h2-fs-min: 1.9; --t-h2-fs-max: 3; --t-h2-lh: 1;\n    --t-h3-fs-min: 1.5; --t-h3-fs-max: 2.25; --t-h3-lh: 1.05;\n    --t-h4-fs-min: 1.25; --t-h4-fs-max: 1.65; --t-h4-lh: 1.1;\n    --t-h5-fs-min: 1.125; --t-h5-fs-max: 1.35; --t-h5-lh: 1.15;\n    --t-h6-fs-min: 1; --t-h6-fs-max: 1.1; --t-h6-lh: 1.2;\n    --t-lg-fs-min: 1.125; --t-lg-fs-max: 1.35; --t-lg-lh: 1.45;\n    --t-md-fs-min: 1; --t-md-fs-max: 1.0625; --t-md-lh: 1.55;\n    --t-sm-fs-min: 0.8125; --t-sm-fs-max: 0.9; --t-sm-lh: 1.45;\n    --t-h0-fs: clamp(var(--t-h0-fs-min) * 1rem, var(--t-h0-fs-min) * 1rem + (var(--t-h0-fs-max) - var(--t-h0-fs-min)) * var(--l-fluid), var(--t-h0-fs-max) * 1rem);\n    --t-h1-fs: clamp(var(--t-h1-fs-min) * 1rem, var(--t-h1-fs-min) * 1rem + (var(--t-h1-fs-max) - var(--t-h1-fs-min)) * var(--l-fluid), var(--t-h1-fs-max) * 1rem);\n    --t-h2-fs: clamp(var(--t-h2-fs-min) * 1rem, var(--t-h2-fs-min) * 1rem + (var(--t-h2-fs-max) - var(--t-h2-fs-min)) * var(--l-fluid), var(--t-h2-fs-max) * 1rem);\n    --t-h3-fs: clamp(var(--t-h3-fs-min) * 1rem, var(--t-h3-fs-min) * 1rem + (var(--t-h3-fs-max) - var(--t-h3-fs-min)) * var(--l-fluid), var(--t-h3-fs-max) * 1rem);\n    --t-h4-fs: clamp(var(--t-h4-fs-min) * 1rem, var(--t-h4-fs-min) * 1rem + (var(--t-h4-fs-max) - var(--t-h4-fs-min)) * var(--l-fluid), var(--t-h4-fs-max) * 1rem);\n    --t-h5-fs: clamp(var(--t-h5-fs-min) * 1rem, var(--t-h5-fs-min) * 1rem + (var(--t-h5-fs-max) - var(--t-h5-fs-min)) * var(--l-fluid), var(--t-h5-fs-max) * 1rem);\n    --t-h6-fs: clamp(var(--t-h6-fs-min) * 1rem, var(--t-h6-fs-min) * 1rem + (var(--t-h6-fs-max) - var(--t-h6-fs-min)) * var(--l-fluid), var(--t-h6-fs-max) * 1rem);\n    --t-lg-fs: clamp(var(--t-lg-fs-min) * 1rem, var(--t-lg-fs-min) * 1rem + (var(--t-lg-fs-max) - var(--t-lg-fs-min)) * var(--l-fluid), var(--t-lg-fs-max) * 1rem);\n    --t-md-fs: clamp(var(--t-md-fs-min) * 1rem, var(--t-md-fs-min) * 1rem + (var(--t-md-fs-max) - var(--t-md-fs-min)) * var(--l-fluid), var(--t-md-fs-max) * 1rem);\n    --t-sm-fs: clamp(var(--t-sm-fs-min) * 1rem, var(--t-sm-fs-min) * 1rem + (var(--t-sm-fs-max) - var(--t-sm-fs-min)) * var(--l-fluid), var(--t-sm-fs-max) * 1rem);`;
}

function resetTemplate() {
	return `@layer reset {\n  *, *::before, *::after { box-sizing: border-box; }\n\n  html {\n    min-height: 100%;\n    scroll-behavior: smooth;\n  }\n\n  body {\n    min-height: 100%;\n    margin: 0;\n    background: var(--c-bg);\n    color: var(--c-ink);\n    font: var(--t-md);\n    font-feature-settings: var(--t-ffs);\n    text-rendering: optimizeLegibility;\n    -webkit-font-smoothing: antialiased;\n  }\n\n  :where(img, picture, svg, video, canvas) {\n    display: block;\n    max-width: 100%;\n  }\n\n  :where(input, button, textarea, select) {\n    font: inherit;\n  }\n\n  :where(button, [role=\"button\"]) {\n    cursor: pointer;\n  }\n\n  :where(a) {\n    color: inherit;\n    text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);\n    text-underline-offset: 0.18em;\n  }\n\n  :where(:focus-visible) {\n    outline: max(2px, var(--s-bw)) solid var(--c-acc);\n    outline-offset: 0.18em;\n  }\n\n  :where(h1, h2, h3, h4, h5, h6, p, figure, blockquote, ul, ol, dl) {\n    margin-block: 0;\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    *, *::before, *::after {\n      animation-duration: 1ms !important;\n      animation-iteration-count: 1 !important;\n      scroll-behavior: auto !important;\n      transition-duration: 1ms !important;\n    }\n  }\n}\n`;
}

function gridTemplate() {
	return `@layer grid {\n  [g] {\n    display: grid;\n    width: 100%;\n    grid-template-columns: repeat(var(--l-gc), minmax(0, 1fr));\n    column-gap: var(--s-gp);\n    row-gap: var(--s-gp);\n  }\n\n  [g], [g=\"sg\"] {\n    > * {\n      width: 100%;\n      order: var(--or, auto);\n      grid-column: auto / span var(--l-cs, 1);\n      grid-row: auto / span var(--rs, 1);\n    }\n  }\n\n  [g=\"sg\"] {\n    display: grid;\n    grid-template-columns: subgrid;\n  }\n\n  [in] {\n    text-indent: calc(var(--cw, 1ch) * var(--in, 0));\n  }\n\n  [o$=\"-f\"] { --or: -2; }\n  [o$=\"-a\"] { --or: auto; }\n  [o$=\"-l\"] { --or: 2; }\n\n  @media (width < 30rem) {\n    [g] { display: flex; flex-direction: column; }\n  }\n\n  @media (width >= 30rem) {\n    [in$=\"0\"] { --in: 0; } [in$=\"1\"] { --in: 1; } [in$=\"2\"] { --in: 2; } [in$=\"3\"] { --in: 3; } [in$=\"4\"] { --in: 4; } [in$=\"5\"] { --in: 5; } [in$=\"6\"] { --in: 6; }\n    [g$=\"1\"] { --l-gc: 1; } [g$=\"2\"] { --l-gc: 2; } [g$=\"3\"] { --l-gc: 3; } [g$=\"4\"] { --l-gc: 4; } [g$=\"5\"] { --l-gc: 5; } [g$=\"6\"] { --l-gc: 6; } [g$=\"7\"] { --l-gc: 7; } [g$=\"8\"] { --l-gc: 8; } [g$=\"9\"] { --l-gc: 9; } [g$=\"10\"] { --l-gc: 10; } [g$=\"11\"] { --l-gc: 11; } [g$=\"12\"] { --l-gc: 12; }\n    [c$=\"0\"] { --l-cs: var(--l-gc); } [c$=\"1\"] { --l-cs: 1; } [c$=\"2\"] { --l-cs: 2; } [c$=\"3\"] { --l-cs: 3; } [c$=\"4\"] { --l-cs: 4; } [c$=\"5\"] { --l-cs: 5; } [c$=\"6\"] { --l-cs: 6; } [c$=\"7\"] { --l-cs: 7; } [c$=\"8\"] { --l-cs: 8; } [c$=\"9\"] { --l-cs: 9; } [c$=\"10\"] { --l-cs: 10; } [c$=\"11\"] { --l-cs: 11; } [c$=\"12\"] { --l-cs: 12; }\n    [r$=\"1\"] { --rs: 1; } [r$=\"2\"] { --rs: 2; } [r$=\"3\"] { --rs: 3; } [r$=\"4\"] { --rs: 4; }\n    [o*=\"-f-\"] { --or: -2; } [o*=\"-a-\"] { --or: auto; } [o*=\"-l-\"] { --or: 2; }\n  }\n\n  @media (width >= 60rem) {\n    [in^=\"0\"] { --in: 0; } [in^=\"1\"] { --in: 1; } [in^=\"2\"] { --in: 2; } [in^=\"3\"] { --in: 3; } [in^=\"4\"] { --in: 4; } [in^=\"5\"] { --in: 5; } [in^=\"6\"] { --in: 6; }\n    [g^=\"1\"] { --l-gc: 1; } [g^=\"2\"] { --l-gc: 2; } [g^=\"3\"] { --l-gc: 3; } [g^=\"4\"] { --l-gc: 4; } [g^=\"5\"] { --l-gc: 5; } [g^=\"6\"] { --l-gc: 6; } [g^=\"7\"] { --l-gc: 7; } [g^=\"8\"] { --l-gc: 8; } [g^=\"9\"] { --l-gc: 9; } [g^=\"10\"] { --l-gc: 10; } [g^=\"11\"] { --l-gc: 11; } [g^=\"12\"] { --l-gc: 12; }\n    [c^=\"0\"] { --l-cs: var(--l-gc); } [c^=\"1\"] { --l-cs: 1; } [c^=\"2\"] { --l-cs: 2; } [c^=\"3\"] { --l-cs: 3; } [c^=\"4\"] { --l-cs: 4; } [c^=\"5\"] { --l-cs: 5; } [c^=\"6\"] { --l-cs: 6; } [c^=\"7\"] { --l-cs: 7; } [c^=\"8\"] { --l-cs: 8; } [c^=\"9\"] { --l-cs: 9; } [c^=\"10\"] { --l-cs: 10; } [c^=\"11\"] { --l-cs: 11; } [c^=\"12\"] { --l-cs: 12; }\n  }\n}\n`;
}

function typeTemplate() {
	return `@layer type {\n  :where(h1, .h1) { font: var(--t-h1); letter-spacing: var(--t-h1-ls); max-width: var(--t-h1-mw); text-transform: var(--t-h1-tt); }\n  :where(h2, .h2) { font: var(--t-h2); letter-spacing: var(--t-h2-ls); max-width: var(--t-h2-mw); text-transform: var(--t-h2-tt); }\n  :where(h3, .h3) { font: var(--t-h3); letter-spacing: var(--t-h3-ls); max-width: var(--t-h3-mw); text-transform: var(--t-h3-tt); }\n  :where(h4, .h4) { font: var(--t-h4); letter-spacing: var(--t-h4-ls); max-width: var(--t-h4-mw); text-transform: var(--t-h4-tt); }\n  :where(h5, .h5) { font: var(--t-h5); letter-spacing: var(--t-h5-ls); max-width: var(--t-h5-mw); text-transform: var(--t-h5-tt); }\n  :where(h6, .h6) { font: var(--t-h6); letter-spacing: var(--t-h6-ls); max-width: var(--t-h6-mw); text-transform: var(--t-h6-tt); }\n\n  .t-lg { font: var(--t-lg); letter-spacing: var(--t-lg-ls); max-width: var(--t-lg-mw); }\n  .t-md { font: var(--t-md); letter-spacing: var(--t-md-ls); max-width: var(--t-md-mw); }\n  .t-sm { font: var(--t-sm); letter-spacing: var(--t-sm-ls); max-width: var(--t-sm-mw); }\n\n  .fw-l { font-weight: var(--t-fw-l); }\n  .fw-r { font-weight: var(--t-fw-r); }\n  .fw-b { font-weight: var(--t-fw-b); }\n\n  .c-ink { color: var(--c-ink); }\n  .c-mut { color: var(--c-mut); }\n  .c-acc { color: var(--c-acc); }\n  .c-sec { color: var(--c-sec); }\n  .c-bg { color: var(--c-bg); }\n}\n`;
}

function wrappersTemplate() {
	return `@layer wrappers {\n  [data-craft-announcer], .vh {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip-path: inset(50%);\n    white-space: nowrap;\n    border: 0;\n  }\n\n  main {\n    min-height: 100svh;\n    max-width: 100vw;\n    overflow: clip;\n  }\n\n  main > section {\n    display: flex;\n    flex-direction: column;\n    gap: var(--s-gp-xl);\n    padding: var(--s-py) var(--s-px);\n  }\n\n  .c {\n    container-type: inline-size;\n    width: 100%;\n    max-width: var(--l-mw);\n    margin-inline: auto;\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: var(--s-ss);\n  }\n\n  .c.sm { max-width: var(--l-mw-sm); }\n  .c.lg { max-width: var(--l-mw-lg); }\n  .c.center, .c.center > * { align-items: center; justify-content: center; text-align: center; }\n\n  .w {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: var(--s-gp);\n  }\n\n  .w.h { flex-direction: row; flex-wrap: wrap; }\n  .w.center { align-items: center; justify-content: center; text-align: center; }\n  .w.gp-xl { gap: var(--s-gp-xl); }\n  .w.gp-lg { gap: var(--s-gp-lg); }\n\n  .crd {\n    --e-crd-sur: var(--c-sur);\n    --e-crd-ink: var(--c-ink);\n    --e-crd-bor: transparent;\n    background: var(--e-crd-sur);\n    color: var(--e-crd-ink);\n    border: var(--s-bw) solid var(--e-crd-bor);\n    border-radius: var(--s-br);\n    display: flex;\n    flex-direction: column;\n    gap: var(--s-gp);\n    padding: var(--s-pd);\n    overflow: hidden;\n  }\n\n  .crd.outlined { --e-crd-sur: transparent; --e-crd-bor: var(--c-bor); }\n  .crd.ghost { --e-crd-sur: transparent; }\n\n  .btn {\n    --e-btn-sur: var(--c-fg);\n    --e-btn-ink: var(--c-bg);\n    --e-btn-bor: transparent;\n    border: var(--s-bw) solid var(--e-btn-bor);\n    background: var(--e-btn-sur);\n    color: var(--e-btn-ink);\n    border-radius: var(--s-br-pill);\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    gap: var(--s-gp-sm);\n    min-height: 2.75em;\n    padding: var(--s-pd-sm) var(--s-pd);\n    text-decoration: none;\n    transition: background-color var(--m-td) var(--m-tf-o), border-color var(--m-td) var(--m-tf-o), color var(--m-td) var(--m-tf-o), transform var(--m-td-f) var(--m-tf-o);\n  }\n\n  .btn:is(:hover, :focus-visible) { --e-btn-sur: var(--c-neu-100); --e-btn-ink: var(--c-neu-00); }\n  .btn:active { transform: scale(0.98); }\n  .btn.tone { --e-btn-sur: var(--c-sur); --e-btn-ink: var(--c-ink); }\n  .btn.accent { --e-btn-sur: var(--c-acc); --e-btn-ink: var(--c-acc-ink); }\n  .btn.accent.tone { --e-btn-sur: var(--c-acc-05); --e-btn-ink: var(--c-acc-60); }\n  .btn.secondary { --e-btn-sur: var(--c-sec); --e-btn-ink: var(--c-sec-ink); }\n  .btn.secondary.tone { --e-btn-sur: var(--c-sec-05); --e-btn-ink: var(--c-sec-60); }\n  .btn.ghost { --e-btn-sur: transparent; --e-btn-ink: var(--c-ink); --e-btn-bor: transparent; }\n  .btn.outlined { --e-btn-sur: transparent; --e-btn-ink: var(--c-ink); --e-btn-bor: var(--c-bor); }\n  .btn.sm { min-height: 2.25em; padding: calc(var(--s-pd-sm) * 0.8) var(--s-pd-sm); font-size: var(--t-sm-fs); }\n  .btn.lg { min-height: 3.25em; padding: var(--s-pd) var(--s-pd-lg); font-size: var(--t-lg-fs); }\n  .btn[disabled], .btn[aria-disabled=\"true\"] { --e-btn-sur: var(--c-sur); --e-btn-ink: var(--c-mut); cursor: not-allowed; pointer-events: none; }\n\n  .btn-vis-w, .btn-txt-w { overflow: hidden; }\n  .btn-vis-w :is(span, i, b, svg) {\n    transform: translateX(calc(100% * var(--i-hov-t)));\n    transition: transform var(--m-td-s) var(--m-tf-s), color var(--m-td-s) var(--m-tf-s);\n  }\n  .btn-vis-w :is(img, picture) {\n    transform: scale(calc(1 + .2 * var(--i-hov-f)));\n    transition: transform var(--m-td-f) var(--m-tf-o);\n  }\n  .btn-txt-w span {\n    display: block;\n    transform: translateY(calc(var(--i-hov-t) * -100%));\n    transition: transform var(--m-td-s) var(--m-tf-s), color var(--m-td-s) var(--m-tf-s);\n  }\n\n  .btns, .lnks { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-gp-sm); }\n  .lnks { gap: var(--s-gp-lg); }\n\n  .lnk { color: inherit; text-decoration-thickness: var(--s-bw); text-underline-offset: 0.2em; }\n\n  .img-w {\n    display: block;\n    overflow: hidden;\n    position: relative;\n    border-radius: var(--s-br);\n    background: linear-gradient(35deg, var(--c-bor), var(--c-sur));\n  }\n\n  .img-w :where(img, picture, video) { width: 100%; height: 100%; object-fit: cover; }\n\n  .eb {\n    color: var(--c-mut);\n    font-size: var(--t-sm-fs);\n    font-weight: var(--t-fw-b);\n    letter-spacing: 0.08em;\n    line-height: 1;\n    text-transform: uppercase;\n  }\n\n  @media (width < 30rem) {\n    .w.h { flex-direction: column; }\n    .btns { width: 100%; }\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .btn-vis-w :is(span, i, b, svg, img, picture),\n    .btn-txt-w span {\n      transform: none;\n      transition: none;\n    }\n  }\n}\n`;
}

function motionTemplate() {
	return `@layer motion {\n  :where(a, button, .btn) { --i-hov-t: 0; --i-hov-f: 1; }\n  :where(a, button, .btn):is(:hover, :focus-visible) { --i-hov-t: 1; --i-hov-f: 0; }\n  :where(a, button, .btn):active { --i-prs-t: 1; --i-prs-f: 0; }\n\n  @supports (animation-timeline: view()) {\n    @property --sp-t { syntax: '<number>'; inherits: true; initial-value: 0; }\n    @property --sp-f { syntax: '<number>'; inherits: true; initial-value: 1; }\n    @property --sp-ft { syntax: '<number>'; inherits: true; initial-value: 0; }\n\n    @keyframes sp-t { from { --sp-t: 0; } to { --sp-t: 1; } }\n    @keyframes sp-f { from { --sp-f: 1; } to { --sp-f: 0; } }\n    @keyframes sp-ft { 0%, 100% { --sp-ft: 0; } 50% { --sp-ft: 1; } }\n\n    [data-scrub] {\n      animation: sp-t linear both, sp-f linear both, sp-ft linear both;\n      animation-timeline: view();\n      animation-range: entry 0% exit 100%;\n    }\n\n    [data-scroll=\"hero\"] {\n      view-timeline-name: --craft-hero;\n      view-timeline-axis: block;\n    }\n  }\n\n  @supports (view-transition-name: none) {\n    @view-transition { navigation: auto; }\n  }\n}\n`;
}

function siteTemplate() {
	return `@layer project {\n  /* Project page/component overrides live here. Keep values project-owned. */\n}\n`;
}

function templates(mode: "static" | "fluid") {
	return new Map<string, string>([
		["system.css", systemTemplate(mode)],
		["reset.css", resetTemplate()],
		["grid.css", gridTemplate()],
		["type.css", typeTemplate()],
		["wrappers.css", wrappersTemplate()],
		["motion.css", motionTemplate()],
		["site.css", siteTemplate()],
	]);
}

function alreadyImported(root: string, shell: string) {
	const shellBase = shell.split(sep).pop();
	if (!shellBase) return false;
	return walk(root)
		.filter((path) => [".ts", ".tsx", ".js", ".jsx", ".mjs", ".astro", ".svelte"].includes(extname(path)))
		.some((path) => new RegExp(`import\\s+['\"][^'\"]*${shellBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['\"]`).test(read(path)));
}

function insertImport(root: string, file: string, shell: string, dryRun: boolean, operations: Operation[]) {
	const specifier = importPath(file, shell);
	const text = read(file);
	if (text.includes(`"${specifier}"`) || text.includes(`'${specifier}'`)) {
		operations.push({ action: "skip", path: rel(root, file), reason: "entry already imports CSS shell" });
		return;
	}
	let next = `import "${specifier}";\n${text}`;
	if (file.endsWith(".svelte")) {
		const script = text.match(/<script(?:\s[^>]*)?>/);
		if (script?.index !== undefined) {
			const insertAt = script.index + script[0].length;
			next = `${text.slice(0, insertAt)}\n  import "${specifier}";${text.slice(insertAt)}`;
		} else {
			next = `<script>\n  import "${specifier}";\n</script>\n\n${text}`;
		}
	} else if (file.endsWith(".astro")) {
		if (text.startsWith("---\n")) {
			next = `---\nimport "${specifier}";\n${text.slice(4)}`;
		} else {
			next = `---\nimport "${specifier}";\n---\n\n${text}`;
		}
	}
	operations.push({ action: "update", path: rel(root, file), reason: `import CSS shell (${specifier})` });
	if (!dryRun) writeFileSync(file, next.endsWith("\n") ? next : `${next}\n`);
}

function importCandidates(root: string, shell: string) {
	const candidates: string[] = [];
	for (const path of ["src/main.ts", "src/main.tsx", "src/main.js", "src/main.jsx"]) {
		if (existsFile(join(root, path))) candidates.push(join(root, path));
	}
	if (existsFile(join(root, "src/routes/+layout.svelte"))) candidates.push(join(root, "src/routes/+layout.svelte"));
	if (existsFile(join(root, "src/layouts/Layout.astro"))) candidates.push(join(root, "src/layouts/Layout.astro"));
	if (shell.endsWith(`${sep}app${sep}globals.css`) && existsFile(join(root, "app/layout.tsx"))) candidates.push(join(root, "app/layout.tsx"));
	if (shell.endsWith(`${sep}src${sep}app${sep}globals.css`) && existsFile(join(root, "src/app/layout.tsx"))) candidates.push(join(root, "src/app/layout.tsx"));
	return Array.from(new Set(candidates));
}

function maybePatchImport(root: string, shell: string, dryRun: boolean, operations: Operation[]) {
	if (alreadyImported(root, shell)) {
		operations.push({ action: "skip", reason: "CSS shell appears imported already" });
		return;
	}
	const candidates = importCandidates(root, shell);
	if (candidates.length === 1) {
		insertImport(root, candidates[0], shell, dryRun, operations);
		return;
	}
	operations.push({
		action: "manual",
		reason: candidates.length === 0
			? `import ${rel(root, shell)} from the app/layout entry`
			: `multiple possible app/layout entries; import ${rel(root, shell)} manually`,
	});
}

function report(root: string, mode: string, shell: string, partialDirPath: string, operations: Operation[], json: boolean) {
	if (json) {
		console.log(JSON.stringify({ mode, shell: rel(root, shell), partialDir: rel(root, partialDirPath), operations }, null, 2));
		return;
	}
	console.log(`craft-css-scaffold: mode=${mode} shell=${rel(root, shell)} partials=${rel(root, partialDirPath)}`);
	for (const op of operations) {
		const target = op.path ? ` ${op.path}` : "";
		console.log(`- ${op.action}${target}: ${op.reason}`);
	}
}

const args = parseArgs(process.argv.slice(2));
if (!existsDir(args.project)) usage(`project not found: ${args.project}`);

const mode = resolveMode(args.project, args.mode);
const shell = detectShell(args.project);
const partialDirPath = partialDir(args.project, shell);
const partials = partialNames.map((name) => join(partialDirPath, name));
const operations: Operation[] = [];

writeShell(args.project, shell, partials, args.force, args.dryRun, operations);
for (const [name, content] of templates(mode)) {
	writePlanned(args.project, join(partialDirPath, name), content, args.force, args.dryRun, operations);
}
if (args.importEntry) maybePatchImport(args.project, shell, args.dryRun, operations);

report(args.project, mode, shell, partialDirPath, operations, args.json);
