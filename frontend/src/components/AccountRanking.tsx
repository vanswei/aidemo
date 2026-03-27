import styles from './dashboard.module.css';

export default function AccountRanking({
  rows,
}: {
  rows: Array<{ accountName: string; followerDelta: number; engagementRate: number }>;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>账号观察列表</h2>
          <p className={styles.panelSubtitle}>
            在查看平台变化时，同时保留重点账号的表现对比。
          </p>
        </div>
      </div>
      <ol className={styles.watchlist}>
        {rows.map((row) => (
          <li className={styles.watchItem} key={row.accountName}>
            <div className={styles.watchTop}>
              <span className={styles.watchName}>{row.accountName}</span>
              <strong className={styles.valueStrong}>+{row.followerDelta}</strong>
            </div>
            <span className={styles.watchMetric}>
              互动率 {(row.engagementRate * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
