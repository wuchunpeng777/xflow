#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const packageRoot = path.resolve(__dirname, "..");
const skillSourceRoot = path.join(packageRoot, "templates", "skills");
const skillNames = [
  "xflow-start",
  "xflow-do",
  "xflow-complete",
  "xflow-abandon",
  "xflow-learn",
  "xflow-record",
];
const targetRoots = {
  cursor: path.join(process.cwd(), ".cursor", "skills"),
  claude: path.join(process.cwd(), ".claude", "skills"),
  codex: path.join(process.cwd(), ".codex", "skills"),
};
const targetNames = Object.keys(targetRoots);
const targetLabels = {
  cursor: "Cursor",
  claude: "Claude Code",
  codex: "Codex",
};

function printHelp() {
  console.log(`xflow

Usage:
  xflow init [--target cursor|claude|codex|all|cursor,claude] [--force]
  xflow help

Commands:
  init     Install xflow command skills into the current project.
  help     Show this help message.

Options:
  --target  Install target(s). Use comma-separated values for multiple targets.
            Without --target, use an interactive multi-select prompt.
  --force   Overwrite existing xflow skill files without prompting.
`);
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

async function confirmOverwrite(relativePath) {
  while (true) {
    const answer = await ask(
      `${relativePath} already exists. Overwrite, skip, or abort? [o/s/a] `
    );

    if (["o", "overwrite"].includes(answer)) return "overwrite";
    if (["s", "skip"].includes(answer)) return "skip";
    if (["a", "abort"].includes(answer)) return "abort";

    console.log("Please enter o, s, or a.");
  }
}

function getOptionValue(args, name) {
  const prefix = `${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1];

  return undefined;
}

function normalizeTargetName(target) {
  const value = target.toLowerCase();
  if (value === "claude-code" || value === "claudecode") return "claude";
  if (targetNames.includes(value)) return value;
  return undefined;
}

function parseTargets(target) {
  if (!target) return undefined;

  const normalized = target.trim().toLowerCase();
  if (normalized === "all") return targetNames;

  const targets = [];
  const parts = normalized.split(/[,+\s]+/).filter(Boolean);

  for (const part of parts) {
    const targetName = normalizeTargetName(part);
    if (!targetName) return undefined;
    if (!targets.includes(targetName)) targets.push(targetName);
  }

  return targets.length > 0 ? targets : undefined;
}

function getDetectedTargets() {
  return targetNames.filter((targetName) => {
    const targetRoot = targetRoots[targetName];
    return fs.existsSync(path.dirname(targetRoot));
  });
}

function selectTargets(defaultTargets) {
  const input = process.stdin;
  const output = process.stdout;
  const selectedTargets = new Set(defaultTargets);
  let activeIndex = 0;
  let renderedLines = 0;
  let warning = "";

  return new Promise((resolve) => {
    function cleanup() {
      input.off("keypress", onKeypress);
      if (input.isTTY) input.setRawMode(false);
      output.write("\x1b[?25h");
    }

    function render() {
      if (renderedLines > 0) {
        output.write(`\x1b[${renderedLines}A`);
        output.write("\x1b[0J");
      }

      const lines = [
        "Select xflow install targets:",
        "Use Up/Down to move, Space to select, Enter to install.",
        "",
        ...targetNames.map((targetName, index) => {
          const cursor = index === activeIndex ? ">" : " ";
          const checked = selectedTargets.has(targetName) ? "[x]" : "[ ]";
          return `${cursor} ${checked} ${targetLabels[targetName]} (${targetName})`;
        }),
      ];

      if (warning) {
        lines.push("", warning);
      }

      output.write(`${lines.join("\n")}\n`);
      renderedLines = lines.length;
    }

    function finish(targets) {
      cleanup();
      output.write("\n");
      resolve(targets);
    }

    function onKeypress(_str, key) {
      if (key.ctrl && key.name === "c") {
        process.exitCode = 130;
        finish([]);
        return;
      }

      if (key.name === "up") {
        activeIndex = (activeIndex - 1 + targetNames.length) % targetNames.length;
        warning = "";
        render();
        return;
      }

      if (key.name === "down") {
        activeIndex = (activeIndex + 1) % targetNames.length;
        warning = "";
        render();
        return;
      }

      if (key.name === "space") {
        const targetName = targetNames[activeIndex];
        if (selectedTargets.has(targetName)) {
          selectedTargets.delete(targetName);
        } else {
          selectedTargets.add(targetName);
        }
        warning = "";
        render();
        return;
      }

      if (key.name === "return") {
        const targets = targetNames.filter((targetName) =>
          selectedTargets.has(targetName)
        );
        if (targets.length === 0) {
          warning = "Select at least one target before pressing Enter.";
          render();
          return;
        }
        finish(targets);
      }
    }

    readline.emitKeypressEvents(input);
    if (input.isTTY) input.setRawMode(true);
    output.write("\x1b[?25l");
    input.on("keypress", onKeypress);
    render();
  });
}

async function resolveTarget(target) {
  const parsedTargets = parseTargets(target);
  if (parsedTargets) return parsedTargets;
  if (target) {
    console.error(
      `Invalid --target value: ${target}. Use cursor, claude, codex, all, or comma-separated values.`
    );
    process.exitCode = 1;
    return [];
  }

  if (!process.stdin.isTTY) return targetNames;
  return selectTargets(getDetectedTargets());
}

async function init(options) {
  if (!fs.existsSync(skillSourceRoot)) {
    console.error(`xflow skill source not found: ${skillSourceRoot}`);
    process.exitCode = 1;
    return;
  }

  const files = ["SKILL.md", "SKILL.zh-CN.md"];
  const installTargets = await resolveTarget(options.target);
  if (installTargets.length === 0) return;

  for (const installTarget of installTargets) {
    const targetRoot = targetRoots[installTarget];

    for (const skillName of skillNames) {
      const sourceSkillDir = path.join(skillSourceRoot, skillName);
      const targetSkillDir = path.join(targetRoot, skillName);

      if (!fs.existsSync(sourceSkillDir)) {
        console.error(`xflow skill source not found: ${sourceSkillDir}`);
        process.exitCode = 1;
        return;
      }

      fs.mkdirSync(targetSkillDir, { recursive: true });

      for (const file of files) {
        const source = path.join(sourceSkillDir, file);
        const target = path.join(targetSkillDir, file);
        const relativeTarget = path.relative(process.cwd(), target);

        if (fs.existsSync(target) && !options.force) {
          const choice = await confirmOverwrite(relativeTarget);
          if (choice === "abort") {
            console.log("xflow init aborted.");
            return;
          }
          if (choice === "skip") {
            console.log(`Skipped ${relativeTarget}`);
            continue;
          }
        }

        copyFile(source, target);
        console.log(`Installed ${relativeTarget}`);
      }
    }
  }

  console.log("\nxflow command skills installed. Use commands like /xflow-start in your AI tool.");
  console.log("No .xflow/ directory was created. xflow creates it only when needed.");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = {
    force: args.includes("--force"),
    target: getOptionValue(args, "--target"),
  };

  if (!command || ["help", "-h", "--help"].includes(command)) {
    printHelp();
    return;
  }

  if (command === "init") {
    await init(options);
    return;
  }

  console.error(`Unknown command: ${command}\n`);
  printHelp();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
