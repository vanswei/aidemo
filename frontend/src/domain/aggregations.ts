import type { RangeKey } from '../utils/date-range';
import { matchesRange } from '../utils/date-range';
import { calculateEngagementRate } from './format';
import type { DashboardRecord, Platform } from './types';

type ViewFilter = {
  range: RangeKey;
};

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

      return {
        accountName,
        platform: rows[0].platform,
        views,
        followerDelta: rows.reduce((sum, record) => sum + record.followerDelta, 0),
        engagementRate: calculateEngagementRate({
          views,
          likes: rows.reduce((sum, record) => sum + record.likes, 0),
          favorites: rows.reduce((sum, record) => sum + record.favorites, 0),
          comments: rows.reduce((sum, record) => sum + record.comments, 0),
          shares: rows.reduce((sum, record) => sum + record.shares, 0),
        }),
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
