#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const packageRoot = path.resolve(__dirname, "..");
const skillSourceDir = path.join(packageRoot, "templates", "skills", "xflow");
const targetDirs = {
  cursor: path.join(process.cwd(), ".cursor", "skills", "xflow"),
  claude: path.join(process.cwd(), ".claude", "skills", "xflow"),
};

function printHelp() {
  console.log(`xflow

Usage:
  xflow init [--target cursor|claude|both] [--force]
  xflow help

Commands:
  init     Install the xflow skill into the current project.
  help     Show this help message.

Options:
  --target  Install target. Defaults to auto-detect, then prompts when possible.
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

function normalizeTarget(target) {
  if (!target) return undefined;
  const value = target.toLowerCase();
  if (["cursor", "claude", "both"].includes(value)) return value;
  return undefined;
}

async function resolveTarget(target) {
  const normalized = normalizeTarget(target);
  if (normalized) return normalized;

  const hasCursor = fs.existsSync(path.join(process.cwd(), ".cursor"));
  const hasClaude = fs.existsSync(path.join(process.cwd(), ".claude"));

  if (hasCursor && !hasClaude) return "cursor";
  if (hasClaude && !hasCursor) return "claude";

  if (!process.stdin.isTTY) return "both";

  while (true) {
    const answer = await ask(
      "Install xflow for Cursor, Claude Code, or both? [c/l/b] "
    );

    if (["c", "cursor"].includes(answer)) return "cursor";
    if (["l", "claude", "claude code", "claudecode"].includes(answer)) {
      return "claude";
    }
    if (["b", "both"].includes(answer)) return "both";

    console.log("Please enter c, l, or b.");
  }
}

function expandTargets(target) {
  return target === "both" ? ["cursor", "claude"] : [target];
}

async function init(options) {
  if (!fs.existsSync(skillSourceDir)) {
    console.error(`xflow skill source not found: ${skillSourceDir}`);
    process.exitCode = 1;
    return;
  }

  const files = ["SKILL.md", "SKILL.zh-CN.md"];
  const installTargets = expandTargets(await resolveTarget(options.target));

  for (const installTarget of installTargets) {
    const targetSkillDir = targetDirs[installTarget];
    fs.mkdirSync(targetSkillDir, { recursive: true });

    for (const file of files) {
      const source = path.join(skillSourceDir, file);
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

  console.log("\nxflow installed. Use commands like /xflow:start in your AI tool.");
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
