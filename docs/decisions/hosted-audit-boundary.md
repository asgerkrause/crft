# Hosted audit boundary

Status: proposed; no hosted implementation or deployment is authorized.

## Decision

A future hosted **seess audit** is a separate repository and service. This repository remains the dependency-free CSS source, local analyzer, reference, and contract authority. Hosted code may consume a versioned analyzer artifact; it may not become an owner of CSS values, selectors, rules, or findings.

The service accepts an explicit archive or provider-authorized repository snapshot, runs the same read-only analysis in an isolated disposable worker, returns a versioned redacted report, then destroys the worker and input. It never runs package managers, build scripts, hooks, application code, browser code from the consumer, or arbitrary commands. Migration output remains a plan; hosted operation never edits or pushes a consumer repository.

## Trust boundaries and controls

- **Input:** Treat filenames, archives, symlinks, source, Git metadata, and generated output as hostile. Reject traversal, links escaping the snapshot, special files, oversized files, excessive depth/count/expansion, malformed encodings, and unsupported formats. Stream uploads with compressed and expanded limits.
- **Isolation:** One tenant/job per ephemeral worker, unprivileged identity, read-only analyzer/runtime, private scratch volume, no host mounts, no cross-job cache, no cloud metadata access, and deny-by-default egress. Apply CPU, memory, process, file, disk, and wall-time limits.
- **Execution:** Invoke only the pinned analyzer entrypoint with structured arguments. No shell interpolation and no consumer executable discovery. Analyzer blocked evidence produces blocked output, never a clean result.
- **Identity and authorization:** Authenticate users through the product identity provider. Authorize each organization, repository connection, upload, report, and deletion independently. Provider installation does not imply access to every repository. Require short-lived scoped provider tokens and re-check access when fetching.
- **Secrets:** Do not request environment files or credentials. Apply local exclusion and output-redaction contracts before persistence. Never include raw source, paths, tokens, archives, or provider credentials in logs, traces, analytics, support exports, or error messages.
- **Artifacts:** Encrypt transport and storage. Default to immediate source/archive deletion after analysis. Reports have an explicit short retention period and tenant-controlled early deletion. Record deletion outcome without retaining deleted contents. Backups follow the same expiry.
- **Observability:** Use generated job/tenant identifiers and bounded metrics. Security audit events record actor, authorization decision, analyzer version, report digest, and lifecycle state—not source or findings evidence that may contain consumer data.
- **Supply chain:** Pin runtime, analyzer artifact, and base image by digest; generate provenance/SBOM; scan and sign releases; separate build from deploy identity. Hosted release cannot silently change the report schema or canonical comparison source.
- **Failure:** Fail closed on isolation, redaction, resource-limit, fetch, identity, cleanup, or persistence uncertainty. Preserve a minimal lifecycle audit record and expose blocked status to the user.

## Architecture

1. API validates identity, authorization, declared limits, and request shape.
2. Ingestion creates a job-scoped encrypted object and verifies archive boundaries without extraction onto a shared filesystem.
3. Scheduler starts one disposable, network-denied worker with pinned analyzer and canonical seess version.
4. Worker extracts into its private volume, analyzes, validates/redacts the report, and writes only the bounded report artifact.
5. Lifecycle service deletes source and worker volume, applies report retention, and records completion or blocked cleanup.
6. Report API re-authorizes every read/delete request and serves the immutable versioned artifact.

Control plane, ingestion, workers, and artifact storage use separate identities and least-privilege permissions. Tenant-controlled data never enters build caches or deployment artifacts.

## Eve disposition

Do **not** adopt Eve for the first hosted implementation. The required flow is a bounded deterministic job, not an autonomous durable agent. A queue plus isolated worker is smaller, easier to threat-model, and keeps the local analyzer authoritative. Reconsider Eve only if approved product evidence requires durable conversational workflows, schedules, or human-in-the-loop state that cannot be expressed as ordinary jobs. Any reconsideration needs a separate threat model and must preserve the no-consumer-execution boundary.

## Gates before implementation or launch

- Approved data classification, retention schedule, privacy terms, and incident-response owner.
- Abuse cases tested: archive bombs, path traversal, symlink races, malformed source, resource exhaustion, cross-tenant access, token leakage, replay, cancellation, and failed cleanup.
- Independent security review of sandbox escape, cloud IAM, provider authorization, redaction, logging, and deletion.
- Analyzer/schema versions pinned; blocked evidence and exit semantics preserved end to end.
- Load/cost limits and per-tenant quotas verified under adversarial inputs.
- Restore/deletion behavior tested, including backups and support tooling.
- Explicit authority for dependency selection, separate repository creation, infrastructure, production configuration, and deployment.

Until every gate passes, hosted audit remains a decision record only. It supplies no evidence that Craft can be retired or that any consumer migration is safe.
