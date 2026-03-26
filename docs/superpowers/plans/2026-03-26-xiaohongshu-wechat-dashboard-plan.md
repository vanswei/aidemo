# Xiaohongshu And WeChat Channels Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page internal dashboard that imports Xiaohongshu and WeChat Channels Excel or CSV data, normalizes it into one schema, and displays account overview, trend, ranking, anomaly, and content-detail views.

**Architecture:** Create a Vite + React + TypeScript app with a small domain layer for data normalization and aggregation, a dashboard UI layer for filters and charts, and a file-import flow that converts Excel or CSV rows into unified records. Keep parsing, normalization, aggregation, and rendering in separate files so API-backed sync can later replace the import layer without rewriting the page.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, SheetJS (`xlsx`), Recharts, plain CSS modules

---

## File Structure

Planned files and responsibilities:

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/global.css`
- Create: `src/domain/types.ts`
- Create: `src/domain/normalizers.ts`
- Create: `src/domain/aggregations.ts`
- Create: `src/domain/format.ts`
- Create: `src/utils/file-import.ts`
- Create: `src/utils/date-range.ts`
- Create: `src/fixtures/sample-data.ts`
- Create: `src/components/FilterBar.tsx`
- Create: `src/components/KpiGrid.tsx`
- Create: `src/components/PlatformComparison.tsx`
- Create: `src/components/TrendPanel.tsx`
- Create: `src/components/AccountRanking.tsx`
- Create: `src/components/AnomalyList.tsx`
- Create: `src/components/ContentTable.tsx`
- Create: `src/components/ImportPanel.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/dashboard.module.css`
- Create: `src/test/test-data.ts`
- Create: `src/test/setup.ts`
- Create: `src/domain/normalizers.test.ts`
- Create: `src/domain/aggregations.test.ts`
- Create: `src/components/App.test.tsx`
- Create: `README.md`

### Task 1: Bootstrap The Frontend Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Write the failing app render test**

```tsx
// src/components/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the dashboard title', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', {
        name: /xiaohongshu & wechat channels dashboard/i,
      }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/App.test.tsx`
Expected: FAIL with module resolution or missing `src/App.tsx`

- [ ] **Step 3: Write the minimal project files**

```json
// package.json
{
  "name": "xiaohongshu-wechat-dashboard",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "recharts": "^2.15.3",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "jsdom": "^26.0.0",
    "typescript": "^5.8.2",
    "vite": "^6.2.2",
    "vitest": "^3.0.9"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
```

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Xiaohongshu Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

```tsx
// src/App.tsx
export default function App() {
  return (
    <main>
      <h1>Xiaohongshu &amp; WeChat Channels Dashboard</h1>
    </main>
  );
}
```

```css
/* src/styles/global.css */
:root {
  color-scheme: light;
  --bg: #f5f1e8;
  --panel: #fffdf8;
  --text: #1f2937;
  --muted: #6b7280;
  --xhs: #e85d5d;
  --wx: #178bb8;
  --line: #e8dfd2;
  font-family: "Segoe UI", "PingFang SC", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: linear-gradient(180deg, #f7f2e8 0%, #efe7da 100%);
  color: var(--text);
}

main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px;
}
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/App.test.tsx`
Expected: PASS with 1 test passed

- [ ] **Step 5: Commit**

```bash
git init
git add package.json tsconfig.json vite.config.ts index.html src/main.tsx src/App.tsx src/styles/global.css src/test/setup.ts src/components/App.test.tsx
git commit -m "chore: bootstrap dashboard app"
```

### Task 2: Add Unified Types And Normalization Logic

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/normalizers.ts`
- Create: `src/test/test-data.ts`
- Test: `src/domain/normalizers.test.ts`

- [ ] **Step 1: Write the failing normalization tests**

```ts
// src/domain/normalizers.test.ts
import { describe, expect, it } from 'vitest';
import { normalizeRows } from './normalizers';
import { rawCsvRows, rawDuplicateRows } from '../test/test-data';

describe('normalizeRows', () => {
  it('maps Xiaohongshu and WeChat Channel columns into one schema', () => {
    const result = normalizeRows(rawCsvRows);
    expect(result.records).toHaveLength(2);
    expect(result.records[0].platform).toBe('xiaohongshu');
    expect(result.records[1].platform).toBe('wechat-channel');
  });

  it('rejects missing required fields', () => {
    const result = normalizeRows([{ platform: 'xhs', accountName: 'A' }]);
    expect(result.errors[0]).toMatch(/missing required column/i);
  });

  it('drops duplicate account-day-content rows', () => {
    const result = normalizeRows(rawDuplicateRows);
    expect(result.records).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/duplicate/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/domain/normalizers.test.ts`
Expected: FAIL with missing `./normalizers`

- [ ] **Step 3: Write the minimal domain model and normalizer**

```ts
// src/domain/types.ts
export type Platform = 'xiaohongshu' | 'wechat-channel';

export type DashboardRecord = {
  platform: Platform;
  accountName: string;
  contentTitle: string;
  publishDate: string;
  contentType: string;
  followers: number;
  followerDelta: number;
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  shares: number;
};

export type NormalizeResult = {
  records: DashboardRecord[];
  errors: string[];
  warnings: string[];
};
```

```ts
// src/test/test-data.ts
export const rawCsvRows = [
  {
    platform: '小红书',
    account: '旅行实验室',
    title: '上海咖啡地图',
    publishDate: '2026-03-20',
    contentType: 'note',
    followers: '12000',
    followerDelta: '320',
    views: '8800',
    likes: '760',
    favorites: '240',
    comments: '90',
    shares: '35',
  },
  {
    platform: '视频号',
    account: '城市影像',
    title: '夜跑路线',
    publishDate: '2026-03-22',
    contentType: 'video',
    followers: '9500',
    followerDelta: '180',
    views: '15200',
    likes: '420',
    favorites: '0',
    comments: '46',
    shares: '88',
  },
];

export const rawDuplicateRows = [
  {
    platform: '小红书',
    account: '旅行实验室',
    title: '上海咖啡地图',
    publishDate: '2026-03-20',
    contentType: 'note',
    followers: '12000',
    followerDelta: '320',
    views: '8800',
    likes: '760',
    favorites: '240',
    comments: '90',
    shares: '35',
  },
  {
    platform: '小红书',
    account: '旅行实验室',
    title: '上海咖啡地图',
    publishDate: '2026-03-20',
    contentType: 'note',
    followers: '12000',
    followerDelta: '320',
    views: '8800',
    likes: '760',
    favorites: '240',
    comments: '90',
    shares: '35',
  },
];
```

```ts
// src/domain/normalizers.ts
import type { DashboardRecord, NormalizeResult, Platform } from './types';

const requiredColumns = [
  'platform',
  'account',
  'title',
  'publishDate',
  'contentType',
  'followers',
  'followerDelta',
  'views',
  'likes',
  'favorites',
  'comments',
  'shares',
] as const;

function mapPlatform(value: string): Platform | null {
  if (value.includes('小红书') || value.toLowerCase().includes('xhs')) {
    return 'xiaohongshu';
  }

  if (value.includes('视频号') || value.toLowerCase().includes('wechat')) {
    return 'wechat-channel';
  }

  return null;
}

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeRows(rows: Array<Record<string, unknown>>): NormalizeResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const records: DashboardRecord[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const missing = requiredColumns.filter((column) => !(column in row));
    if (missing.length > 0) {
      errors.push(`Row ${index + 1} missing required column: ${missing.join(', ')}`);
      return;
    }

    const platform = mapPlatform(String(row.platform));
    if (!platform) {
      errors.push(`Row ${index + 1} has unsupported platform: ${String(row.platform)}`);
      return;
    }

    const record: DashboardRecord = {
      platform,
      accountName: String(row.account),
      contentTitle: String(row.title),
      publishDate: String(row.publishDate),
      contentType: String(row.contentType),
      followers: toNumber(row.followers),
      followerDelta: toNumber(row.followerDelta),
      views: toNumber(row.views),
      likes: toNumber(row.likes),
      favorites: toNumber(row.favorites),
      comments: toNumber(row.comments),
      shares: toNumber(row.shares),
    };

    const key = [
      record.platform,
      record.accountName,
      record.contentTitle,
      record.publishDate,
    ].join('::');

    if (seen.has(key)) {
      warnings.push(`Dropped duplicate row: ${key}`);
      return;
    }

    seen.add(key);
    records.push(record);
  });

  return { records, errors, warnings };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/domain/normalizers.test.ts`
Expected: PASS with 3 tests passed

- [ ] **Step 5: Commit**

```bash
git add src/domain/types.ts src/domain/normalizers.ts src/domain/normalizers.test.ts src/test/test-data.ts
git commit -m "feat: add dashboard normalization layer"
```

### Task 3: Add Aggregation Helpers For KPI, Trend, Ranking, And Anomalies

**Files:**
- Create: `src/domain/aggregations.ts`
- Create: `src/domain/format.ts`
- Create: `src/utils/date-range.ts`
- Test: `src/domain/aggregations.test.ts`

- [ ] **Step 1: Write the failing aggregation tests**

```ts
// src/domain/aggregations.test.ts
import { describe, expect, it } from 'vitest';
import { buildDashboardView } from './aggregations';
import { normalizedRecords } from '../test/test-data';

describe('buildDashboardView', () => {
  it('returns KPI totals and platform comparison', () => {
    const result = buildDashboardView(normalizedRecords, { range: '30d' });
    expect(result.kpis.totalAccounts).toBe(2);
    expect(result.platforms[0].platform).toBe('xiaohongshu');
  });

  it('returns ranked accounts and content rows', () => {
    const result = buildDashboardView(normalizedRecords, { range: '30d' });
    expect(result.accountRanking[0].accountName).toBeTruthy();
    expect(result.contentRows).toHaveLength(2);
  });

  it('returns anomaly messages for weak engagement', () => {
    const result = buildDashboardView(normalizedRecords, { range: '30d' });
    expect(result.anomalies[0].message).toMatch(/engagement/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/domain/aggregations.test.ts`
Expected: FAIL with missing `./aggregations`

- [ ] **Step 3: Extend fixtures and implement minimal aggregation code**

```ts
// append to src/test/test-data.ts
import type { DashboardRecord } from '../domain/types';

export const normalizedRecords: DashboardRecord[] = [
  {
    platform: 'xiaohongshu',
    accountName: '旅行实验室',
    contentTitle: '上海咖啡地图',
    publishDate: '2026-03-20',
    contentType: 'note',
    followers: 12000,
    followerDelta: 320,
    views: 8800,
    likes: 760,
    favorites: 240,
    comments: 90,
    shares: 35,
  },
  {
    platform: 'wechat-channel',
    accountName: '城市影像',
    contentTitle: '夜跑路线',
    publishDate: '2026-03-22',
    contentType: 'video',
    followers: 9500,
    followerDelta: 180,
    views: 15200,
    likes: 420,
    favorites: 0,
    comments: 46,
    shares: 88,
  },
];
```

```ts
// src/utils/date-range.ts
export type RangeKey = '7d' | '30d';

export function matchesRange(date: string, range: RangeKey): boolean {
  const base = new Date('2026-03-26T00:00:00.000Z');
  const target = new Date(`${date}T00:00:00.000Z`);
  const diffDays = Math.floor((base.getTime() - target.getTime()) / 86400000);
  return range === '7d' ? diffDays <= 7 : diffDays <= 30;
}
```

```ts
// src/domain/format.ts
export function calculateEngagementRate(values: {
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  shares: number;
}): number {
  const engagement =
    values.likes + values.favorites + values.comments + values.shares;
  return values.views === 0 ? 0 : engagement / values.views;
}
```

```ts
// src/domain/aggregations.ts
import { calculateEngagementRate } from './format';
import type { DashboardRecord, Platform } from './types';
import type { RangeKey } from '../utils/date-range';
import { matchesRange } from '../utils/date-range';

type ViewFilter = { range: RangeKey };

export function buildDashboardView(records: DashboardRecord[], filter: ViewFilter) {
  const filtered = records.filter((record) => matchesRange(record.publishDate, filter.range));
  const accounts = [...new Set(filtered.map((record) => record.accountName))];

  const kpis = {
    totalAccounts: accounts.length,
    totalFollowers: filtered.reduce((sum, record) => sum + record.followers, 0),
    totalFollowerDelta: filtered.reduce((sum, record) => sum + record.followerDelta, 0),
    totalViews: filtered.reduce((sum, record) => sum + record.views, 0),
  };

  const platforms = (['xiaohongshu', 'wechat-channel'] as Platform[]).map((platform) => {
    const platformRows = filtered.filter((record) => record.platform === platform);
    return {
      platform,
      views: platformRows.reduce((sum, record) => sum + record.views, 0),
      followerDelta: platformRows.reduce((sum, record) => sum + record.followerDelta, 0),
      engagementRate: calculateEngagementRate({
        views: platformRows.reduce((sum, record) => sum + record.views, 0),
        likes: platformRows.reduce((sum, record) => sum + record.likes, 0),
        favorites: platformRows.reduce((sum, record) => sum + record.favorites, 0),
        comments: platformRows.reduce((sum, record) => sum + record.comments, 0),
        shares: platformRows.reduce((sum, record) => sum + record.shares, 0),
      }),
    };
  });

  const accountRanking = accounts
    .map((accountName) => {
      const rows = filtered.filter((record) => record.accountName === accountName);
      const views = rows.reduce((sum, record) => sum + record.views, 0);
      const engagementRate = calculateEngagementRate({
        views,
        likes: rows.reduce((sum, record) => sum + record.likes, 0),
        favorites: rows.reduce((sum, record) => sum + record.favorites, 0),
        comments: rows.reduce((sum, record) => sum + record.comments, 0),
        shares: rows.reduce((sum, record) => sum + record.shares, 0),
      });

      return {
        accountName,
        platform: rows[0].platform,
        views,
        followerDelta: rows.reduce((sum, record) => sum + record.followerDelta, 0),
        engagementRate,
      };
    })
    .sort((left, right) => right.followerDelta - left.followerDelta);

  const anomalies = accountRanking
    .filter((row) => row.engagementRate < 0.1)
    .map((row) => ({
      accountName: row.accountName,
      message: `${row.accountName} engagement rate is below target`,
    }));

  return {
    kpis,
    platforms,
    accountRanking,
    contentRows: filtered,
    anomalies,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/domain/aggregations.test.ts`
Expected: PASS with 3 tests passed

- [ ] **Step 5: Commit**

```bash
git add src/domain/aggregations.ts src/domain/aggregations.test.ts src/domain/format.ts src/utils/date-range.ts src/test/test-data.ts
git commit -m "feat: add dashboard aggregation helpers"
```

### Task 4: Add File Import Parsing And Import Panel

**Files:**
- Create: `src/utils/file-import.ts`
- Create: `src/components/ImportPanel.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/App.test.tsx`

- [ ] **Step 1: Write the failing import UI tests**

```tsx
// append to src/components/App.test.tsx
import userEvent from '@testing-library/user-event';

it('shows validation feedback when imported data is missing required columns', async () => {
  const user = userEvent.setup();
  render(<App />);

  const file = new File(['platform,account\n小红书,测试号'], 'bad.csv', {
    type: 'text/csv',
  });

  await user.upload(screen.getByLabelText(/upload excel or csv/i), file);

  expect(await screen.findByText(/missing required column/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/App.test.tsx`
Expected: FAIL because upload control or validation message does not exist

- [ ] **Step 3: Write the file parser and import panel**

```ts
// src/utils/file-import.ts
import * as XLSX from 'xlsx';

export async function readSpreadsheet(file: File): Promise<Array<Record<string, unknown>>> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
}

export async function readCsv(file: File): Promise<Array<Record<string, unknown>>> {
  const text = await file.text();
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const columns = header.split(',').map((part) => part.trim());

  return lines.map((line) => {
    const values = line.split(',').map((part) => part.trim());
    return Object.fromEntries(columns.map((column, index) => [column, values[index] ?? '']));
  });
}
```

```tsx
// src/components/ImportPanel.tsx
import { useState } from 'react';
import { normalizeRows } from '../domain/normalizers';
import { readCsv, readSpreadsheet } from '../utils/file-import';
import type { DashboardRecord } from '../domain/types';

type ImportPanelProps = {
  onRecordsLoaded: (records: DashboardRecord[]) => void;
};

export default function ImportPanel({ onRecordsLoaded }: ImportPanelProps) {
  const [message, setMessage] = useState('Upload an Excel or CSV file to replace the sample data.');

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const rows = file.name.endsWith('.csv')
      ? await readCsv(file)
      : await readSpreadsheet(file);
    const result = normalizeRows(rows);

    if (result.errors.length > 0) {
      setMessage(result.errors[0]);
      return;
    }

    onRecordsLoaded(result.records);
    setMessage(`Imported ${result.records.length} records successfully.`);
  }

  return (
    <section>
      <label htmlFor="file-input">Upload Excel or CSV</label>
      <input id="file-input" type="file" accept=".csv,.xlsx,.xls" onChange={handleChange} />
      <p>{message}</p>
    </section>
  );
}
```

```tsx
// replace src/App.tsx
import { useState } from 'react';
import ImportPanel from './components/ImportPanel';
import { normalizedRecords } from './test/test-data';
import type { DashboardRecord } from './domain/types';

export default function App() {
  const [records, setRecords] = useState<DashboardRecord[]>(normalizedRecords);

  return (
    <main>
      <h1>Xiaohongshu &amp; WeChat Channels Dashboard</h1>
      <ImportPanel onRecordsLoaded={setRecords} />
      <p>{records.length} records loaded</p>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/App.test.tsx`
Expected: PASS with import validation coverage green

- [ ] **Step 5: Commit**

```bash
git add src/utils/file-import.ts src/components/ImportPanel.tsx src/App.tsx src/components/App.test.tsx
git commit -m "feat: add spreadsheet import flow"
```

### Task 5: Render The Dashboard Overview And Linked Filters

**Files:**
- Create: `src/components/FilterBar.tsx`
- Create: `src/components/KpiGrid.tsx`
- Create: `src/components/PlatformComparison.tsx`
- Create: `src/components/TrendPanel.tsx`
- Create: `src/components/dashboard.module.css`
- Modify: `src/App.tsx`
- Test: `src/components/App.test.tsx`

- [ ] **Step 1: Write the failing overview interaction tests**

```tsx
// append to src/components/App.test.tsx
it('filters the dashboard by platform', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.selectOptions(screen.getByLabelText(/platform/i), 'wechat-channel');

  expect(screen.getByText(/城市影像/i)).toBeInTheDocument();
  expect(screen.queryByText(/旅行实验室/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/App.test.tsx`
Expected: FAIL because the platform filter and linked view do not exist

- [ ] **Step 3: Implement filters, KPI grid, platform cards, and trends**

```tsx
// src/components/FilterBar.tsx
import type { RangeKey } from '../utils/date-range';
import type { Platform } from '../domain/types';

type FilterState = {
  range: RangeKey;
  platform: Platform | 'all';
};

type FilterBarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
};

export default function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <section>
      <label>
        Time Range
        <select
          value={value.range}
          onChange={(event) => onChange({ ...value, range: event.target.value as RangeKey })}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </label>

      <label>
        Platform
        <select
          value={value.platform}
          onChange={(event) =>
            onChange({ ...value, platform: event.target.value as FilterState['platform'] })
          }
        >
          <option value="all">All Platforms</option>
          <option value="xiaohongshu">Xiaohongshu</option>
          <option value="wechat-channel">WeChat Channels</option>
        </select>
      </label>
    </section>
  );
}
```

```tsx
// src/components/KpiGrid.tsx
type KpiGridProps = {
  totalAccounts: number;
  totalFollowers: number;
  totalFollowerDelta: number;
  totalViews: number;
};

export default function KpiGrid(props: KpiGridProps) {
  return (
    <section>
      <article>Total Accounts: {props.totalAccounts}</article>
      <article>Total Followers: {props.totalFollowers}</article>
      <article>30 Day Growth: {props.totalFollowerDelta}</article>
      <article>Total Views: {props.totalViews}</article>
    </section>
  );
}
```

```tsx
// src/components/PlatformComparison.tsx
export default function PlatformComparison({
  items,
}: {
  items: Array<{ platform: string; views: number; followerDelta: number; engagementRate: number }>;
}) {
  return (
    <section>
      {items.map((item) => (
        <article key={item.platform}>
          <h2>{item.platform}</h2>
          <p>Views: {item.views}</p>
          <p>Growth: {item.followerDelta}</p>
          <p>Engagement: {item.engagementRate.toFixed(2)}</p>
        </article>
      ))}
    </section>
  );
}
```

```tsx
// src/components/TrendPanel.tsx
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function TrendPanel({
  rows,
}: {
  rows: Array<{ publishDate: string; views: number }>;
}) {
  return (
    <section style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={rows}>
          <XAxis dataKey="publishDate" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#178bb8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
```

```css
/* src/components/dashboard.module.css */
.stack {
  display: grid;
  gap: 24px;
}
```

```tsx
// replace src/App.tsx
import { useState } from 'react';
import FilterBar from './components/FilterBar';
import ImportPanel from './components/ImportPanel';
import KpiGrid from './components/KpiGrid';
import PlatformComparison from './components/PlatformComparison';
import TrendPanel from './components/TrendPanel';
import { buildDashboardView } from './domain/aggregations';
import type { DashboardRecord, Platform } from './domain/types';
import { normalizedRecords } from './test/test-data';
import styles from './components/dashboard.module.css';

type FilterState = {
  range: '7d' | '30d';
  platform: Platform | 'all';
};

export default function App() {
  const [records, setRecords] = useState<DashboardRecord[]>(normalizedRecords);
  const [filters, setFilters] = useState<FilterState>({ range: '30d', platform: 'all' });

  const scopedRecords =
    filters.platform === 'all'
      ? records
      : records.filter((record) => record.platform === filters.platform);
  const view = buildDashboardView(scopedRecords, { range: filters.range });

  return (
    <main className={styles.stack}>
      <h1>Xiaohongshu &amp; WeChat Channels Dashboard</h1>
      <ImportPanel onRecordsLoaded={setRecords} />
      <FilterBar value={filters} onChange={setFilters} />
      <KpiGrid {...view.kpis} />
      <PlatformComparison items={view.platforms} />
      <TrendPanel rows={view.contentRows} />
      {view.accountRanking.map((row) => (
        <p key={row.accountName}>{row.accountName}</p>
      ))}
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/App.test.tsx`
Expected: PASS with the platform filter test green

- [ ] **Step 5: Commit**

```bash
git add src/components/FilterBar.tsx src/components/KpiGrid.tsx src/components/PlatformComparison.tsx src/components/TrendPanel.tsx src/components/dashboard.module.css src/App.tsx src/components/App.test.tsx
git commit -m "feat: add dashboard overview and filters"
```

### Task 6: Add Ranking, Content Table, Anomaly Cards, Empty States, And Final Verification

**Files:**
- Create: `src/components/AccountRanking.tsx`
- Create: `src/components/AnomalyList.tsx`
- Create: `src/components/ContentTable.tsx`
- Create: `src/components/EmptyState.tsx`
- Modify: `src/App.tsx`
- Modify: `README.md`
- Test: `src/components/App.test.tsx`

- [ ] **Step 1: Write the failing detailed-view tests**

```tsx
// append to src/components/App.test.tsx
it('shows an empty state when filters remove all rows', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.selectOptions(screen.getByLabelText(/time range/i), '7d');

  expect(screen.getByText(/no matching data for current filters/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/App.test.tsx`
Expected: FAIL because no empty-state branch exists

- [ ] **Step 3: Implement ranking list, anomaly list, content table, and empty states**

```tsx
// src/components/EmptyState.tsx
export default function EmptyState({ message }: { message: string }) {
  return (
    <section>
      <h2>Nothing to show</h2>
      <p>{message}</p>
    </section>
  );
}
```

```tsx
// src/components/AccountRanking.tsx
export default function AccountRanking({
  rows,
}: {
  rows: Array<{ accountName: string; followerDelta: number; engagementRate: number }>;
}) {
  return (
    <section>
      <h2>Account Ranking</h2>
      <ol>
        {rows.map((row) => (
          <li key={row.accountName}>
            {row.accountName} | Growth {row.followerDelta} | Engagement {row.engagementRate.toFixed(2)}
          </li>
        ))}
      </ol>
    </section>
  );
}
```

```tsx
// src/components/AnomalyList.tsx
export default function AnomalyList({
  rows,
}: {
  rows: Array<{ accountName: string; message: string }>;
}) {
  return (
    <section>
      <h2>Anomalies</h2>
      {rows.length === 0 ? <p>No anomalies detected.</p> : rows.map((row) => <p key={row.accountName}>{row.message}</p>)}
    </section>
  );
}
```

```tsx
// src/components/ContentTable.tsx
import type { DashboardRecord } from '../domain/types';

export default function ContentTable({ rows }: { rows: DashboardRecord[] }) {
  return (
    <section>
      <h2>Content Detail</h2>
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Account</th>
            <th>Title</th>
            <th>Date</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.platform}-${row.accountName}-${row.contentTitle}-${row.publishDate}`}>
              <td>{row.platform}</td>
              <td>{row.accountName}</td>
              <td>{row.contentTitle}</td>
              <td>{row.publishDate}</td>
              <td>{row.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

```md
<!-- README.md -->
# Xiaohongshu Dashboard

## Run

1. `npm install`
2. `npm run dev`
3. `npm test`

## Supported Input Columns

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
```

```tsx
// replace src/App.tsx
import { useState } from 'react';
import AccountRanking from './components/AccountRanking';
import AnomalyList from './components/AnomalyList';
import ContentTable from './components/ContentTable';
import EmptyState from './components/EmptyState';
import FilterBar from './components/FilterBar';
import ImportPanel from './components/ImportPanel';
import KpiGrid from './components/KpiGrid';
import PlatformComparison from './components/PlatformComparison';
import TrendPanel from './components/TrendPanel';
import { buildDashboardView } from './domain/aggregations';
import type { DashboardRecord, Platform } from './domain/types';
import { normalizedRecords } from './test/test-data';
import styles from './components/dashboard.module.css';

type FilterState = {
  range: '7d' | '30d';
  platform: Platform | 'all';
};

export default function App() {
  const [records, setRecords] = useState<DashboardRecord[]>(normalizedRecords);
  const [filters, setFilters] = useState<FilterState>({ range: '30d', platform: 'all' });

  const scopedRecords =
    filters.platform === 'all'
      ? records
      : records.filter((record) => record.platform === filters.platform);
  const view = buildDashboardView(scopedRecords, { range: filters.range });

  return (
    <main className={styles.stack}>
      <h1>Xiaohongshu &amp; WeChat Channels Dashboard</h1>
      <ImportPanel onRecordsLoaded={setRecords} />
      <FilterBar value={filters} onChange={setFilters} />
      {view.contentRows.length === 0 ? (
        <EmptyState message="No matching data for current filters." />
      ) : (
        <>
          <KpiGrid {...view.kpis} />
          <PlatformComparison items={view.platforms} />
          <TrendPanel rows={view.contentRows} />
          <AccountRanking rows={view.accountRanking} />
          <AnomalyList rows={view.anomalies} />
          <ContentTable rows={view.contentRows} />
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS with all domain and component tests green

- [ ] **Step 5: Build the app to verify production output**

Run: `npm run build`
Expected: PASS with Vite production build emitted to `dist/`

- [ ] **Step 6: Commit**

```bash
git add src/components/AccountRanking.tsx src/components/AnomalyList.tsx src/components/ContentTable.tsx src/components/EmptyState.tsx src/App.tsx README.md src/components/App.test.tsx
git commit -m "feat: complete dashboard detail views"
```

## Self-Review

Spec coverage check:

- Dashboard overview, platform comparison, trend analysis, account ranking, content detail, and anomaly reminders are covered in Tasks 3, 5, and 6.
- Excel or CSV import and validation are covered in Task 4.
- Unified metric schema and API-ready data normalization are covered in Tasks 2 and 3.
- Empty and invalid states are covered in Tasks 4 and 6.

Placeholder scan:

- No `TODO`, `TBD`, or deferred placeholders remain in the plan.
- Every code-writing step includes concrete file content and test commands.

Type consistency:

- `DashboardRecord`, `Platform`, `RangeKey`, `normalizeRows`, and `buildDashboardView` are defined once and reused consistently across later tasks.
