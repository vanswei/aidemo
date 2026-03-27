export type RangeKey = '7d' | '30d';

export function matchesRange(date: string, range: RangeKey): boolean {
  const base = new Date('2026-03-26T00:00:00.000Z');
  const target = new Date(`${date}T00:00:00.000Z`);
  const diffDays = Math.floor((base.getTime() - target.getTime()) / 86400000);

  return range === '7d' ? diffDays <= 7 : diffDays <= 30;
}
