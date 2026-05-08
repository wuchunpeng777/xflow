# xflow

[English](./README.en.md)

xflow 为基于 Spec 的 AI 开发流程安装按命令拆分的技能。

## 安装到项目

在需要使用 xflow 的项目中运行：

```bash
npx xflow init
```

也可以指定安装目标：

```bash
npx xflow init --target cursor
npx xflow init --target claude
npx xflow init --target both
```

如需跳过确认并覆盖已有技能文件：

```bash
npx xflow init --target cursor --force
```

## 命令

- `/xflow-start <feature-name>`：创建新的功能 Spec。
- `/xflow-do <feature-name-or-file>` / `/xflow:do <feature-name-or-file>`：执行功能 Spec 中的任务列表。
- `/xflow-complete <feature-name>`：完成功能并更新 Release 文件。
- `/xflow-abandon <feature-name>`：放弃功能并写入放弃记录。
- `/xflow-learn <topic>`：从当前工作中提取长期项目知识。
- `/xflow-record <content>`：直接把内容记录到 AI Context。

每个命令都会作为独立技能安装：

- `xflow-start`
- `xflow-do`
- `xflow-complete`
- `xflow-abandon`
- `xflow-learn`
- `xflow-record`
