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
