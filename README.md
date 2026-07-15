# xflow

[English](./README.en.md)

xflow 为 AI 开发流程安装按命令拆分的技能，既支持基于 Spec 的实现流程，也支持不依赖 Spec 的事后代码验收。

## Skill 是什么

xflow 的每个 skill 都是一份面向 AI Agent 的命令说明。安装后，AI 工具可以在用户调用对应命令时读取这份说明，并按固定流程创建 Spec、执行任务、验收代码、写 Release、沉淀长期知识。

xflow 的意图是把一次功能开发拆成清晰阶段：先明确需求，再按任务执行，最后留下 Release 记录和可复用的项目知识。这样可以减少上下文丢失，让多轮 AI 协作更稳定，也让项目历史更容易追踪。

## 安装到项目

在需要使用 xflow 的项目中安装：

```bash
npm i @wcpwcp9/xflow
```

也可以全局安装，方便在任意项目中直接使用 `xflow` 命令：

```bash
npm i -g @wcpwcp9/xflow
```

然后初始化 xflow 技能：

```bash
npx xflow init
```

如果已全局安装，也可以直接运行：

```bash
xflow init
```

不传 `--target` 时，xflow 会显示可视化多选界面：

- 使用方向键上下移动。
- 使用空格选择或取消选择目标平台。
- 按 Enter 安装已选择的平台。

也可以指定安装目标：

```bash
npx xflow init --target cursor
npx xflow init --target claude
npx xflow init --target codex
```

支持一次安装到多个目标：

```bash
npx xflow init --target cursor,claude
npx xflow init --target cursor,claude,codex
npx xflow init --target all
```

如果目标位置已存在 xflow 技能文件，安装时会自动覆盖，不会额外询问。

## Skill 命令

- `/xflow-start <feature-name>`：创建新的功能 Spec。
- `/xflow-do <feature-name-or-file>` / `/xflow:do <feature-name-or-file>`：执行功能 Spec 中的任务列表。
- `/xflow-review <file-or-directory>...` / `/xflow:review <file-or-directory>...`：按照业务需求验收指定代码，不要求存在 Spec。
- `/xflow-complete <feature-name>`：完成功能并更新 Release 文件。
- `/xflow-abandon <feature-name>`：放弃功能并写入放弃记录。
- `/xflow-learn <topic>`：从当前工作中提取长期项目知识。
- `/xflow-record <content>`：直接把内容记录到 AI Context。

## AI Context

xflow 将长期项目知识保存到 `.xflow/ai-context/` 目录。入口文件是 `.xflow/ai-context/index.md`，它只保存简短摘要和主题文件说明；具体知识按主题拆到 `project.md`、`tech-stack.md`、`architecture.md`、`quality.md`、`code-standards.md`、`xflow.md` 等文件。

执行任务时，Agent 应先读取 `index.md`，再根据当前 Spec 只读取相关主题文件。这样可以避免每次把所有长期知识都放进上下文，减少 token 使用。

## Skill 说明

### `xflow-start`

`xflow-start` 用来开始一个新功能。它会围绕功能名和用户描述创建 `.xflow/tasks/<feature-name>.md`，把目标、背景、任务拆解、影响和开放问题写进 Spec。

这个命令存在的原因是：功能开始时最容易把需求、约束和待办散落在聊天上下文里。先写 Spec 可以让后续执行有稳定依据，也方便中途暂停、恢复或换 Agent 继续。

达到的效果是：项目里会得到一份可追踪的功能上下文，后续 `/xflow-do`、`/xflow-complete` 都围绕它工作。

### `xflow-do`

`xflow-do` 用来执行功能 Spec 里的任务列表。它会读取 `.xflow/tasks/` 下的指定 Spec，按未完成任务顺序推进实现、验证结果，并在完成后更新任务状态。

这个命令存在的原因是：执行阶段需要避免跳步和遗漏。让 Agent 以 Spec 的任务列表为准，可以让改动范围更明确，也让每一步完成条件更清楚。

达到的效果是：功能实现和 Spec 状态同步推进，用户可以随时看到还剩哪些任务、哪些已经完成。

### `xflow-review`

`xflow-review` 用来在 AI 生成代码后进行独立的宏观验收，建议在新的 Agent 会话中运行。它不要求功能经过 xflow 流程，也不要求存在 Spec；用户只需指定文件或目录，并通过简短访谈确认业务场景和验收标准。

这个命令存在的原因是：生成大量代码很快，但逐行检查实现成本很高。Review 会把业务要求逐项映射到代码和验证证据，生成聚焦的架构图、期望与实际业务流程图，并按风险列出最值得人工查看的位置。

达到的效果是：用户可以先从业务符合性、关键数据流、架构边界和风险证据把控实现，只在少量关键代码处下钻。Review 默认只出报告，不修改代码，也不阻止其他 xflow 命令。

### `xflow-complete`

`xflow-complete` 用来结束一个功能。它会根据任务 Spec、代码变更和 Git 状态写入 `.xflow/releases/<feature-name>.md`，记录背景、改动、影响和风险，并清理已完成的临时 Spec。

这个命令存在的原因是：聊天记录不是可靠的项目历史。功能完成后把关键信息沉淀到 Release 文件，可以让未来回看时知道为什么做、做了什么、可能影响哪里。

达到的效果是：功能从临时执行上下文转为稳定 Release 记录。完成后还会询问是否需要执行 `learn`，把值得长期保留的项目知识写入 AI Context。

### `xflow-abandon`

`xflow-abandon` 用来放弃一个功能。它会把放弃原因、已完成内容、未完成内容和后续建议记录下来，然后处理对应任务 Spec。

这个命令存在的原因是：被放弃的功能也包含有价值的信息，例如为什么不做、哪些尝试无效、以后如果重启需要注意什么。

达到的效果是：项目不会只留下一个消失的任务文件，而是保留可解释的放弃记录，减少之后重复踩坑。

### `xflow-learn`

`xflow-learn` 用来从当前工作中提取长期项目知识，并写入 `.xflow/ai-context/`。它关注稳定事实，比如架构约定、目录职责、工具链习惯、团队偏好和踩坑经验。

这个命令存在的原因是：很多项目知识不属于某个单独功能，但会影响未来所有任务。把这些知识沉淀下来，可以让之后的 AI 协作更贴近项目真实约定。

达到的效果是：AI Context 会按主题逐步积累项目级知识，后续任务可以按需复用相关事实，而不需要用户反复解释。

### `xflow-record`

`xflow-record` 用来把用户明确给出的内容直接记录到 `.xflow/ai-context/` 的合适主题文件。它不会像 `learn` 那样主动提炼当前工作，而是保存用户指定的事实或规则。

这个命令存在的原因是：有些知识用户已经表达得很明确，不需要 Agent 再总结判断，直接记录更准确。

达到的效果是：指定内容会成为可复用的项目上下文，帮助后续 Agent 按同一规则工作。
