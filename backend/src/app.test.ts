import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

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
});
