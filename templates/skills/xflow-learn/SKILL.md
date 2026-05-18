---
name: xflow-learn
description: Extracts durable project knowledge into xflow AI context. Use when the user invokes /xflow-learn, xflow learn, /xflow:learn, or asks to remember stable project facts from current work.
---

# xflow Learn

## Purpose

Persist stable, reusable project knowledge in `.xflow/ai-context/`.

Do not pre-generate `.xflow/`. Create directories and files only when this command needs them and they do not already exist.

## Command

Accept these forms as equivalent:

- `/xflow-learn <topic>`
- `/xflow:learn <topic>`
- `xflow learn <topic>`

## Workflow

1. If `.xflow/ai-context/index.md` exists, read it first to understand the available context files and their responsibilities.
2. Extract only stable, reusable project facts from the current work.
3. If it is unclear whether something is durable project knowledge, ask focused clarification questions before writing it.
4. Ensure `.xflow/ai-context/` exists.
5. Create or update the most relevant topic file, and keep `.xflow/ai-context/index.md` in sync.
6. Do not read the whole AI Context directory to update one category of knowledge; read `index.md` first, then only the relevant topic files.
7. Do not add temporary task details, speculation, or one-off decisions.

## AI Context Template

```markdown
# AI Context Index

This directory stores durable project knowledge for xflow. Read this index first, then open only the topic files relevant to the active task.

## Files

- `project.md`: project type, goals, product boundaries, and domain facts.
- `tech-stack.md`: languages, frameworks, runtimes, package managers, and tools.
- `architecture.md`: structure, key modules, data flow, and integration notes.
- `quality.md`: performance, security, compatibility, testing, and release constraints.
- `code-standards.md`: coding conventions and implementation preferences.
- `xflow.md`: xflow-specific workflow notes.

## Summary

- Project: TBD
- Stack: TBD
- Architecture: TBD
- Current constraints: TBD
```

## Topic File Template

```markdown
# <Topic>

## Stable Facts

- TBD

## Conventions

- TBD
```

## Principles

- AI Context = durable project knowledge.
- Temporary task details do not belong in AI Context.
