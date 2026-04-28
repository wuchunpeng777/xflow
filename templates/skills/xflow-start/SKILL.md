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
3. Use `.xflow/tasks/feature-name.md` as the task spec path.
4. If a task spec with the same name already exists, stop and ask the user to choose one option:
   - Abandon the previous spec and create a new one with the same name.
   - Continue the previous spec.
   - Use a different new feature name.
5. Create the task spec from the template only after the name is confirmed.
6. Fill the task spec with goal, background, requirements, forbidden changes, and acceptance criteria.
7. Ask for missing requirements before coding if the scope is unclear.

## Naming

- Task spec: `.xflow/tasks/readable-feature-name.md`
- Use lowercase kebab-case for file names.

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
```

## Principles

- Code + Git = truth.
- Spec = temporary context.
- AI Context = durable project knowledge.
