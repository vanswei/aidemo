import { describe, expect, it, vi } from 'vitest';
import { analyzeDashboard } from './analyze-service.js';
import type { AnalysisRequest } from './types.js';

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

  it('coerces summary arrays into a single summary string', async () => {
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
              summary: ['整体增长稳定，但视频号互动偏弱。'],
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

    expect(result.summary).toBe('整体增长稳定，但视频号互动偏弱。');
  });
});
