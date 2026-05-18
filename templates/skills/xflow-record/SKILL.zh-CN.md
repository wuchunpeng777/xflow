---
name: xflow-record
description: 将用户提供的内容直接记录到 xflow AI Context。当用户调用 /xflow-record、xflow record、/xflow:record，或要求保存明确的项目知识时使用。
---

# xflow Record

## 目标

将用户提供的内容直接记录到 `.xflow/ai-context/`。

不要预先生成 `.xflow/`。只有当本命令需要某个目录或文件，并且它还不存在时，才创建它。

## 命令

以下写法等价：

- `/xflow-record <content>`
- `/xflow:record <content>`
- `xflow record <content>`

## 流程

1. 将用户提供的内容作为需要持久化的来源。
2. 确保 `.xflow/ai-context/` 存在。
3. 如果 `.xflow/ai-context/index.md` 存在，编辑前先读取；如果不存在，则使用 AI Context 模板创建目录和索引。
4. 将内容添加或合并到最合适的主题文件，并在需要时更新 `index.md` 的摘要或文件说明。
5. 不要为了记录一条内容而读取整个 AI Context 目录；先读 `index.md`，再按需读取相关主题文件。
6. 如果内容含义不明确，或无法判断应写入哪个主题文件，先提出聚焦问题，确认后再记录。
7. 保留用户原意，但表述要简洁、可复用。
8. 不创建或修改任务 Spec、Release Note。

## AI Context 模板

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

## 主题文件模板

```markdown
# <Topic>

## Stable Facts

- TBD

## Conventions

- TBD
```

## 原则

- AI Context = 长期项目知识。
- 保留用户原意。
- 不修改任务 Spec 或 Release Note。
