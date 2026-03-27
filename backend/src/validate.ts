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
