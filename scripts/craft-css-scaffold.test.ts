import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const script = resolve(dirname(fileURLToPath(import.meta.url)), "craft-css-scaffold.ts");

type Test = {
	name: string;
	run: () => void;
};

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

function test(name: string, run: () => void): Test {
	return { name, run };
}

function withProject(name: string, run: (root: string) => void) {
	const root = mkProject(name);
	try {
		run(root);
		rmSync(root, { recursive: true, force: true });
	} catch (error) {
		console.error(`fixture kept: ${root}`);
		throw error;
	}
}

function mkProject(name: string) {
	return mkdtempSync(join(tmpdir(), `craft-${name}-`));
}

function write(path: string, content: string) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content);
}

function read(path: string) {
	return readFileSync(path, "utf8");
}

function runScaffold(root: string, args: string[] = []) {
	const result = spawnSync(process.execPath, [script, "--project", root, ...args], {
		encoding: "utf8",
	});
	if (result.status !== 0) {
		throw new Error(`scaffold failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
	}
	return result.stdout;
}

function jsonScaffold(root: string, args: string[] = []) {
	return JSON.parse(runScaffold(root, [...args, "--json"]));
}

function files(root: string): string[] {
	return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
		const path = join(root, entry.name);
		if (entry.isDirectory()) return files(path);
		return entry.isFile() ? [path] : [];
	});
}

function cssFiles(root: string) {
	return files(root).filter((path) => extname(path) === ".css" && statSync(path).isFile());
}

function assertGeneratedCssIsValid(root: string) {
	const css = cssFiles(root).map((path) => read(path)).join("\n");
	const blank = css.match(/--[a-z0-9-]+\s*:\s*;/);
	assert(!blank, `blank custom property: ${blank?.[0]}`);

	const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
	const missing = new Set<string>();
	for (const match of css.matchAll(/var\(\s*(--[a-z0-9-]+)\s*([,)])/g)) {
		const [, name, end] = match;
		if (end === ",") continue;
		if (!defined.has(name)) missing.add(name);
	}
	assert(missing.size === 0, `unresolved custom properties: ${Array.from(missing).join(", ")}`);
}

const tests = [
	test("static Vite-style project gets shell, partials, import, and valid CSS", () => withProject("static", (root) => {
		write(join(root, "src/main.ts"), "console.log('app');\n");
		const report = jsonScaffold(root, ["--mode", "static"]);
		assert(report.mode === "static", "static mode expected");
		for (const name of ["system", "reset", "grid", "type", "wrappers", "motion", "site"]) {
			assert(existsSync(join(root, `src/styles/${name}.css`)), `${name}.css missing`);
		}
		assert(read(join(root, "src/main.ts")).startsWith("import \"./styles.css\";"), "main import missing");
		assertGeneratedCssIsValid(root);
	})),

	test("fluid SvelteKit project gets fluid scale, layout import, and valid CSS", () => withProject("fluid", (root) => {
		write(join(root, "src/routes/+layout.svelte"), "<main><slot /></main>\n");
		const report = jsonScaffold(root, ["--mode", "fluid"]);
		assert(report.mode === "fluid", "fluid mode expected");
		const system = read(join(root, "src/styles/system.css"));
		assert(system.includes("--l-fluid: clamp("), "fluid token missing");
		assert(system.includes("--l-mw-min"), "fluid min config missing");
		assert(read(join(root, "src/routes/+layout.svelte")).includes('import "../styles.css";'), "Svelte import missing");
		assertGeneratedCssIsValid(root);
	})),

	test("Astro layout import is inserted inside frontmatter", () => withProject("astro", (root) => {
		write(join(root, "src/layouts/Layout.astro"), "---\nconst title = 'x';\n---\n<html></html>\n");
		runScaffold(root, ["--mode", "static"]);
		assert(read(join(root, "src/layouts/Layout.astro")).startsWith('---\nimport "../styles.css";\nconst title'), "Astro import not in frontmatter");
		assertGeneratedCssIsValid(root);
	})),

	test("Next app shell uses existing globals.css and patches layout", () => withProject("next", (root) => {
		write(join(root, "app/globals.css"), "/* existing globals */\n");
		write(join(root, "app/layout.tsx"), "export default function RootLayout({ children }) { return children; }\n");
		runScaffold(root, ["--mode", "static"]);
		assert(read(join(root, "app/globals.css")).includes('@import "./styles/system.css";'), "Next globals import missing");
		assert(read(join(root, "app/layout.tsx")).startsWith('import "./globals.css";'), "Next layout import missing");
		assertGeneratedCssIsValid(root);
	})),

	test("ambiguous app entries do not get guessed", () => withProject("ambiguous", (root) => {
		write(join(root, "src/main.ts"), "console.log(1);\n");
		write(join(root, "src/main.tsx"), "console.log(2);\n");
		const report = jsonScaffold(root, ["--mode", "static", "--dry-run"]);
		assert(report.operations.some((op: { action: string; reason: string }) => op.action === "manual" && op.reason.includes("multiple possible")), "manual ambiguous import missing");
		assert(!existsSync(join(root, "src/styles.css")), "dry run wrote shell");
	})),

	test("existing partials are preserved unless force is set", () => withProject("preserve", (root) => {
		write(join(root, "src/styles/system.css"), "body { color: red; }\n");
		const report = jsonScaffold(root, ["--mode", "static"]);
		assert(report.operations.some((op: { action: string; path: string }) => op.action === "skip" && op.path === "src/styles/system.css"), "existing system.css was not skipped");
		assert(read(join(root, "src/styles/system.css")) === "body { color: red; }\n", "existing system.css changed");
	})),

	test("auto mode adopts existing fluid config but stays dry-run safe", () => withProject("auto", (root) => {
		write(join(root, "src/legacy.css"), ":root { --size-min: 1; --size-max: 2; }\n");
		const report = jsonScaffold(root, ["--mode", "auto", "--dry-run"]);
		assert(report.mode === "fluid", "auto did not adopt fluid mode");
		assert(!existsSync(join(root, "src/styles.css")), "dry run wrote shell");
	})),
];

let failed = 0;
for (const item of tests) {
	try {
		item.run();
		console.log(`ok ${item.name}`);
	} catch (error) {
		failed += 1;
		console.error(`not ok ${item.name}`);
		console.error(error);
	}
}

if (failed > 0) process.exit(1);
console.log(`craft-css-scaffold tests: ${tests.length} passed`);
