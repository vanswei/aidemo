export function calculateEngagementRate(values: {
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  shares: number;
}): number {
  const engagement =
    values.likes + values.favorites + values.comments + values.shares;

  return values.views === 0 ? 0 : engagement / values.views;
}
