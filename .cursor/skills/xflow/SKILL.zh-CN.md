---
name: xflow
description: 运行 xflow AI 工作流，用任务 Spec、Release Note 和长期项目知识管理 AI 上下文。当用户调用 /xflow:start、/xflow:complete、/xflow:abandon、/xflow:learn、/xflow:record、xflow start、xflow complete、xflow abandon、xflow learn、xflow record，或要求像 OpenSpec 一样管理 AI 任务上下文时使用。
---

# xflow

## 目标

xflow 用来让 AI 工作不依赖对话历史：

- `.xflow/ai-context.md` 存放长期项目知识。
- `.xflow/tasks/` 存放当前功能的临时 Spec。
- `.xflow/releases/` 为每个已完成模块或功能存放一个唯一 Release 文件。
- `.xflow/history/` 只存放废弃功能记录。

不要预先生成 `.xflow/`。只有当命令需要某个目录或文件，并且它还不存在时，才创建它。

## 命令

### `/xflow:start <feature-name>`

开启一个新功能。

1. 如果 `.xflow/ai-context.md` 存在，先读取它；如果不存在，继续处理当前任务，只有在需要沉淀长期项目知识时才创建。
2. 确保 `.xflow/tasks/` 存在。
3. 使用 `.xflow/tasks/feature-name.md` 作为任务 Spec 路径。
4. 如果已经存在同名任务 Spec，停止并提示用户选择：
   - 抛弃之前的 Spec，并用同名功能创建新的 Spec。
   - 继续之前的 Spec。
   - 使用另一个新的功能名。
5. 只有在名称确认后，才使用下方 Task 模板创建任务 Spec。
6. 填写目标、背景、修改要求、不允许做的事和验收标准。
7. 如果范围不清楚，编码前先向用户确认缺失需求。

### `/xflow:complete <feature-name>`

完成一个功能。

1. 从 `.xflow/tasks/feature-name.md` 读取当前功能的任务 Spec。
2. 检查代码和 Git 状态，并把它们作为事实来源。
3. 确保 `.xflow/releases/` 存在。
4. 使用 `.xflow/releases/feature-name.md` 作为 Release 文件路径。
5. 如果 Release 文件不存在，使用下方 Release File 模板创建，并写入本次 Release 条目。
6. 如果 Release 文件已经存在，把本次 Release 条目追加到 Release Log 顶部，旧条目保留在下方。
7. 每次 Release 条目必须包含背景、改动、影响和风险。
8. 除非用户要求保留，否则删除已完成的任务 Spec。

### `/xflow:abandon <feature-name>`

放弃一个功能。

1. 从 `.xflow/tasks/feature-name.md` 读取当前功能的任务 Spec。
2. 确保 `.xflow/history/` 存在。
3. 使用下方 Abandoned Note 模板创建 `.xflow/history/YYYY-MM-DD-abandoned-feature-name.md`。
4. 包含当前状态、已有部分改动、回滚需要和未来重启建议。
5. 除非用户要求保留，否则删除任务 Spec。
6. 不要回滚代码，除非用户明确要求。

### `/xflow:learn <topic>`

沉淀项目知识。

1. 如果 `.xflow/ai-context.md` 存在，先读取它。
2. 只提取当前工作中稳定、可复用的项目事实。
3. 确保 `.xflow/` 存在。
4. 创建或更新 `.xflow/ai-context.md`。
5. 不要写入临时任务细节、猜测或一次性决策。

### `/xflow:record <content>`

直接向 AI Context 记录内容。

1. 将用户提供的内容作为需要持久化的来源。
2. 确保 `.xflow/` 存在。
3. 如果 `.xflow/ai-context.md` 存在，编辑前先读取；如果不存在，则使用下方 AI Context 模板创建。
4. 将内容添加或合并到 `.xflow/ai-context.md` 最合适的章节。
5. 保留用户原意，但表述要简洁、可复用。
6. 不创建或修改任务 Spec、Release Note。

## 别名

以下写法等价：

- `/xflow:start` 或 `xflow start`
- `/xflow:complete` 或 `xflow complete`
- `/xflow:abandon` 或 `xflow abandon`
- `/xflow:learn` 或 `xflow learn`
- `/xflow:record` 或 `xflow record`

## 命名

- 任务 Spec：`.xflow/tasks/readable-feature-name.md`
- Release 文件：`.xflow/releases/readable-feature-name.md`
- 放弃功能记录：`.xflow/history/YYYY-MM-DD-abandoned-readable-feature-name.md`
- 文件名使用小写 kebab-case。

## Task 模板

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

## Release File 模板

```markdown
# Release: <name>

## Release Log

```

## Release Entry 模板

```markdown
### YYYY-MM-DD <summary>

#### 背景

#### 改动

#### 影响

#### 风险
```

## Abandoned Note 模板

```markdown
## YYYY-MM-DD abandoned <name>

### 放弃原因

### 当前状态

### 已有改动

### 回滚需要

### 后续重启建议
```

## AI Context 模板

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

## 原则

- 代码 + Git = 真相。
- Spec = 临时上下文。
- Release Note = 历史总结。
- AI Context = 长期项目知识。
