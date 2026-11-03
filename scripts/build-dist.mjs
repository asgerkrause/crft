import { tokensWithoutFonts } from "./copy-system.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const distDir = resolve(root, "dist");
mkdirSync(distDir, { recursive: true });

const prelude = "@layer reset, base, tokens, type, layout, grid, motion, utility;\n\n";
const banner = "/* crft Standalone Distribution — Pure Native CSS with Cascade Layers */\n";

const parts = [
  tokensWithoutFonts(readFileSync(resolve(root, "styles/tokens.css"), "utf8")),
  readFileSync(resolve(root, "styles/crft.css"), "utf8"),
];

const bundle = `${banner}${prelude}${parts.join("\n\n")}\n`;
const outPath = resolve(distDir, "crft.css");
writeFileSync(outPath, bundle, "utf8");

console.log(`PASS: Built single-file distribution -> dist/crft.css (${Buffer.byteLength(bundle)} bytes)`);
