import styles from './dashboard.module.css';

type KpiGridProps = {
  totalAccounts: number;
  totalFollowers: number;
  totalFollowerDelta: number;
  totalViews: number;
};

function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: value >= 10000 ? 1 : 0,
  }).format(value);
}

export default function KpiGrid(props: KpiGridProps) {
  return (
    <section className={styles.kpiGrid}>
      <article className={styles.kpiFeatured}>
        <span className={styles.kpiLabel}>核心信号</span>
        <strong className={styles.kpiValue}>{formatCompact(props.totalViews)}</strong>
        <span className={styles.kpiMeta}>
          当前筛选范围内最值得优先关注的总曝光规模。
        </span>
      </article>
      <article className={styles.kpiCard}>
        <span className={styles.kpiLabel}>监控账号数</span>
        <strong className={styles.kpiValue}>{props.totalAccounts}</strong>
        <span className={styles.kpiMeta}>当前观察窗口内被纳入分析的账号数量。</span>
      </article>
      <article className={styles.kpiCard}>
        <span className={styles.kpiLabel}>总粉丝规模</span>
        <strong className={styles.kpiValue}>{formatCompact(props.totalFollowers)}</strong>
        <span className={styles.kpiMeta}>小红书与视频号合并后的整体覆盖体量。</span>
      </article>
      <article className={styles.kpiCard}>
        <span className={styles.kpiLabel}>30 天增长</span>
        <strong className={styles.kpiValue}>+{formatCompact(props.totalFollowerDelta)}</strong>
        <span className={styles.kpiMeta}>可用于下钻到账号层的净新增粉丝表现。</span>
      </article>
    </section>
  );
}
