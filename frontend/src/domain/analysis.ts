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
