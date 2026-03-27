import { describe, expect, it } from 'vitest';
import { normalizeRows } from './normalizers';
import { rawCsvRows, rawDuplicateRows } from '../test/test-data';
import { xiaohongshuWorkbookSheets } from '../test/import-fixtures';
import { normalizeWorkbookSheets } from './normalizers';

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

  it('normalizes 视频号每日数据 CSV rows into dashboard records', () => {
    const result = normalizeRows([
      {
        时间: '2026/03/26',
        播放: '8655',
        推荐: '93',
        喜欢: '134',
        评论: '5',
        分享: '37',
        关注: '2',
      },
    ]);

    expect(result.errors).toHaveLength(0);
    expect(result.records).toHaveLength(1);
    expect(result.records[0]).toMatchObject({
      platform: 'wechat-channel',
      accountName: '视频号',
      publishDate: '2026-03-26',
      views: 8655,
      likes: 134,
      comments: 5,
      shares: 37,
      followerDelta: 2,
    });
  });

  it('normalizes 小红书多 sheet 趋势表 into dashboard records', () => {
    const result = normalizeWorkbookSheets(xiaohongshuWorkbookSheets, '近7日观看数据（小红书）.xlsx');

    expect(result.errors).toHaveLength(0);
    expect(result.records).toHaveLength(2);
    expect(result.records[0]).toMatchObject({
      platform: 'xiaohongshu',
      accountName: '小红书',
      publishDate: '2026-03-26',
      views: 5021,
    });
    expect(result.records[0].contentTitle).toMatch(/日度趋势/);
  });
});
