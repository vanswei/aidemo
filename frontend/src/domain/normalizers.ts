import type { DashboardRecord, NormalizeResult, Platform } from './types';
import type { SheetRowsMap } from '../utils/file-import';

const requiredColumns = [
  'platform',
  'account',
  'title',
  'publishDate',
  'contentType',
  'followers',
  'followerDelta',
  'views',
  'likes',
  'favorites',
  'comments',
  'shares',
] as const;

function mapPlatform(value: string): Platform | null {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes('xiaohongshu') || normalized.includes('xhs')) {
    return 'xiaohongshu';
  }

  if (normalized.includes('wechat') || normalized.includes('channel')) {
    return 'wechat-channel';
  }

  return null;
}

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeDate(value: string): string {
  const trimmed = value.trim();
  const slashMatch = trimmed.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (slashMatch) {
    return `${slashMatch[1]}-${slashMatch[2]}-${slashMatch[3]}`;
  }

  const cnMatch = trimmed.match(/^(\d{4})年(\d{2})月(\d{2})日$/);
  if (cnMatch) {
    return `${cnMatch[1]}-${cnMatch[2]}-${cnMatch[3]}`;
  }

  return trimmed;
}

function dedupeRecords(records: DashboardRecord[], warnings: string[]) {
  const seen = new Set<string>();

  return records.filter((record) => {
    const key = [
      record.platform,
      record.accountName,
      record.contentTitle,
      record.publishDate,
    ].join('::');

    if (seen.has(key)) {
      warnings.push(`Dropped duplicate row: ${key}`);
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isWechatDailyRows(rows: Array<Record<string, unknown>>): boolean {
  return rows.length > 0 && rows.every((row) => '时间' in row && '播放' in row);
}

function normalizeWechatDailyRows(rows: Array<Record<string, unknown>>): NormalizeResult {
  const warnings: string[] = [];
  const records = dedupeRecords(
    rows.map((row) => {
      const publishDate = normalizeDate(String(row.时间 ?? ''));

      return {
        platform: 'wechat-channel' as const,
        accountName: '视频号',
        contentTitle: `视频号日度趋势 ${publishDate}`,
        publishDate,
        contentType: 'daily-summary',
        followers: 0,
        followerDelta: toNumber(row.关注),
        views: toNumber(row.播放),
        likes: toNumber(row.喜欢),
        favorites: 0,
        comments: toNumber(row.评论),
        shares: toNumber(row.分享),
      };
    }),
    warnings,
  );

  return { records, errors: [], warnings };
}

function inferAccountName(fileName: string, fallback: string): string {
  const normalized = fileName.replace(/\.[^.]+$/, '');
  if (normalized.includes('小红书')) {
    return '小红书';
  }

  if (normalized.includes('视频号')) {
    return '视频号';
  }

  return fallback;
}

export function normalizeWorkbookSheets(
  sheets: SheetRowsMap,
  fileName = '',
): NormalizeResult {
  const trendRows = sheets['观看趋势'];

  if (!trendRows || trendRows.length === 0) {
    return {
      records: [],
      errors: ['未识别到可导入的趋势数据工作表'],
      warnings: [],
    };
  }

  const accountName = inferAccountName(fileName, '小红书账号');
  const records = trendRows.map((row) => {
    const publishDate = normalizeDate(String(row.日期 ?? ''));

    return {
      platform: 'xiaohongshu' as const,
      accountName,
      contentTitle: `小红书日度趋势 ${publishDate}`,
      publishDate,
      contentType: 'daily-summary',
      followers: 0,
      followerDelta: 0,
      views: toNumber(row.数值),
      likes: 0,
      favorites: 0,
      comments: 0,
      shares: 0,
    };
  });

  return {
    records,
    errors: [],
    warnings: ['已按趋势数据导入，小红书原始导出中缺少互动明细与粉丝字段。'],
  };
}

export function normalizeRows(rows: Array<Record<string, unknown>>): NormalizeResult {
  if (isWechatDailyRows(rows)) {
    return normalizeWechatDailyRows(rows);
  }

  const records: DashboardRecord[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  rows.forEach((row, index) => {
    const missing = requiredColumns.filter((column) => !(column in row));
    if (missing.length > 0) {
      errors.push(`Row ${index + 1} missing required column: ${missing.join(', ')}`);
      return;
    }

    const platform = mapPlatform(String(row.platform));
    if (!platform) {
      errors.push(`Row ${index + 1} has unsupported platform: ${String(row.platform)}`);
      return;
    }

    const record: DashboardRecord = {
      platform,
      accountName: String(row.account),
      contentTitle: String(row.title),
      publishDate: String(row.publishDate),
      contentType: String(row.contentType),
      followers: toNumber(row.followers),
      followerDelta: toNumber(row.followerDelta),
      views: toNumber(row.views),
      likes: toNumber(row.likes),
      favorites: toNumber(row.favorites),
      comments: toNumber(row.comments),
      shares: toNumber(row.shares),
    };
    records.push(record);
  });

  return { records: dedupeRecords(records, warnings), errors, warnings };
}
