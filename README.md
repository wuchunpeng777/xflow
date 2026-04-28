# xflow

xflow installs command-scoped AI skills for spec-driven workflows.

## Install Into A Project

Run this in the project where you want to use xflow:

```bash
npx xflow init
```

Choose a specific target:

```bash
npx xflow init --target cursor
npx xflow init --target claude
npx xflow init --target both
```

Or overwrite existing skill files without prompts:

```bash
npx xflow init --target cursor --force
```

## Commands

- `/xflow-start <feature-name>`: start a new feature spec.
- `/xflow-do <feature-name-or-file>` / `/xflow:do <feature-name-or-file>`: execute the task list in a feature spec.
- `/xflow-complete <feature-name>`: complete a feature and update its release file.
- `/xflow-abandon <feature-name>`: abandon a feature and write an abandoned record.
- `/xflow-learn <topic>`: extract durable project knowledge from current work.
- `/xflow-record <content>`: directly record content into AI context.

Each command is installed as a separate skill:

- `xflow-start`
- `xflow-do`
- `xflow-complete`
- `xflow-abandon`
- `xflow-learn`
- `xflow-record`
