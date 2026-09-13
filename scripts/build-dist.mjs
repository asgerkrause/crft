import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const distDir = resolve(root, "dist");
mkdirSync(distDir, { recursive: true });

const layers = [
  "base.css",
  "tokens.css",
  "type.css",
  "layout.css",
  "grid.css",
  "motion.css",
  "utility.css",
];

const prelude = "@layer reset, base, tokens, type, layout, grid, motion, utility;\n\n";
const banner = "/* CRFT Standalone Distribution — Pure Native CSS with Cascade Layers */\n";

const parts = layers.map((file) => {
  const content = readFileSync(resolve(root, "styles/layers", file), "utf8");
  return `/* --- layers/${file} --- */\n${content.trim()}`;
});

const bundle = `${banner}${prelude}${parts.join("\n\n")}\n`;
const outPath = resolve(distDir, "crft.css");
writeFileSync(outPath, bundle, "utf8");

console.log(`PASS: Built single-file distribution -> dist/crft.css (${Buffer.byteLength(bundle)} bytes)`);
