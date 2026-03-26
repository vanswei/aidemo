---
name: "codex-cli-task"
description: "为本机安装并配置 Codex CLI 技能（Skills）。当你需要在线获取并安装 Codex 技能或初始化 Codex CLI 环境时调用。"
---

# Codex CLI Skill 安装器

## 目的
在线获取并安装 Codex 技能（Skills），并在本机用户目录下完成 Codex 技能目录初始化，便于 Codex CLI 自动发现与使用。

## 触发场景
- 你希望“上网安装”某个 Codex 技能（如来自 openai/skills 仓库）
- 你需要初始化 Codex CLI 的技能目录（`%USERPROFILE%\.codex\skills`）
- 你想把 GitHub 上的技能仓库/目录放到本机技能目录中供 Codex 使用

## 输入
- 可选：技能来源仓库地址（默认：https://github.com/openai/skills）
- 可选：目标目录（默认：`%USERPROFILE%\.codex\skills\openai-skills`）

## 输出
- 安装结果：成功/失败
- 本地技能目录路径
- 如失败：原因与可行的修复建议

## 执行步骤
1. 创建本机技能目录：`%USERPROFILE%\.codex\skills`
2. 如系统已安装 `git`，使用 `git clone --depth 1` 拉取仓库；否则下载 Zip 并解压
3. 将技能仓库内容复制到目标目录（默认 `openai-skills`）
4. 输出完成提示（如你在使用 Codex CLI，请重启 Codex 以载入新技能）

## 脚本
- 路径：`.trae/skills/codex-cli-task/install.ps1`
- 用法（PowerShell）：
  - 默认安装到 C 盘：`powershell -ExecutionPolicy Bypass -File .trae/skills/codex-cli-task/install.ps1`
  - 安装到当前目录或其他位置：`powershell -ExecutionPolicy Bypass -File .trae/skills/codex-cli-task/install.ps1 -Target "f:\skill\openai-skills"`

## 注意
- 该安装仅同步技能目录到本机；如果你尚未安装 Codex CLI，请按 Codex 官方文档先完成 CLI 安装
- 安装完成后，如 Codex 未自动识别，请重启 Codex 或其终端进程

## 示例
用户：帮我上网安装这个 skill  
输出：安装成功，技能目录：`C:\Users\<you>\.codex\skills\openai-skills`

