---
name: xflow-learn
description: 将长期项目知识提取到 xflow AI Context。当用户调用 /xflow-learn、xflow learn、/xflow:learn，或要求记住当前工作里的稳定项目事实时使用。
---

# xflow Learn

## 目标

将稳定、可复用的项目知识持久化到 `.xflow/ai-context/`。

不要预先生成 `.xflow/`。只有当本命令需要某个目录或文件，并且它还不存在时，才创建它。

## 命令

以下写法等价：

- `/xflow-learn <topic>`
- `/xflow:learn <topic>`
- `xflow learn <topic>`

## 流程

1. 如果 `.xflow/ai-context/index.md` 存在，先读取它，了解可用上下文文件和各自职责。
2. 只提取当前工作中稳定、可复用的项目事实。
3. 如果无法判断某项内容是否属于长期项目知识，先提出聚焦问题，确认后再写入。
4. 确保 `.xflow/ai-context/` 存在。
5. 根据知识类型创建或更新最合适的主题文件，并同步维护 `.xflow/ai-context/index.md`。
6. 不要为了更新某一类知识而读取整个 AI Context 目录；先读 `index.md`，再按需读取相关主题文件。
7. 不要写入临时任务细节、猜测或一次性决策。

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
- 临时任务细节不属于 AI Context。
