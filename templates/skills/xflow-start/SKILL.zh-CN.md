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
3. 使用用户 start 命令中给定的原始 `<feature-name>` 作为任务 Spec 名称和路径片段：`.xflow/tasks/<feature-name>.md`。
4. 如果已经存在同名任务 Spec，停止并提示用户选择：
   - 抛弃之前的 Spec，并用同名功能创建新的 Spec。
   - 继续之前的 Spec。
   - 使用另一个新的功能名。
5. 只有在名称确认后，才使用模板创建任务 Spec。
6. 先根据已知信息填写初始任务 Spec，包括目标、背景、修改要求、不允许做的事和验收标准。
7. 创建任务 Spec 后，自动进入类似 plan 模式的需求澄清阶段：
   - 总结用户请求和当前 Spec 中已经明确的信息。
   - 围绕缺失需求、约束、边界情况、验收标准和非目标提出聚焦问题。
   - 用户回答后，更新任务 Spec。
   - 持续澄清，直到 Spec 足够具体，可以指导实现。
8. `xflow-start` 后不要直接开始编码，除非用户明确要求开始实现。

## 命名

- 任务 Spec：`.xflow/tasks/<feature-name>.md`
- 必须原样保留用户命令里的名称，包括语言、拼写、大小写和分隔符。
- 不要翻译、总结、转小写、改成 kebab-case，或用其他方式重写名称。
- 如果用户给定的名称包含文件路径不安全字符，停止并请用户提供一个有效替代名称。

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

## 待确认问题

- 
```

## 原则

- 代码 + Git = 真相。
- Spec = 临时上下文。
- AI Context = 长期项目知识。
