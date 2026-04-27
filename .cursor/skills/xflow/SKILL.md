---
name: xflow
description: Runs the xflow AI workflow with task specs, release notes, and durable project knowledge. Use when the user invokes /xflow:start, /xflow:complete, /xflow:abandon, /xflow:learn, /xflow:record, xflow start, xflow complete, xflow abandon, xflow learn, xflow record, or asks to manage AI task context like OpenSpec.
---

# xflow

## Purpose

xflow keeps AI work independent from chat history:

- `.xflow/ai-context.md` is durable project knowledge.
- `.xflow/tasks/` contains temporary specs for active work.
- `.xflow/releases/` contains one unique release file per completed module or feature.
- `.xflow/history/` contains abandoned feature records only.

Do not pre-generate `.xflow/`. Create directories and files only when a command needs them and they do not already exist.

## Commands

### `/xflow:start <feature-name>`

Open a new feature.

1. If `.xflow/ai-context.md` exists, read it. If it does not exist, continue with the task and create it only when durable project knowledge must be stored.
2. Ensure `.xflow/tasks/` exists.
3. Use `.xflow/tasks/feature-name.md` as the task spec path.
4. If a task spec with the same name already exists, stop and ask the user to choose one option:
   - Abandon the previous spec and create a new one with the same name.
   - Continue the previous spec.
   - Use a different new feature name.
5. Create the task spec from the Task Template below only after the name is confirmed.
6. Fill the task spec with goal, background, requirements, forbidden changes, and acceptance criteria.
7. Ask for missing requirements before coding if the scope is unclear.

### `/xflow:complete <feature-name>`

Complete a feature.

1. Read the active task spec from `.xflow/tasks/feature-name.md`.
2. Inspect code and Git state as the source of truth.
3. Ensure `.xflow/releases/` exists.
4. Use `.xflow/releases/feature-name.md` as the release file path.
5. If the release file does not exist, create it from the Release File Template below and add the current release entry.
6. If the release file already exists, prepend the current release entry to the top of the release log, keeping older entries below it.
7. Each release entry must include background, changes, impact, and risks.
8. Delete the completed task spec unless the user asks to keep it.

### `/xflow:abandon <feature-name>`

Abandon a feature.

1. Read the active task spec from `.xflow/tasks/feature-name.md`.
2. Ensure `.xflow/history/` exists.
3. Create `.xflow/history/YYYY-MM-DD-abandoned-feature-name.md` from the Abandoned Note Template below.
4. Include current state, known partial changes, rollback needs, and future restart notes.
5. Delete the task spec unless the user asks to keep it.
6. Do not revert code unless the user explicitly requests it.

### `/xflow:learn <topic>`

Persist project knowledge.

1. If `.xflow/ai-context.md` exists, read it.
2. Extract only stable, reusable project facts from the current work.
3. Ensure `.xflow/` exists.
4. Create or update `.xflow/ai-context.md`.
5. Do not add temporary task details, speculation, or one-off decisions.

### `/xflow:record <content>`

Directly record content into AI context.

1. Treat the user-provided content as the source material to persist.
2. Ensure `.xflow/` exists.
3. If `.xflow/ai-context.md` exists, read it before editing. If it does not exist, create it from the AI Context Template below.
4. Add or merge the content into the most relevant section of `.xflow/ai-context.md`.
5. Preserve the user's meaning, but keep the wording concise and reusable.
6. Do not create or modify task specs or release notes.

## Aliases

Accept these forms as equivalent:

- `/xflow:start` or `xflow start`
- `/xflow:complete` or `xflow complete`
- `/xflow:abandon` or `xflow abandon`
- `/xflow:learn` or `xflow learn`
- `/xflow:record` or `xflow record`

## Naming

- Task spec: `.xflow/tasks/readable-feature-name.md`
- Release file: `.xflow/releases/readable-feature-name.md`
- Abandoned note: `.xflow/history/YYYY-MM-DD-abandoned-readable-feature-name.md`
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

## Abandoned Note Template

```markdown
## YYYY-MM-DD abandoned <name>

### 放弃原因

### 当前状态

### 已有改动

### 回滚需要

### 后续重启建议
```

## AI Context Template

```markdown
# AI Context

This file stores durable project knowledge for xflow. Update it with `/xflow:learn` or `/xflow:record` when project-level facts change.

## Project Overview

- Type: TBD
- Goals: TBD

## Tech Stack

- Languages: TBD
- Frameworks: TBD
- Runtime: TBD

## Architecture Notes

- Structure: TBD
- Key modules: TBD

## Quality Constraints

- Performance: TBD
- Security: TBD
- Compatibility: TBD

## Code Standards

- Keep code scoped to the active task spec.
- Prefer existing project patterns over new abstractions.
- Use readable names and small, focused methods.
- Treat code and Git state as the source of truth.

## xflow Notes

- Active specs live in `.xflow/tasks/`.
- Completed work is summarized in `.xflow/releases/`.
- Abandoned work is summarized in `.xflow/history/`.
- Temporary task details do not belong in this file.
```

## Principles

- Code + Git = truth.
- Spec = temporary context.
- Release Note = historical summary.
- AI Context = durable project knowledge.
