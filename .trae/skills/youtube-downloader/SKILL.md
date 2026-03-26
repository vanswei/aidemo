---
name: "youtube-downloader"
description: "下载YouTube分享链接对应的视频文件。用户提供YouTube链接并请求下载时调用。"
---

# YouTube 视频下载

## 目的
在用户提供YouTube分享链接时，下载对应视频到本地指定目录，并返回文件路径与格式信息。

## 触发场景
- 用户请求下载YouTube视频或分享链接
- 用户希望保存YouTube视频为本地文件

## 输入要求
- 必须提供有效的YouTube视频链接
- 可选：指定下载目录、视频格式或清晰度、音频模式、字幕语言

## 输出要求
- 明确下载结果：成功/失败
- 成功时返回本地文件路径、视频格式与分辨率
- 失败时返回错误原因与可行的修复建议

## 执行步骤
1. 校验链接格式与可访问性
2. 检查下载工具可用性（如 yt-dlp），缺失则自动安装
3. 缺少 ffmpeg 时自动下载并使用本地 ffmpeg.exe
4. 执行下载并保存到指定目录
5. 输出下载结果与文件信息

## 脚本
- 路径：.trae/skills/youtube-downloader/download_youtube.py
- 用法：python .trae/skills/youtube-downloader/download_youtube.py <url> -o <输出目录> -f <格式>
- 音频：python .trae/skills/youtube-downloader/download_youtube.py <url> -o <输出目录> -A
- 字幕：python .trae/skills/youtube-downloader/download_youtube.py <url> -o <输出目录> --subs-lang zh-CN

## 合规要求
- 仅下载用户有权获取的内容
- 遵守YouTube服务条款与版权要求
- 不绕过付费、DRM或访问控制

## 示例
用户：下载这个链接的视频 https://youtu.be/xxxx  
输出：下载成功，文件路径与格式信息
