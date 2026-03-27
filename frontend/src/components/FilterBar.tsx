import type { Platform } from '../domain/types';
import type { RangeKey } from '../utils/date-range';
import styles from './dashboard.module.css';

type FilterState = {
  range: RangeKey;
  platform: Platform | 'all';
};

type FilterBarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
};

export default function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>筛选控制</h2>
          <p className={styles.panelSubtitle}>
            在不丢失总览视角的前提下，收窄当前驾驶舱观察范围。
          </p>
        </div>
      </div>
      <div className={styles.filterGrid}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>时间范围</span>
          <select
            className={styles.select}
            value={value.range}
            onChange={(event) =>
              onChange({ ...value, range: event.target.value as RangeKey })
            }
          >
            <option value="7d">近 7 天</option>
            <option value="30d">近 30 天</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>平台</span>
          <select
            className={styles.select}
            value={value.platform}
            onChange={(event) =>
              onChange({
              ...value,
              platform: event.target.value as FilterState['platform'],
            })
          }
          >
            <option value="all">全部平台</option>
            <option value="xiaohongshu">小红书</option>
            <option value="wechat-channel">视频号</option>
          </select>
        </label>
      </div>
    </section>
  );
}
