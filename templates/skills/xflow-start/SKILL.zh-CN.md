---
name: xflow-start
description: 开启一个新的 xflow 功能 Spec。当用户调用 /xflow-start、xflow start、/xflow:start，或要求用长期 AI 上下文开启新功能任务时使用。
---

# xflow Start

## 目标

开启一个新功能，并在 `.xflow/tasks/` 下创建临时任务 Spec。

不要预先生成 `.xflow/`。只有当本命令需要某个目录或文件，并且它还不存在时，才创建它。

## 命令

以下写法等价：

- `/xflow-start <feature-name>`
- `/xflow:start <feature-name>`
- `xflow start <feature-name>`

## 流程

1. 如果 `.xflow/ai-context.md` 存在，先读取它；如果不存在，继续处理当前任务，只有在需要沉淀长期项目知识时才创建。
2. 确保 `.xflow/tasks/` 存在。
3. 使用 `.xflow/tasks/feature-name.md` 作为任务 Spec 路径。
4. 如果已经存在同名任务 Spec，停止并提示用户选择：
   - 抛弃之前的 Spec，并用同名功能创建新的 Spec。
   - 继续之前的 Spec。
   - 使用另一个新的功能名。
5. 只有在名称确认后，才使用模板创建任务 Spec。
6. 填写目标、背景、修改要求、不允许做的事和验收标准。
7. 如果范围不清楚，编码前先向用户确认缺失需求。

## 命名

- 任务 Spec：`.xflow/tasks/readable-feature-name.md`
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

## 原则

- 代码 + Git = 真相。
- Spec = 临时上下文。
- AI Context = 长期项目知识。
