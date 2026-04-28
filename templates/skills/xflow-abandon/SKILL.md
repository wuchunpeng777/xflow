---
name: xflow-abandon
description: Abandons an xflow feature and records restart context. Use when the user invokes /xflow-abandon, xflow abandon, /xflow:abandon, or asks to stop a feature spec without losing context.
---

# xflow Abandon

## Purpose

Abandon a feature and keep a historical note under `.xflow/history/`.

Do not pre-generate `.xflow/`. Create directories and files only when this command needs them and they do not already exist.

## Command

Accept these forms as equivalent:

- `/xflow-abandon <feature-name>`
- `/xflow:abandon <feature-name>`
- `xflow abandon <feature-name>`

## Workflow

1. Read the active task spec from `.xflow/tasks/feature-name.md`.
2. Ensure `.xflow/history/` exists.
3. Create `.xflow/history/YYYY-MM-DD-abandoned-feature-name.md` from the Abandoned Note Template.
4. Include current state, known partial changes, rollback needs, and future restart notes.
5. Delete the task spec unless the user asks to keep it.
6. Do not revert code unless the user explicitly requests it.

## Naming

- Task spec: `.xflow/tasks/readable-feature-name.md`
- Abandoned note: `.xflow/history/YYYY-MM-DD-abandoned-readable-feature-name.md`
- Use lowercase kebab-case for file names.

## Abandoned Note Template

```markdown
## YYYY-MM-DD abandoned <name>

### 放弃原因

### 当前状态

### 已有改动

### 回滚需要

### 后续重启建议
```

## Principles

- Code + Git = truth.
- Spec = temporary context.
- Abandoned notes preserve restart context only.
