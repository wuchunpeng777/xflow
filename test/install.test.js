const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const packageRoot = path.resolve(__dirname, "..");
const cliPath = path.join(packageRoot, "bin", "xflow.js");
const skillNames = [
  "xflow-start",
  "xflow-do",
  "xflow-complete",
  "xflow-abandon",
  "xflow-learn",
  "xflow-record",
  "xflow-review",
];
const targetDirectories = {
  cursor: ".cursor",
  claude: ".claude",
  codex: ".codex",
};

function createWorkspace(t) {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "xflow-test-"));
  t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
  return workspace;
}

function runCli(workspace, ...args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: workspace,
    encoding: "utf8",
  });
}

function assertInstalled(workspace, target) {
  const skillsRoot = path.join(
    workspace,
    targetDirectories[target],
    "skills"
  );

  for (const skillName of skillNames) {
    const installedRoot = path.join(skillsRoot, skillName);
    const templateRoot = path.join(
      packageRoot,
      "templates",
      "skills",
      skillName
    );

    for (const fileName of ["SKILL.md", "SKILL.zh-CN.md"]) {
      const installedFile = path.join(installedRoot, fileName);
      const templateFile = path.join(templateRoot, fileName);
      assert.equal(
        fs.readFileSync(installedFile, "utf8"),
        fs.readFileSync(templateFile, "utf8"),
        `${target} should install ${skillName}/${fileName}`
      );
    }
  }
}

for (const target of Object.keys(targetDirectories)) {
  test(`init installs every skill for ${target}`, (t) => {
    const workspace = createWorkspace(t);
    const result = runCli(workspace, "init", "--target", target);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /installed successfully/);
    assertInstalled(workspace, target);
  });
}

test("init --target all installs every skill for every target", (t) => {
  const workspace = createWorkspace(t);
  const result = runCli(workspace, "init", "--target", "all");

  assert.equal(result.status, 0, result.stderr);
  for (const target of Object.keys(targetDirectories)) {
    assertInstalled(workspace, target);
  }
});

test("help lists xflow-review", (t) => {
  const workspace = createWorkspace(t);
  const result = runCli(workspace, "help");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\/xflow-review/);
});

test("xflow-review keeps its business-first review contract", () => {
  const skillRoot = path.join(
    packageRoot,
    "templates",
    "skills",
    "xflow-review"
  );
  const english = fs.readFileSync(path.join(skillRoot, "SKILL.md"), "utf8");
  const chinese = fs.readFileSync(
    path.join(skillRoot, "SKILL.zh-CN.md"),
    "utf8"
  );

  for (const pattern of [
    /fresh agent conversation/,
    /Confirmed requirement/,
    /Not proven/,
    /expected flow/,
    /actual flow/,
    /Use Mermaid/,
    /Do not modify reviewed code/,
  ]) {
    assert.match(english, pattern);
  }

  for (const pattern of [
    /新的 Agent 会话/,
    /已确认需求/,
    /未证明/,
    /期望流程/,
    /实际流程/,
    /使用 Mermaid/,
    /不要修改被审查代码/,
  ]) {
    assert.match(chinese, pattern);
  }
});
