# xflow

[简体中文](./README.md)

xflow installs command-scoped AI skills for spec-driven workflows.

## What A Skill Is

Each xflow skill is a command guide for an AI agent. After installation, your AI tool can read the matching skill when you invoke a command, then follow a stable workflow for creating specs, executing tasks, writing release notes, and capturing durable project knowledge.

xflow is designed to split feature work into clear stages: define the request, execute the task list, then keep release notes and reusable project knowledge. This reduces lost context during long AI sessions and makes project history easier to trace.

## Install Into A Project

Run this in the project where you want to use xflow:

```bash
npx xflow init
```

Without `--target`, xflow shows an interactive multi-select prompt:

- Use the arrow keys to move.
- Use Space to select or unselect target platforms.
- Press Enter to install the selected platforms.

Choose a specific target:

```bash
npx xflow init --target cursor
npx xflow init --target claude
npx xflow init --target codex
```

Install into multiple targets at once:

```bash
npx xflow init --target cursor,claude
npx xflow init --target cursor,claude,codex
npx xflow init --target all
```

Or overwrite existing skill files without prompts:

```bash
npx xflow init --target cursor --force
```

## Skill Commands

- `/xflow-start <feature-name>`: start a new feature spec.
- `/xflow-do <feature-name-or-file>` / `/xflow:do <feature-name-or-file>`: execute the task list in a feature spec.
- `/xflow-complete <feature-name>`: complete a feature and update its release file.
- `/xflow-abandon <feature-name>`: abandon a feature and write an abandoned record.
- `/xflow-learn <topic>`: extract durable project knowledge from current work.
- `/xflow-record <content>`: directly record content into AI context.

## Skill Details

### `xflow-start`

`xflow-start` starts a new feature. It creates `.xflow/tasks/<feature-name>.md` from the feature name and user context, capturing goals, background, task breakdown, impact, and open questions.

This command exists because requirements, constraints, and todos are easy to scatter across chat. Writing a spec first gives later work a stable source of truth and makes it easier to pause, resume, or hand the task to another agent.

The result is a trackable feature context that `/xflow-do` and `/xflow-complete` can use.

### `xflow-do`

`xflow-do` executes the task list in a feature spec. It reads the selected spec under `.xflow/tasks/`, works through incomplete tasks in order, verifies the result, and updates task status when work is done.

This command exists to keep implementation from skipping steps or drifting away from the agreed plan. The spec task list keeps scope and completion criteria visible.

The result is implementation progress that stays synchronized with the spec, so users can see what is done and what remains.

### `xflow-complete`

`xflow-complete` finishes a feature. It uses the task spec, code changes, and Git state to write `.xflow/releases/<feature-name>.md`, recording background, changes, impact, and risks, then cleans up the completed temporary spec.

This command exists because chat history is not reliable project history. A release file preserves why the feature happened, what changed, and where risk remains.

The result is a stable release record instead of temporary execution context. After completion, it also asks whether to run `learn` so durable project knowledge can be captured in AI Context.

### `xflow-abandon`

`xflow-abandon` abandons a feature. It records why the work stopped, what was completed, what remains, and what should be considered if the work is revisited.

This command exists because abandoned work still contains useful project knowledge, such as invalid approaches, changed priorities, or restart notes.

The result is an explainable abandoned record instead of a task that simply disappears.

### `xflow-learn`

`xflow-learn` extracts durable project knowledge from current work and writes it into xflow AI Context. It focuses on stable facts such as architecture conventions, directory responsibilities, tooling habits, team preferences, and lessons learned.

This command exists because some knowledge is not tied to one feature but affects future work across the project. Capturing it helps later AI sessions follow the real project conventions without repeated explanation.

The result is a growing project-level context that future tasks can reuse.

### `xflow-record`

`xflow-record` directly records user-provided content into AI Context. Unlike `learn`, it does not infer knowledge from the current work; it stores the explicit fact or rule the user provides.

This command exists because some knowledge is already precise and should be saved as-is instead of summarized by the agent.

The result is reusable project context that helps future agents follow the same rule.
