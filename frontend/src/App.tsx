import { useState } from 'react';
import AccountRanking from './components/AccountRanking';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import AnomalyList from './components/AnomalyList';
import ContentTable from './components/ContentTable';
import EmptyState from './components/EmptyState';
import FilterBar from './components/FilterBar';
import ImportPanel from './components/ImportPanel';
import type {
  ImportBatchPayload,
  ImportBatchResult,
  ImportSummary,
} from './components/ImportPanel';
import KpiGrid from './components/KpiGrid';
import PlatformComparison from './components/PlatformComparison';
import TrendPanel from './components/TrendPanel';
import styles from './components/dashboard.module.css';
import type { AnalysisRequest } from './domain/analysis';
import { buildDashboardView } from './domain/aggregations';
import type { DashboardRecord, Platform } from './domain/types';
import { normalizedRecords } from './test/test-data';

type FilterState = {
  range: '7d' | '30d';
  platform: Platform | 'all';
};

function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: value >= 10000 ? 1 : 0,
  }).format(value);
}

function getRecordKey(record: DashboardRecord) {
  return [
    record.platform,
    record.accountName,
    record.contentTitle,
    record.publishDate,
  ].join('::');
}

function mergeRecords(current: DashboardRecord[], incoming: DashboardRecord[]) {
  const seen = new Set(current.map(getRecordKey));
  const merged = [...current];
  let duplicateRecords = 0;

  for (const record of incoming) {
    const key = getRecordKey(record);
    if (seen.has(key)) {
      duplicateRecords += 1;
      continue;
    }

    seen.add(key);
    merged.push(record);
  }

  return {
    records: merged,
    addedRecords: merged.length - current.length,
    duplicateRecords,
  };
}

const initialImportSummary: ImportSummary = {
  fileCount: 0,
  totalRecords: normalizedRecords.length,
  lastAddedRecords: 0,
  lastFailedFiles: 0,
  duplicateRecords: 0,
  fileNames: [],
};

export default function App() {
  const [records, setRecords] = useState<DashboardRecord[]>(normalizedRecords);
  const [importSummary, setImportSummary] = useState<ImportSummary>(initialImportSummary);
  const [filters, setFilters] = useState<FilterState>({
    range: '30d',
    platform: 'all',
  });

  function handleImportBatch(payload: ImportBatchPayload): ImportBatchResult {
    const mergeResult = mergeRecords(records, payload.records);
    const nextFileNames = Array.from(new Set([...importSummary.fileNames, ...payload.fileNames]));

    setRecords(mergeResult.records);
    setImportSummary({
      fileCount: nextFileNames.length,
      totalRecords: mergeResult.records.length,
      lastAddedRecords: mergeResult.addedRecords,
      lastFailedFiles: payload.failedFiles.length,
      duplicateRecords: mergeResult.duplicateRecords,
      fileNames: nextFileNames,
    });

    return {
      addedRecords: mergeResult.addedRecords,
      duplicateRecords: mergeResult.duplicateRecords,
      totalRecords: mergeResult.records.length,
    };
  }

  function handleClearData() {
    setRecords(normalizedRecords);
    setImportSummary(initialImportSummary);
  }

  const scopedRecords =
    filters.platform === 'all'
      ? records
      : records.filter((record) => record.platform === filters.platform);
  const view = buildDashboardView(scopedRecords, { range: filters.range });
  const engagementAverage =
    view.platforms.reduce((sum, platform) => sum + platform.engagementRate, 0) /
    Math.max(view.platforms.length, 1);

  const analysisPayload: AnalysisRequest = {
    range: filters.range,
    platform: filters.platform,
    kpis: {
      totalAccounts: view.kpis.totalAccounts,
      totalFollowerDelta: view.kpis.totalFollowerDelta,
      totalViews: view.kpis.totalViews,
    },
    platforms: view.platforms,
    accountRanking: view.accountRanking,
    anomalies: view.anomalies,
    topContent: view.contentRows.slice(0, 5).map((row) => ({
      contentTitle: row.contentTitle,
      platform: row.platform,
      views: row.views,
      likes: row.likes,
      comments: row.comments,
      shares: row.shares,
    })),
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>运营驾驶舱</span>
          <h1 className={styles.heroTitle}>小红书与视频号运营驾驶舱</h1>
          <p className={styles.heroLead}>跨平台增长、曝光与账号诊断总览。</p>
          <div className={styles.heroMeta}>
            <span className={styles.metaChip}>
              时间 {filters.range === '30d' ? '近 30 天' : '近 7 天'}
            </span>
            <span className={styles.metaChip}>
              范围 {filters.platform === 'all' ? '全部平台' : filters.platform}
            </span>
            <span className={styles.metaChip}>当前记录 {records.length} 条</span>
          </div>
        </div>
        <div className={styles.heroAside}>
          <div className={styles.heroPanel}>
            <span className={styles.panelLabel}>当前总览</span>
            <div className={styles.heroStat}>
              <strong className={styles.heroStatValue}>{formatCompact(view.kpis.totalViews)}</strong>
              <span className={styles.heroStatCaption}>
                当前筛选范围内以曝光规模为主视角，重点观察涨粉变化与互动效率。
              </span>
            </div>
            <ImportPanel
              summary={{ ...importSummary, totalRecords: records.length }}
              onImportBatch={handleImportBatch}
              onClearData={handleClearData}
            />
          </div>
          <div className={styles.heroDuo}>
            <div className={`${styles.heroMiniCard} ${styles.xhsTone}`}>
              <strong>+{view.kpis.totalFollowerDelta}</strong>
              <span>本观察窗口内累计新增粉丝</span>
            </div>
            <div className={`${styles.heroMiniCard} ${styles.wxTone}`}>
              <strong>{(engagementAverage * 100).toFixed(1)}%</strong>
              <span>当前范围内的平均互动基线</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.toolbar}>
        <FilterBar value={filters} onChange={setFilters} />
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleWrap}>
              <h2 className={styles.panelTitle}>跨平台总览视图</h2>
              <p className={styles.panelSubtitle}>
                上半区强调总览与判断，下半区强调运营执行与诊断。
              </p>
            </div>
          </div>
          <div className={styles.sideNotes}>
            <div className={styles.noteCard}>
              <span className={styles.panelLabel}>重点</span>
              <strong>先看平台变化，再看账号问题</strong>
              <span className={styles.muted}>通过观察列表与内容工作台快速定位原因。</span>
            </div>
            <div className={styles.noteCard}>
              <span className={styles.panelLabel}>当前模式</span>
              <strong>{filters.platform === 'all' ? '组合总览模式' : '单平台下钻模式'}</strong>
              <span className={styles.muted}>筛选和导入结果会同步影响下方所有分析区块。</span>
            </div>
          </div>
        </div>
      </section>

      {view.contentRows.length === 0 ? (
        <EmptyState message="当前筛选条件下暂无数据。" />
      ) : (
        <>
          <KpiGrid {...view.kpis} />
          <AIAnalysisPanel payload={analysisPayload} />
          <section className={styles.analysisGrid}>
            <div className={styles.analysisStack}>
              <PlatformComparison items={view.platforms} />
              <TrendPanel rows={view.contentRows} />
            </div>
            <div className={styles.analysisStack}>
              <AccountRanking rows={view.accountRanking} />
              <AnomalyList rows={view.anomalies} />
            </div>
          </section>
          <section className={styles.workbenchGrid}>
            <ContentTable rows={view.contentRows} />
            <aside className={styles.workbenchStack}>
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitleWrap}>
                    <h2 className={styles.panelTitle}>工作台提示</h2>
                    <p className={styles.panelSubtitle}>
                      这里用于承接运营判断后的下一步动作和复盘提醒。
                    </p>
                  </div>
                </div>
                <div className={styles.sideNotes}>
                  <div className={styles.noteCard}>
                    <span className={styles.panelLabel}>最高曝光内容</span>
                    <strong>{view.contentRows[0]?.contentTitle ?? '当前范围内暂无内容'}</strong>
                    <span className={styles.muted}>当前筛选结果里排在最前的内容样本。</span>
                  </div>
                  <div className={styles.noteCard}>
                    <span className={styles.panelLabel}>复盘建议</span>
                    <strong>优先检查发文节奏与互动质量</strong>
                    <span className={styles.muted}>
                      建议结合预警信息与内容表格决定下一步动作。
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </>
      )}
    </main>
  );
}
