---
name: xflow-start
description: Starts a new xflow feature spec. Use when the user invokes /xflow-start, xflow start, /xflow:start, or asks to open a new feature task with durable AI context.
---

# xflow Start

## Purpose

Open a new feature and create a temporary task spec under `.xflow/tasks/`.

Do not pre-generate `.xflow/`. Create directories and files only when this command needs them and they do not already exist.

## Command

Accept these forms as equivalent:

- `/xflow-start <feature-name>`
- `/xflow:start <feature-name>`
- `xflow start <feature-name>`

## Workflow

1. If `.xflow/ai-context.md` exists, read it. If it does not exist, continue and create it only when durable project knowledge must be stored.
2. Ensure `.xflow/tasks/` exists.
3. Use the exact `<feature-name>` provided in the user's start command as the task spec name and path segment: `.xflow/tasks/<feature-name>.md`.
4. If a task spec with the same name already exists, stop and ask the user to choose one option:
   - Abandon the previous spec and create a new one with the same name.
   - Continue the previous spec.
   - Use a different new feature name.
5. Create the task spec from the template only after the name is confirmed.
6. Fill the initial task spec with what is already known about the goal, background, requirements, forbidden changes, and acceptance criteria.
7. After creating the task spec, automatically enter a planning-style clarification phase:
   - Summarize what is known from the user's request and the current spec.
   - Ask focused questions for missing requirements, constraints, edge cases, acceptance criteria, and non-goals.
   - Update the task spec after the user answers.
   - Continue until the spec is specific enough to guide implementation.
8. Do not start coding after `xflow-start` unless the user explicitly asks to begin implementation.

## Naming

- Task spec: `.xflow/tasks/<feature-name>.md`
- Preserve the user's command name exactly, including language, spelling, casing, and separators.
- Do not translate, summarize, lowercase, kebab-case, or otherwise rewrite the name.
- If the provided name contains characters that are unsafe for file paths, stop and ask the user for a valid replacement name.

## Task Template

```markdown
# Task: <name>

## 目标

一句话说明。

## 背景

为什么做。

## 修改要求

- 必须遵守：
- 不允许做：

## 验收

- 功能正确：
- 性能 OK：

## 待确认问题

- 
```

## Principles

- Code + Git = truth.
- Spec = temporary context.
- AI Context = durable project knowledge.
