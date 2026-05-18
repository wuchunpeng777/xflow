---
name: xflow-record
description: Records user-provided content directly into xflow AI context. Use when the user invokes /xflow-record, xflow record, /xflow:record, or asks to save explicit project knowledge.
---

# xflow Record

## Purpose

Directly record user-provided content into `.xflow/ai-context/`.

Do not pre-generate `.xflow/`. Create directories and files only when this command needs them and they do not already exist.

## Command

Accept these forms as equivalent:

- `/xflow-record <content>`
- `/xflow:record <content>`
- `xflow record <content>`

## Workflow

1. Treat the user-provided content as the source material to persist.
2. Ensure `.xflow/ai-context/` exists.
3. If `.xflow/ai-context/index.md` exists, read it before editing. If it does not exist, create the directory and index from the AI Context Template.
4. Add or merge the content into the most relevant topic file, and update `index.md` when its summary or file descriptions need to change.
5. Do not read the whole AI Context directory to record one item; read `index.md` first, then only the relevant topic files.
6. If the content is ambiguous or its target topic file is unclear, ask focused clarification questions before recording it.
7. Preserve the user's meaning, but keep the wording concise and reusable.
8. Do not create or modify task specs or release notes.

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
- Preserve the user's meaning.
- Do not modify task specs or release notes.
