import { fileURLToPath } from "node:url";
import { createReport } from "./contracts/report.mjs";
import { ANALYZER_VERSION, SEESS_VERSION } from "./contracts/version.mjs";
import { analyze } from "./core/analyze.mjs";
import { resolveScope } from "./core/scope.mjs";

const EXIT_OK = 0;
const EXIT_USAGE = 2;
const EXIT_BLOCKED = 3;
const COMMANDS = new Set(["adopt", "audit", "verify", "migrate"]);
const FLAGS = new Set(["root", "entrypoint", "adoption"]);

/** @param {string[]} argv */
export function run(argv) {
  try {
    const input = parseArguments(argv);
    const scope = resolveScope(input);
    if (input.command === "adopt") {
      return {
        exitCode: EXIT_BLOCKED,
        output: createReport({
          command: "adopt",
          scope: { adoption: scope.adoption.relative },
          findings: [blockedAdoptionFinding(scope.adoption.relative)],
        }),
      };
    }

    const findings = analyze({ scope, rules: [] });
    return {
      exitCode: EXIT_OK,
      output: createReport({
        command: input.command,
        scope: { entrypoint: scope.entrypoint.relative },
        findings,
      }),
    };
  } catch (error) {
    return {
      exitCode: EXIT_USAGE,
      output: { error: { code: "invalid-input", message: safeMessage(error) } },
    };
  }
}

/** @param {string[]} argv */
export function parseArguments(argv) {
  const [command, ...tokens] = argv;
  if (!COMMANDS.has(command)) throw new TypeError("command must be adopt, audit, verify, or migrate");
  /** @type {{ command: string, root?: string, entrypoint?: string, adoption?: string }} */
  const input = { command };
  for (let index = 0; index < tokens.length; index += 2) {
    const token = tokens[index];
    const value = tokens[index + 1];
    if (!token?.startsWith("--") || !FLAGS.has(token.slice(2)) || value === undefined || value.startsWith("--")) {
      throw new TypeError("flags must use --root, --entrypoint, or --adoption with explicit values");
    }
    const key = /** @type {"root" | "entrypoint" | "adoption"} */ (token.slice(2));
    if (input[key] !== undefined) throw new TypeError(`--${key} may be supplied once`);
    input[key] = value;
  }
  if (input.root === undefined) throw new TypeError("--root is required");
  if (command === "adopt") {
    if (input.adoption === undefined || input.entrypoint !== undefined) {
      throw new TypeError("adopt requires --root and --adoption only");
    }
  } else if (input.entrypoint === undefined || input.adoption !== undefined) {
    throw new TypeError(`${command} requires --root and --entrypoint only`);
  }
  return input;
}

/** @param {string} path */
function blockedAdoptionFinding(path) {
  return {
    schemaVersion: "1.0",
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    ruleId: "adoption/not-implemented",
    path,
    range: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
    classification: "deterministic",
    evidence: { state: "blocked", summary: "Adoption implementation is not available in this command." },
    confidence: 1,
    status: "blocked",
    safeNextAction: { type: "escalate", summary: "Use the adoption integration when it is available." },
  };
}

/** @param {unknown} error */
function safeMessage(error) {
  return error instanceof TypeError ? error.message : "unable to resolve requested scope";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(process.argv[1], "file:"))) {
  const result = run(process.argv.slice(2));
  process.stdout.write(`${JSON.stringify(result.output)}\n`);
  process.exitCode = result.exitCode;
}
