# Xiaohongshu Dashboard

用于小红书与视频号运营复盘的内部驾驶舱。当前仓库已拆分为 `frontend/` 与 `backend/` 两个工作区，前端负责导入与展示，后端负责 AI 分析能力。

## 启动方式

1. `npm install`
2. `npm run dev:frontend`
3. `npm run dev:backend`

## 全量验证

1. `npm run test`
2. `npm run build`

## 支持的输入列

- `platform`
- `account`
- `title`
- `publishDate`
- `contentType`
- `followers`
- `followerDelta`
- `views`
- `likes`
- `favorites`
- `comments`
- `shares`
