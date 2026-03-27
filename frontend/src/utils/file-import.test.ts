import { describe, expect, it } from 'vitest';
import { parseCsvText } from './file-import';
import { wechatDailyCsvSample } from '../test/import-fixtures';

describe('parseCsvText', () => {
  it('skips preamble rows and uses the actual header row in 视频号 CSV', () => {
    const rows = parseCsvText(wechatDailyCsvSample);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      时间: '2026/03/26',
      播放: '8655',
      喜欢: '134',
      关注: '2',
    });
  });
});
