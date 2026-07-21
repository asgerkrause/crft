import { fileURLToPath } from "node:url";
import { adoptSystem, files } from "../scripts/copy-system.mjs";
import { createReport } from "./contracts/report.mjs";
import { analyze } from "./core/analyze.mjs";
import { CANONICAL_ROOT, collectConsumerRecords, collectIntegrityInput, consumerSkippedFindings, normalizeAdoptionTarget } from "./core/run.mjs";
import { resolveScope } from "./core/scope.mjs";
import { createMigrationPlan } from "./migrate/plan.mjs";
import { ADOPTION_MANIFEST, assessAdoptionIntegrity } from "./rules/adoption-integrity.mjs";
import { analyzeConsumerApi } from "./rules/consumer-api.mjs";

const EXIT_OK = 0;
const EXIT_FAILED = 1;
const EXIT_USAGE = 2;
const EXIT_BLOCKED = 3;
const COMMANDS = new Set(["adopt", "audit", "verify", "migrate"]);
const FLAGS = new Set(["root", "entrypoint", "adoption", "target"]);

/** @param {string[]} argv */
export async function run(argv) {
  try {
    const input = parseArguments(argv);
    if (input.command === "adopt") return await runAdopt(input);

    const scope = resolveScope(input);
    const integrity = collectIntegrityInput({ scope, manifest: ADOPTION_MANIFEST });
    const rules = [() => assessAdoptionIntegrity(integrity)];
    if (input.command === "audit" || input.command === "migrate") {
      const consumer = collectConsumerRecords(scope);
      rules.push(() => [...analyzeConsumerApi(consumer.records), ...consumerSkippedFindings(consumer.skipped)]);
    }
    const findings = analyze({ scope, rules });
    const report = createReport({
      command: input.command,
      scope: { entrypoint: scope.entrypoint.relative, adoption: scope.adoption.relative },
      findings,
    });
    return {
      exitCode: exitCodeFor(report),
      output: input.command === "migrate" ? { report, plan: createMigrationPlan(findings) } : report,
    };
  } catch (error) {
    return {
      exitCode: EXIT_USAGE,
      output: { error: { code: "invalid-input", message: safeMessage(error) } },
    };
  }
}

/** @param {{ target: string, dryRun: boolean }} input */
async function runAdopt(input) {
  const target = normalizeAdoptionTarget(input.target);
  await adoptSystem({ sourceRoot: CANONICAL_ROOT, target: target.absolute, dryRun: input.dryRun });
  const report = createReport({
    command: "adopt",
    scope: { adoption: target.label },
    findings: [],
  });
  return {
    exitCode: EXIT_OK,
    output: {
      report,
      result: { operation: "adopt", dryRun: input.dryRun, copiedFiles: files.length },
    },
  };
}

/** @param {string[]} argv */
export function parseArguments(argv) {
  const [command, ...tokens] = argv;
  if (!COMMANDS.has(command)) throw new TypeError("command must be adopt, audit, verify, or migrate");
  /** @type {{ command: string, root?: string, entrypoint?: string, adoption?: string, target?: string, dryRun: boolean }} */
  const input = { command, dryRun: false };
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === "--dry-run") {
      if (input.dryRun) throw new TypeError("--dry-run may be supplied once");
      input.dryRun = true;
      continue;
    }
    const key = token?.startsWith("--") ? token.slice(2) : "";
    const value = tokens[index + 1];
    if (!FLAGS.has(key) || value === undefined || value.startsWith("--")) {
      throw new TypeError("flags must use explicit values");
    }
    if (input[key] !== undefined) throw new TypeError(`--${key} may be supplied once`);
    input[key] = value;
    index += 1;
  }
  if (command === "adopt") {
    if (input.target === undefined || input.root !== undefined || input.entrypoint !== undefined || input.adoption !== undefined) {
      throw new TypeError("adopt requires --target only, with optional --dry-run");
    }
  } else if (input.root === undefined || input.entrypoint === undefined || input.adoption === undefined || input.target !== undefined || input.dryRun) {
    throw new TypeError(`${command} requires --root, --entrypoint, and --adoption only`);
  }
  return input;
}

/** @param {import("./contracts/report.mjs").Report} report */
function exitCodeFor(report) {
  if (report.summary.blocked) return EXIT_BLOCKED;
  return report.summary.fail ? EXIT_FAILED : EXIT_OK;
}

/** @param {unknown} error */
function safeMessage(error) {
  return error instanceof TypeError ? error.message : "unable to complete requested operation";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(process.argv[1], "file:"))) {
  const result = await run(process.argv.slice(2));
  process.stdout.write(`${JSON.stringify(result.output)}\n`);
  process.exitCode = result.exitCode;
}
