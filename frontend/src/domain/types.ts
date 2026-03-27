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
