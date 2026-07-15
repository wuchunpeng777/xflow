---
name: xflow-review
description: Review selected AI-generated or existing code against the user's business intent without requiring an xflow spec. Use when the user invokes /xflow-review, /xflow:review, xflow review, or asks for a business-first code audit, acceptance review, architecture overview, or flow analysis after implementation.
---

# xflow Review

## Purpose

Turn a large implementation into an evidence-backed business review. Reconstruct acceptance criteria with the user, inspect the selected code and necessary dependencies, run safe verification, and report what is satisfied, broken, or not proven.

Do not require an xflow task spec. Do not modify reviewed code, update snapshots, format files, or start a fix unless the user makes a separate request.

Prefer running the review in a fresh agent conversation. If the current conversation also produced the implementation, disclose that the review is not independent, disregard implementation-stage claims unless repository evidence supports them, and rebuild the conclusion from confirmed requirements and observed evidence.

## Commands

Accept these forms as equivalent:

- `/xflow-review <file-or-directory>...`
- `/xflow:review <file-or-directory>...`
- `xflow review <file-or-directory>...`

## Evidence Rules

Keep these sources distinct throughout the review:

- **Confirmed requirement**: business intent explicitly confirmed by the user or an authoritative document.
- **Observed evidence**: behavior supported by code, tests, command output, schema, or configuration.
- **Inference**: a plausible interpretation that is not established as a requirement or verified behavior.

Never infer a requirement merely because the implementation behaves that way. Never treat a passing test as proof that the business behavior is correct. Mark a criterion `Not proven` when the available evidence is insufficient.

## Workflow

### 1. Establish Scope

1. Resolve every user-supplied file or directory. If any path is missing or ambiguous, ask for a valid path before reviewing it.
2. Treat those paths as the primary review scope. Read callers, dependencies, tests, schemas, configuration, and Git history outside that scope only when needed to understand behavior or impact.
3. State the resolved primary scope and any relevant Git diff or baseline. A Git diff is supporting context, not a prerequisite.
4. If no path was supplied, ask the user to specify the files or directories to review.

### 2. Reconstruct Business Intent

Do this before drawing conclusions from the implementation.

1. Inspect only enough project context to ask informed questions: project documentation, manifests, existing domain terminology, and the selected paths' role.
2. Ask a small set of high-value questions per round. Cover only what is relevant:
   - actor and desired outcome;
   - core successful scenarios;
   - observable acceptance conditions;
   - business invariants and data correctness;
   - roles and permissions;
   - failures, retries, cancellation, and boundary cases;
   - explicit non-goals and compatibility constraints.
3. Convert the answers into numbered acceptance criteria. Prefer Given/When/Then or another observable form.
4. Present the criteria and assumptions to the user for confirmation. Do not begin the full review until the user confirms them.
5. If the user declines clarification, continue only when requested and lower confidence. Label all unresolved intent explicitly.

### 3. Build The Implementation Model

1. Locate entry points, module boundaries, dependencies, persistence, state changes, external integrations, and failure paths.
2. Trace each confirmed acceptance criterion through the implementation.
3. Inspect tests and validation coverage for the traced paths.
4. Check for business deviations first, then assess data consistency, error handling, authorization, security, performance, maintainability, and testability.
5. Cite concrete file and line references for findings and important diagram nodes.

### 4. Verify Safely

1. Discover the project's existing commands from manifests, documentation, and CI configuration.
2. Run the narrowest relevant tests, type checks, linters, and builds that do not intentionally rewrite tracked files.
3. Do not update snapshots or approve generated output automatically.
4. Do not run commands that may write production data, call live services, send messages, deploy, migrate, or otherwise create external side effects. Report them as manual validation needs.
5. Record the exact commands, results, and any verification that could not be performed.

### 5. Draw Focused Diagrams

Use Mermaid and keep the report to one to three diagrams. Omit a diagram when it would not improve understanding.

1. Always consider an **actual architecture diagram** showing the reviewed entry points, core modules, storage, and external systems.
2. For the main business scenario, draw an **expected flow** from the confirmed criteria and an **actual flow** from code evidence. Combine them only when the differences remain obvious.
3. Add a data-flow or state diagram only for non-trivial data lifecycles or state machines.
4. Label nodes or edges as `Existing`, `Added`, or `Changed` when Git evidence supports that distinction.
5. Mark inferred or unverified relationships as `Inferred` or `Not proven`, and highlight high-risk nodes without relying on color alone.
6. Add file references next to the diagram or in its legend. Do not create exhaustive class diagrams or file dependency maps.

### 6. Report

Lead with business compliance. Use this structure:

```markdown
# Review: <scope>

## Executive Verdict

- Verdict: Meets / Partially meets / Does not meet / Cannot prove
- Confidence: High / Medium / Low
- Primary reason:

## Acceptance Matrix

| ID | Confirmed criterion | Status | Implementation evidence | Verification evidence | Business risk |
| --- | --- | --- | --- | --- | --- |

## Architecture And Flows

Focused Mermaid diagrams with a short legend and source references.

## Findings

Findings ordered by Blocker, High, Medium, then Low. For each finding include the affected criterion, business impact, evidence with file/line references, and recommended direction. Do not patch the code.

## Engineering Quality

Summarize boundaries and coupling, data consistency, error handling, authorization and security, performance, maintainability, and testability. Include only relevant observations.

## Verification

List commands run, results, and validation that remains manual.

## Manual Drill-down

List only the 3-7 code locations most worth human inspection and explain why each matters.

## Unknowns

List unresolved requirements, missing runtime evidence, and external-system assumptions.
```

Use these acceptance statuses: `Pass`, `Fail`, `Partial`, and `Not proven`. Use these finding severities: `Blocker`, `High`, `Medium`, and `Low`.

Show the report in the conversation by default. Write it to Markdown only when the user explicitly requests a file and path. A review report is advisory and does not block other xflow commands.

## Principles

- Business intent is the acceptance baseline.
- Code, tests, and command output are implementation evidence.
- Unknown is different from correct.
- Diagrams compress reasoning; they do not replace evidence.
- Direct human attention to a few consequential locations instead of restating every file.
