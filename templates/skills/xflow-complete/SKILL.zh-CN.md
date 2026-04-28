---
name: xflow-complete
description: 完成一个 xflow 功能并写入 Release Note。当用户调用 /xflow-complete、xflow complete、/xflow:complete，或要求结束一个功能 Spec 时使用。
---

# xflow Complete

## 目标

完成一个功能，总结本次工作，并维护 `.xflow/releases/` 下的 Release 文件。

不要预先生成 `.xflow/`。只有当本命令需要某个目录或文件，并且它还不存在时，才创建它。

## 命令

以下写法等价：

- `/xflow-complete <feature-name>`
- `/xflow:complete <feature-name>`
- `xflow complete <feature-name>`

## 流程

1. 从 `.xflow/tasks/feature-name.md` 读取当前功能的任务 Spec。
2. 检查代码和 Git 状态，并把它们作为事实来源。
3. 确保 `.xflow/releases/` 存在。
4. 使用 `.xflow/releases/feature-name.md` 作为 Release 文件路径。
5. 如果 Release 文件不存在，使用 Release File 模板创建，并写入本次 Release 条目。
6. 如果 Release 文件已经存在，把本次 Release 条目追加到 Release Log 顶部，旧条目保留在下方。
7. 每次 Release 条目必须包含背景、改动、影响和风险。
8. 除非用户要求保留，否则删除已完成的任务 Spec。

## 命名

- 任务 Spec：`.xflow/tasks/readable-feature-name.md`
- Release 文件：`.xflow/releases/readable-feature-name.md`
- 文件名使用小写 kebab-case。

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

## 原则

- 代码 + Git = 真相。
- Release Note = 历史总结。
- Spec = 临时上下文。
