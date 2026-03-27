export type PlatformKey = 'xiaohongshu' | 'wechat-channel';

export type AnalysisRequest = {
  range: '7d' | '30d';
  platform: 'all' | PlatformKey;
  kpis: {
    totalAccounts: number;
    totalFollowerDelta: number;
    totalViews: number;
  };
  platforms: Array<{
    platform: PlatformKey;
    views: number;
    followerDelta: number;
    engagementRate: number;
  }>;
  accountRanking: Array<{
    accountName: string;
    platform: PlatformKey;
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
    platform: PlatformKey;
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
