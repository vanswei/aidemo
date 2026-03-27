# AI Analysis Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a same-repo backend that calls an OpenAI-compatible API for manual dashboard analysis, then show the result in the frontend while removing total-follower messaging from the hero summary.

**Architecture:** Split the repo into `frontend/` and `backend/`, keep the existing Vite dashboard under `frontend/`, and add a small Express service under `backend/`. The frontend sends a compact dashboard snapshot to `/api/analyze`; the backend validates it, calls the model through the OpenAI SDK, normalizes the result into stable JSON, and returns it for display.

**Tech Stack:** Vite, React, TypeScript, Vitest, Express, OpenAI SDK, npm workspaces

---

## File Structure

### Root

- Create: `F:/skill/.worktrees/develop/package.json`
- Modify: `F:/skill/.worktrees/develop/README.md`
- Create: `F:/skill/.worktrees/develop/.env.example`

Responsibilities:

- Root `package.json` manages workspaces and unified scripts.
- `.env.example` documents backend runtime configuration.
- `README.md` explains how to run frontend and backend together.

### Frontend

- Move: `F:/skill/.worktrees/develop/src` -> `F:/skill/.worktrees/develop/frontend/src`
- Move: `F:/skill/.worktrees/develop/index.html` -> `F:/skill/.worktrees/develop/frontend/index.html`
- Move: `F:/skill/.worktrees/develop/vite.config.ts` -> `F:/skill/.worktrees/develop/frontend/vite.config.ts`
- Move: `F:/skill/.worktrees/develop/tsconfig.json` -> `F:/skill/.worktrees/develop/frontend/tsconfig.json`
- Move: `F:/skill/.worktrees/develop/package.json` -> `F:/skill/.worktrees/develop/frontend/package.json`
- Create: `F:/skill/.worktrees/develop/frontend/src/services/analysis-api.ts`
- Create: `F:/skill/.worktrees/develop/frontend/src/domain/analysis.ts`
- Create: `F:/skill/.worktrees/develop/frontend/src/components/AIAnalysisPanel.tsx`
- Modify: `F:/skill/.worktrees/develop/frontend/src/App.tsx`
- Modify: `F:/skill/.worktrees/develop/frontend/src/components/dashboard.module.css`
- Modify: `F:/skill/.worktrees/develop/frontend/src/components/App.test.tsx`

Responsibilities:

- `analysis.ts` defines frontend request/response types and builders.
- `analysis-api.ts` performs HTTP calls to backend.
- `AIAnalysisPanel.tsx` owns manual trigger, loading, error, and result rendering.
- `App.tsx` builds the dashboard snapshot and removes total-follower messaging from hero summary.

### Backend

- Create: `F:/skill/.worktrees/develop/backend/package.json`
- Create: `F:/skill/.worktrees/develop/backend/tsconfig.json`
- Create: `F:/skill/.worktrees/develop/backend/src/index.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/app.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/config.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/types.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/validate.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/prompt.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/openai-client.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/analyze-service.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/app.test.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/analyze-service.test.ts`

Responsibilities:

- `config.ts` validates env vars.
- `types.ts` defines request/response contracts.
- `validate.ts` checks incoming payloads.
- `prompt.ts` builds the structured Chinese analysis prompt.
- `openai-client.ts` creates the SDK client.
- `analyze-service.ts` calls model and normalizes JSON output.
- `app.ts` exposes `/api/health` and `/api/analyze`.

### Task 1: Restructure Repo Into Workspaces

**Files:**
- Create: `F:/skill/.worktrees/develop/package.json`
- Create: `F:/skill/.worktrees/develop/.env.example`
- Modify: `F:/skill/.worktrees/develop/README.md`
- Move/Create: `F:/skill/.worktrees/develop/frontend/*`

- [ ] **Step 1: Write the failing workspace smoke test as a command checklist**

Expected commands after restructure:

```bash
npm run test --workspace frontend
npm run build --workspace frontend
npm run dev:backend
```

Expected initial result before restructure:

- Root `npm run test --workspace frontend` fails because no workspaces exist.

- [ ] **Step 2: Run the failing workspace command**

Run:

```bash
npm run test --workspace frontend
```

Expected: npm reports missing workspace configuration.

- [ ] **Step 3: Create the root workspace manifest**

`F:/skill/.worktrees/develop/package.json`

```json
{
  "name": "skill-monorepo",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev:frontend": "npm run dev --workspace frontend",
    "dev:backend": "npm run dev --workspace backend",
    "test": "npm run test --workspace frontend && npm run test --workspace backend",
    "build": "npm run build --workspace frontend && npm run build --workspace backend"
  }
}
```

- [ ] **Step 4: Move the current frontend files into `frontend/`**

Move these paths without changing their contents yet:

```text
src -> frontend/src
index.html -> frontend/index.html
vite.config.ts -> frontend/vite.config.ts
tsconfig.json -> frontend/tsconfig.json
package.json -> frontend/package.json
package-lock.json -> package-lock.json
```

Notes:

- Keep the root `package-lock.json`
- Do not move `dist/`
- Remove or ignore `tsconfig.tsbuildinfo`

- [ ] **Step 5: Update the frontend package name and scripts**

`F:/skill/.worktrees/develop/frontend/package.json`

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 6: Add backend env documentation**

`F:/skill/.worktrees/develop/.env.example`

```env
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4.1-mini
PORT=8787
```

- [ ] **Step 7: Update README startup instructions**

Add a section like:

```md
## 启动方式

### 前端

`npm run dev:frontend`

### 后端

`npm run dev:backend`

### 全量验证

`npm run test`
`npm run build`
```

- [ ] **Step 8: Run frontend tests after restructure**

Run:

```bash
npm run test --workspace frontend
```

Expected: existing frontend tests pass.

- [ ] **Step 9: Commit**

```bash
git add package.json .env.example README.md frontend
git commit -m "chore: split dashboard into frontend workspace"
```

### Task 2: Scaffold Backend Service With Health Check

**Files:**
- Create: `F:/skill/.worktrees/develop/backend/package.json`
- Create: `F:/skill/.worktrees/develop/backend/tsconfig.json`
- Create: `F:/skill/.worktrees/develop/backend/src/index.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/app.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/config.ts`
- Test: `F:/skill/.worktrees/develop/backend/src/app.test.ts`

- [ ] **Step 1: Write the failing health-check test**

`F:/skill/.worktrees/develop/backend/src/app.test.ts`

```ts
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app';

describe('createApp', () => {
  it('returns ok from /api/health', async () => {
    const app = createApp({
      openAiBaseUrl: 'https://example.com/v1',
      openAiApiKey: 'test-key',
      openAiModel: 'test-model',
      port: 8787,
    });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
```

- [ ] **Step 2: Run the backend test to verify it fails**

Run:

```bash
npm run test --workspace backend -- src/app.test.ts
```

Expected: fail because backend package/app do not exist.

- [ ] **Step 3: Create backend package manifest**

`F:/skill/.worktrees/develop/backend/package.json`

```json
{
  "name": "backend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "test": "vitest run"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2",
    "openai": "^4.86.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.1",
    "@types/node": "^22.13.10",
    "supertest": "^7.0.0",
    "tsx": "^4.19.3",
    "typescript": "^5.8.2",
    "vitest": "^3.0.9"
  }
}
```

- [ ] **Step 4: Add backend TypeScript config**

`F:/skill/.worktrees/develop/backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create config loader**

`F:/skill/.worktrees/develop/backend/src/config.ts`

```ts
import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  OPENAI_BASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(8787),
});

export type AppConfig = {
  openAiBaseUrl: string;
  openAiApiKey: string;
  openAiModel: string;
  port: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = schema.parse(env);

  return {
    openAiBaseUrl: parsed.OPENAI_BASE_URL,
    openAiApiKey: parsed.OPENAI_API_KEY,
    openAiModel: parsed.OPENAI_MODEL,
    port: parsed.PORT,
  };
}
```

- [ ] **Step 6: Create Express app and entrypoint**

`F:/skill/.worktrees/develop/backend/src/app.ts`

```ts
import cors from 'cors';
import express from 'express';
import type { AppConfig } from './config';

export function createApp(_config: AppConfig) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '512kb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  return app;
}
```

`F:/skill/.worktrees/develop/backend/src/index.ts`

```ts
import { createApp } from './app';
import { loadConfig } from './config';

const config = loadConfig();
const app = createApp(config);

app.listen(config.port, () => {
  console.log(`backend listening on ${config.port}`);
});
```

- [ ] **Step 7: Run the health test and backend build**

Run:

```bash
npm run test --workspace backend -- src/app.test.ts
npm run build --workspace backend
```

Expected: test passes and TypeScript build succeeds.

- [ ] **Step 8: Commit**

```bash
git add backend package.json package-lock.json
git commit -m "feat: scaffold ai analysis backend"
```

### Task 3: Add Analyze Request Validation And Service Tests

**Files:**
- Create: `F:/skill/.worktrees/develop/backend/src/types.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/validate.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/prompt.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/openai-client.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/analyze-service.ts`
- Create: `F:/skill/.worktrees/develop/backend/src/analyze-service.test.ts`

- [ ] **Step 1: Write the failing service test for structured output parsing**

`F:/skill/.worktrees/develop/backend/src/analyze-service.test.ts`

```ts
import { describe, expect, it, vi } from 'vitest';
import { analyzeDashboard } from './analyze-service';
import type { AnalysisRequest } from './types';

describe('analyzeDashboard', () => {
  it('parses model json into structured analysis output', async () => {
    const request: AnalysisRequest = {
      range: '30d',
      platform: 'all',
      kpis: {
        totalAccounts: 2,
        totalFollowerDelta: 80,
        totalViews: 23000,
      },
      platforms: [],
      accountRanking: [],
      anomalies: [],
      topContent: [],
    };

    const createResponse = vi.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: '整体表现稳定。',
              platformInsights: ['小红书涨粉更强。'],
              risks: ['视频号互动偏弱。'],
              actions: ['优先优化视频号结尾引导。'],
            }),
          },
        },
      ],
    });

    const result = await analyzeDashboard(
      request,
      {
        chat: { completions: { create: createResponse } },
      } as never,
      'test-model',
    );

    expect(result.summary).toBe('整体表现稳定。');
    expect(result.actions).toEqual(['优先优化视频号结尾引导。']);
  });
});
```

- [ ] **Step 2: Run the service test to verify it fails**

Run:

```bash
npm run test --workspace backend -- src/analyze-service.test.ts
```

Expected: fail because service/types do not exist.

- [ ] **Step 3: Add request and response types**

`F:/skill/.worktrees/develop/backend/src/types.ts`

```ts
export type AnalysisRequest = {
  range: '7d' | '30d';
  platform: 'all' | 'xiaohongshu' | 'wechat-channel';
  kpis: {
    totalAccounts: number;
    totalFollowerDelta: number;
    totalViews: number;
  };
  platforms: Array<{
    platform: 'xiaohongshu' | 'wechat-channel';
    views: number;
    followerDelta: number;
    engagementRate: number;
  }>;
  accountRanking: Array<{
    accountName: string;
    platform: 'xiaohongshu' | 'wechat-channel';
    views: number;
    followerDelta: number;
    engagementRate: number;
  }>;
  anomalies: Array<{
    accountName: string;
    message: string;
  }>;
  topContent: Array<{
    contentTitle: string;
    platform: 'xiaohongshu' | 'wechat-channel';
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
};

export type AnalysisResponse = {
  summary: string;
  platformInsights: string[];
  risks: string[];
  actions: string[];
};
```

- [ ] **Step 4: Add payload validation**

`F:/skill/.worktrees/develop/backend/src/validate.ts`

```ts
import { z } from 'zod';

export const analysisRequestSchema = z.object({
  range: z.enum(['7d', '30d']),
  platform: z.enum(['all', 'xiaohongshu', 'wechat-channel']),
  kpis: z.object({
    totalAccounts: z.number(),
    totalFollowerDelta: z.number(),
    totalViews: z.number(),
  }),
  platforms: z.array(
    z.object({
      platform: z.enum(['xiaohongshu', 'wechat-channel']),
      views: z.number(),
      followerDelta: z.number(),
      engagementRate: z.number(),
    }),
  ),
  accountRanking: z.array(
    z.object({
      accountName: z.string(),
      platform: z.enum(['xiaohongshu', 'wechat-channel']),
      views: z.number(),
      followerDelta: z.number(),
      engagementRate: z.number(),
    }),
  ),
  anomalies: z.array(
    z.object({
      accountName: z.string(),
      message: z.string(),
    }),
  ),
  topContent: z.array(
    z.object({
      contentTitle: z.string(),
      platform: z.enum(['xiaohongshu', 'wechat-channel']),
      views: z.number(),
      likes: z.number(),
      comments: z.number(),
      shares: z.number(),
    }),
  ),
});
```

- [ ] **Step 5: Add prompt builder and service**

`F:/skill/.worktrees/develop/backend/src/prompt.ts`

```ts
import type { AnalysisRequest } from './types';

export function buildAnalysisPrompt(request: AnalysisRequest) {
  return [
    '你是中文社媒运营分析助手。',
    '请只基于给定数据输出 JSON，不要输出额外解释。',
    '字段必须包含 summary、platformInsights、risks、actions。',
    '每个数组字段输出 1 到 3 条简洁中文结论。',
    `输入数据：${JSON.stringify(request)}`,
  ].join('\n');
}
```

`F:/skill/.worktrees/develop/backend/src/analyze-service.ts`

```ts
import { z } from 'zod';
import { buildAnalysisPrompt } from './prompt';
import type { AnalysisRequest, AnalysisResponse } from './types';

const analysisResponseSchema = z.object({
  summary: z.string(),
  platformInsights: z.array(z.string()),
  risks: z.array(z.string()),
  actions: z.array(z.string()),
});

export async function analyzeDashboard(
  request: AnalysisRequest,
  client: {
    chat: {
      completions: {
        create: (input: unknown) => Promise<{
          choices: Array<{ message: { content: string | null } }>;
        }>;
      };
    };
  },
  model: string,
): Promise<AnalysisResponse> {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [{ role: 'user', content: buildAnalysisPrompt(request) }],
  });

  const content = completion.choices[0]?.message.content;
  const parsed = analysisResponseSchema.parse(JSON.parse(content ?? '{}'));
  return parsed;
}
```

- [ ] **Step 6: Add OpenAI client factory**

`F:/skill/.worktrees/develop/backend/src/openai-client.ts`

```ts
import OpenAI from 'openai';

export function createOpenAiClient(baseURL: string, apiKey: string) {
  return new OpenAI({
    baseURL,
    apiKey,
  });
}
```

- [ ] **Step 7: Run the service test**

Run:

```bash
npm run test --workspace backend -- src/analyze-service.test.ts
```

Expected: test passes.

- [ ] **Step 8: Commit**

```bash
git add backend/src
git commit -m "feat: add ai analysis service and validation"
```

### Task 4: Expose `/api/analyze` In Express

**Files:**
- Modify: `F:/skill/.worktrees/develop/backend/src/app.ts`
- Test: `F:/skill/.worktrees/develop/backend/src/app.test.ts`

- [ ] **Step 1: Extend the failing app test for `/api/analyze`**

Append this test to `F:/skill/.worktrees/develop/backend/src/app.test.ts`:

```ts
it('returns structured analysis from /api/analyze', async () => {
  const app = createApp(
    {
      openAiBaseUrl: 'https://example.com/v1',
      openAiApiKey: 'test-key',
      openAiModel: 'test-model',
      port: 8787,
    },
    {
      analyzeDashboard: async () => ({
        summary: '整体表现稳定。',
        platformInsights: ['小红书涨粉更强。'],
        risks: ['视频号互动偏弱。'],
        actions: ['优先优化视频号结尾引导。'],
      }),
    },
  );

  const response = await request(app).post('/api/analyze').send({
    range: '30d',
    platform: 'all',
    kpis: { totalAccounts: 2, totalFollowerDelta: 80, totalViews: 23000 },
    platforms: [],
    accountRanking: [],
    anomalies: [],
    topContent: [],
  });

  expect(response.status).toBe(200);
  expect(response.body.summary).toBe('整体表现稳定。');
});
```

- [ ] **Step 2: Run the app test to verify it fails**

Run:

```bash
npm run test --workspace backend -- src/app.test.ts
```

Expected: fail because `createApp` does not expose `/api/analyze`.

- [ ] **Step 3: Implement dependency-injected analyze route**

Replace `F:/skill/.worktrees/develop/backend/src/app.ts` with:

```ts
import cors from 'cors';
import express from 'express';
import type { AppConfig } from './config';
import { createOpenAiClient } from './openai-client';
import { analyzeDashboard } from './analyze-service';
import { analysisRequestSchema } from './validate';

type Dependencies = {
  analyzeDashboard: typeof analyzeDashboard;
};

export function createApp(
  config: AppConfig,
  dependencies: Dependencies = { analyzeDashboard },
) {
  const app = express();
  const client = createOpenAiClient(config.openAiBaseUrl, config.openAiApiKey);

  app.use(cors());
  app.use(express.json({ limit: '512kb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.post('/api/analyze', async (request, response) => {
    try {
      const payload = analysisRequestSchema.parse(request.body);
      const result = await dependencies.analyzeDashboard(payload, client, config.openAiModel);
      response.json(result);
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : '分析请求失败',
      });
    }
  });

  return app;
}
```

- [ ] **Step 4: Run backend tests**

Run:

```bash
npm run test --workspace backend
```

Expected: backend test suite passes.

- [ ] **Step 5: Commit**

```bash
git add backend/src
git commit -m "feat: expose analyze api endpoint"
```

### Task 5: Add Frontend Analysis Types And API Client

**Files:**
- Create: `F:/skill/.worktrees/develop/frontend/src/domain/analysis.ts`
- Create: `F:/skill/.worktrees/develop/frontend/src/services/analysis-api.ts`
- Modify: `F:/skill/.worktrees/develop/frontend/src/components/App.test.tsx`

- [ ] **Step 1: Write the failing frontend test for manual analysis trigger**

Append this test to `F:/skill/.worktrees/develop/frontend/src/components/App.test.tsx`:

```ts
it('shows ai analysis result after manual trigger', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: '整体表现稳定。',
        platformInsights: ['小红书涨粉更强。'],
        risks: ['视频号互动偏弱。'],
        actions: ['优先优化视频号结尾引导。'],
      }),
    }),
  );

  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /开始分析/i }));

  expect(await screen.findByText(/整体表现稳定/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the frontend test to verify it fails**

Run:

```bash
npm run test --workspace frontend -- src/components/App.test.tsx
```

Expected: fail because there is no AI analysis panel.

- [ ] **Step 3: Add frontend analysis contracts**

`F:/skill/.worktrees/develop/frontend/src/domain/analysis.ts`

```ts
import type { Platform } from './types';

export type AnalysisRequest = {
  range: '7d' | '30d';
  platform: Platform | 'all';
  kpis: {
    totalAccounts: number;
    totalFollowerDelta: number;
    totalViews: number;
  };
  platforms: Array<{
    platform: Platform;
    views: number;
    followerDelta: number;
    engagementRate: number;
  }>;
  accountRanking: Array<{
    accountName: string;
    platform: Platform;
    views: number;
    followerDelta: number;
    engagementRate: number;
  }>;
  anomalies: Array<{
    accountName: string;
    message: string;
  }>;
  topContent: Array<{
    contentTitle: string;
    platform: Platform;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
};

export type AnalysisResponse = {
  summary: string;
  platformInsights: string[];
  risks: string[];
  actions: string[];
};
```

- [ ] **Step 4: Add API client**

`F:/skill/.worktrees/develop/frontend/src/services/analysis-api.ts`

```ts
import type { AnalysisRequest, AnalysisResponse } from '../domain/analysis';

export async function requestAnalysis(payload: AnalysisRequest): Promise<AnalysisResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '分析请求失败' }));
    throw new Error(error.message ?? '分析请求失败');
  }

  return response.json();
}
```

- [ ] **Step 5: Run the frontend test again**

Run:

```bash
npm run test --workspace frontend -- src/components/App.test.tsx
```

Expected: still fails, but now only because the panel and trigger UI do not exist.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/domain/analysis.ts frontend/src/services/analysis-api.ts frontend/src/components/App.test.tsx
git commit -m "test: prepare frontend ai analysis contracts"
```

### Task 6: Add AI Analysis Panel And Remove Total-Follower Messaging

**Files:**
- Create: `F:/skill/.worktrees/develop/frontend/src/components/AIAnalysisPanel.tsx`
- Modify: `F:/skill/.worktrees/develop/frontend/src/App.tsx`
- Modify: `F:/skill/.worktrees/develop/frontend/src/components/dashboard.module.css`
- Modify: `F:/skill/.worktrees/develop/frontend/src/components/App.test.tsx`

- [ ] **Step 1: Implement the AI analysis panel**

`F:/skill/.worktrees/develop/frontend/src/components/AIAnalysisPanel.tsx`

```tsx
import { useState } from 'react';
import type { AnalysisRequest, AnalysisResponse } from '../domain/analysis';
import { requestAnalysis } from '../services/analysis-api';
import styles from './dashboard.module.css';

type Props = {
  payload: AnalysisRequest;
};

export default function AIAnalysisPanel({ payload }: Props) {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    setError('');

    try {
      const next = await requestAnalysis(payload);
      setResult(next);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : '分析请求失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>AI 运营分析</h2>
          <p className={styles.panelSubtitle}>基于当前筛选结果手动生成运营判断与建议。</p>
        </div>
        <button className={styles.ghostButton} type="button" onClick={handleAnalyze} disabled={loading}>
          {loading ? '分析中...' : '开始分析'}
        </button>
      </div>
      {error ? <p className={styles.importError}>{error}</p> : null}
      {result ? (
        <div className={styles.analysisResult}>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>总体判断</span>
            <p>{result.summary}</p>
          </div>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>平台洞察</span>
            <p>{result.platformInsights.join('；')}</p>
          </div>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>风险提醒</span>
            <p>{result.risks.join('；')}</p>
          </div>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>建议动作</span>
            <p>{result.actions.join('；')}</p>
          </div>
        </div>
      ) : (
        <p className={styles.muted}>点击“开始分析”后生成当前驾驶舱分析结果。</p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Build the request payload in App and remove total-follower wording**

In `F:/skill/.worktrees/develop/frontend/src/App.tsx`:

1. Import `AIAnalysisPanel`
2. Build:

```ts
const analysisPayload = {
  range: filters.range,
  platform: filters.platform,
  kpis: {
    totalAccounts: view.kpis.totalAccounts,
    totalFollowerDelta: view.kpis.totalFollowerDelta,
    totalViews: view.kpis.totalViews,
  },
  platforms: view.platforms,
  accountRanking: view.accountRanking,
  anomalies: view.anomalies,
  topContent: view.contentRows.slice(0, 5).map((row) => ({
    contentTitle: row.contentTitle,
    platform: row.platform,
    views: row.views,
    likes: row.likes,
    comments: row.comments,
    shares: row.shares,
  })),
};
```

3. Replace hero caption:

```tsx
<span className={styles.heroStatCaption}>
  当前筛选范围内以曝光规模为主视角，重点观察涨粉变化与互动效率。
</span>
```

4. Render `<AIAnalysisPanel payload={analysisPayload} />` below the KPI grid or inside the analysis stack.

- [ ] **Step 3: Add panel styles**

Append to `F:/skill/.worktrees/develop/frontend/src/components/dashboard.module.css`:

```css
.analysisResult {
  display: grid;
  gap: 12px;
}
```

- [ ] **Step 4: Extend frontend tests for the removed follower message**

Add this assertion to the hero copy test:

```ts
expect(screen.queryByText(/总粉丝/i)).not.toBeInTheDocument();
```

- [ ] **Step 5: Run frontend tests**

Run:

```bash
npm run test --workspace frontend
```

Expected: all frontend tests pass, including manual analysis trigger.

- [ ] **Step 6: Commit**

```bash
git add frontend/src
git commit -m "feat: add ai analysis panel"
```

### Task 7: Final Integration Verification

**Files:**
- Modify: `F:/skill/.worktrees/develop/README.md`

- [ ] **Step 1: Install any new dependencies**

Run:

```bash
npm install
```

Expected: root lockfile updated with backend dependencies.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm run test
```

Expected: frontend and backend tests both pass.

- [ ] **Step 3: Run full build**

Run:

```bash
npm run build
```

Expected: frontend and backend build successfully.

- [ ] **Step 4: Smoke-test backend health endpoint**

Run:

```bash
npm run dev:backend
```

Then request:

```bash
curl http://localhost:8787/api/health
```

Expected:

```json
{"ok":true}
```

- [ ] **Step 5: Smoke-test manual analysis from frontend**

Run:

```bash
npm run dev:frontend
```

Manual check:

- Open dashboard
- Click `开始分析`
- Confirm loading state
- Confirm result or Chinese error message appears

- [ ] **Step 6: Commit**

```bash
git add README.md package-lock.json
git commit -m "docs: finalize ai analysis workflow"
```

## Self-Review

- Spec coverage:
  - Same-repo frontend/backend split: Task 1
  - Backend service and env vars: Task 2
  - OpenAI-compatible analyze flow: Tasks 3-4
  - Frontend display-only AI analysis: Tasks 5-6
  - Remove total-follower messaging: Task 6
  - Testing and docs: Task 7
- Placeholder scan: no `TODO`, `TBD`, or unbound “handle later” instructions remain.
- Type consistency: request and response types are defined once in backend and once in frontend with matching property names.
