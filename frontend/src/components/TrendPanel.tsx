import {
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './dashboard.module.css';

export default function TrendPanel({
  rows,
}: {
  rows: Array<{ publishDate: string; views: number }>;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>趋势曲线</h2>
          <p className={styles.panelSubtitle}>
            用曝光趋势判断当前运营窗口是在放大，还是开始走弱。
          </p>
        </div>
      </div>
      <div className={styles.trendShell}>
        <div className={styles.trendChartFrame}>
          <LineChart data={rows} width={760} height={240}>
          <XAxis dataKey="publishDate" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#4593ff" strokeWidth={3} dot={false} />
          </LineChart>
        </div>
      </div>
    </section>
  );
}
