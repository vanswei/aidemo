import type { DashboardRecord } from '../domain/types';

export const rawCsvRows = [
  {
    platform: 'xiaohongshu',
    account: 'Travel Lab',
    title: 'Shanghai coffee map',
    publishDate: '2026-03-10',
    contentType: 'note',
    followers: '12000',
    followerDelta: '320',
    views: '8800',
    likes: '760',
    favorites: '240',
    comments: '90',
    shares: '35',
  },
  {
    platform: 'wechat-channel',
    account: 'City Frames',
    title: 'Night run route',
    publishDate: '2026-03-12',
    contentType: 'video',
    followers: '9500',
    followerDelta: '180',
    views: '15200',
    likes: '420',
    favorites: '0',
    comments: '46',
    shares: '88',
  },
];

export const rawDuplicateRows = [
  rawCsvRows[0],
  {
    ...rawCsvRows[0],
  },
];

export const normalizedRecords: DashboardRecord[] = [
  {
    platform: 'xiaohongshu',
    accountName: 'Travel Lab',
    contentTitle: 'Shanghai coffee map',
    publishDate: '2026-03-10',
    contentType: 'note',
    followers: 12000,
    followerDelta: 320,
    views: 8800,
    likes: 760,
    favorites: 240,
    comments: 90,
    shares: 35,
  },
  {
    platform: 'wechat-channel',
    accountName: 'City Frames',
    contentTitle: 'Night run route',
    publishDate: '2026-03-12',
    contentType: 'video',
    followers: 9500,
    followerDelta: 180,
    views: 15200,
    likes: 420,
    favorites: 0,
    comments: 46,
    shares: 88,
  },
];
