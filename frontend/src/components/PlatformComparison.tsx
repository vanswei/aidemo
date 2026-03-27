import styles from './dashboard.module.css';

export default function PlatformComparison({
  items,
}: {
  items: Array<{
    platform: string;
    views: number;
    followerDelta: number;
    engagementRate: number;
  }>;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>平台信号</h2>
          <p className={styles.panelSubtitle}>
            先看平台健康度，再决定往账号还是内容层继续下钻。
          </p>
        </div>
      </div>
      <div className={styles.platformGrid}>
      {items.map((item) => (
        <article className={styles.platformCard} key={item.platform}>
          <div className={styles.platformHeader}>
            <span
              className={`${styles.platformBadge} ${
                item.platform === 'xiaohongshu'
                  ? styles.platformBadgeXhs
                  : styles.platformBadgeWx
              }`}
            >
              {item.platform === 'xiaohongshu' ? '小红书' : '视频号'}
            </span>
            <strong className={styles.valueStrong}>
              {(item.engagementRate * 100).toFixed(1)}%
            </strong>
          </div>
          <div className={styles.platformStats}>
            <div className={styles.platformStat}>
              <span className={styles.statValue}>{item.views.toLocaleString()}</span>
              <span className={styles.statLabel}>曝光</span>
            </div>
            <div className={styles.platformStat}>
              <span className={styles.statValue}>+{item.followerDelta}</span>
              <span className={styles.statLabel}>增长</span>
            </div>
            <div className={styles.platformStat}>
              <span className={styles.statValue}>{(item.engagementRate * 100).toFixed(1)}%</span>
              <span className={styles.statLabel}>互动率</span>
            </div>
          </div>
        </article>
      ))}
      </div>
    </section>
  );
}
