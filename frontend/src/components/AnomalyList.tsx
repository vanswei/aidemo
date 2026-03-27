import styles from './dashboard.module.css';

export default function AnomalyList({
  rows,
}: {
  rows: Array<{ accountName: string; message: string }>;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>优先预警</h2>
          <p className={styles.panelSubtitle}>
            把下一轮内容动作前最该处理的问题提前暴露出来。
          </p>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className={styles.emptyAlerts}>当前未发现明显异常。</p>
      ) : (
        <div className={styles.alertList}>
          {rows.map((row) => (
            <article className={styles.alertItem} key={row.accountName}>
              <span className={styles.alertEyebrow}>优先预警</span>
              <p>{row.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
