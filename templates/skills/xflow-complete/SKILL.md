---
name: xflow-complete
description: Completes an xflow feature and writes its release note. Use when the user invokes /xflow-complete, xflow complete, /xflow:complete, or asks to finish a feature spec.
---

# xflow Complete

## Purpose

Complete a feature, summarize the work, and maintain a release file under `.xflow/releases/`.

Do not pre-generate `.xflow/`. Create directories and files only when this command needs them and they do not already exist.

## Command

Accept these forms as equivalent:

- `/xflow-complete <feature-name>`
- `/xflow:complete <feature-name>`
- `xflow complete <feature-name>`

## Workflow

1. Read the active task spec from `.xflow/tasks/feature-name.md`.
2. Inspect code and Git state as the source of truth.
3. Ensure `.xflow/releases/` exists.
4. Use `.xflow/releases/feature-name.md` as the release file path.
5. If the release file does not exist, create it from the Release File Template and add the current release entry.
6. If the release file already exists, prepend the current release entry to the top of the release log, keeping older entries below it.
7. Each release entry must include background, changes, impact, and risks.
8. Delete the completed task spec unless the user asks to keep it.

## Naming

- Task spec: `.xflow/tasks/readable-feature-name.md`
- Release file: `.xflow/releases/readable-feature-name.md`
- Use lowercase kebab-case for file names.

## Release File Template

```markdown
# Release: <name>

## Release Log
```

## Release Entry Template

```markdown
### YYYY-MM-DD <summary>

#### 背景

#### 改动

#### 影响

#### 风险
```

## Principles

- Code + Git = truth.
- Release Note = historical summary.
- Spec = temporary context.
