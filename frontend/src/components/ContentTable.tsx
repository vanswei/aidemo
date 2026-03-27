import type { DashboardRecord } from '../domain/types';
import styles from './dashboard.module.css';

export default function ContentTable({ rows }: { rows: DashboardRecord[] }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>内容工作台</h2>
          <p className={styles.panelSubtitle}>
            把账号与平台信号落到具体内容层，便于快速复盘。
          </p>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>平台</th>
            <th>账号</th>
            <th>标题</th>
            <th>日期</th>
            <th>曝光</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.platform}-${row.accountName}-${row.contentTitle}-${row.publishDate}`}
            >
              <td>
                <span
                  className={`${styles.platformPill} ${
                    row.platform === 'xiaohongshu'
                      ? styles.platformBadgeXhs
                      : styles.platformBadgeWx
                  }`}
                >
                  {row.platform === 'xiaohongshu' ? '小红书' : '视频号'}
                </span>
              </td>
              <td>{row.accountName}</td>
              <td>{row.contentTitle}</td>
              <td>{row.publishDate}</td>
              <td className={styles.valueStrong}>{row.views.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </section>
  );
}
