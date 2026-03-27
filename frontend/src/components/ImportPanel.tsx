import { useState } from 'react';
import { normalizeRows, normalizeWorkbookSheets } from '../domain/normalizers';
import type { DashboardRecord } from '../domain/types';
import { readCsv, readSpreadsheet } from '../utils/file-import';
import styles from './dashboard.module.css';

export type FailedImportFile = {
  fileName: string;
  reason: string;
};

export type ImportBatchPayload = {
  records: DashboardRecord[];
  fileNames: string[];
  failedFiles: FailedImportFile[];
};

export type ImportBatchResult = {
  addedRecords: number;
  duplicateRecords: number;
  totalRecords: number;
};

export type ImportSummary = {
  fileCount: number;
  totalRecords: number;
  lastAddedRecords: number;
  lastFailedFiles: number;
  duplicateRecords: number;
  fileNames: string[];
};

type ImportPanelProps = {
  summary: ImportSummary;
  onImportBatch: (payload: ImportBatchPayload) => ImportBatchResult;
  onClearData: () => void;
};

const initialMessage = '支持一次导入多个 Excel 或 CSV 文件，后续可继续追加导入。';

export default function ImportPanel({
  summary,
  onImportBatch,
  onClearData,
}: ImportPanelProps) {
  const [message, setMessage] = useState(initialMessage);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const batchRecords: DashboardRecord[] = [];
    const fileNames: string[] = [];
    const failedFiles: FailedImportFile[] = [];

    for (const file of files) {
      try {
        const result = file.name.endsWith('.csv')
          ? normalizeRows(await readCsv(file))
          : normalizeWorkbookSheets(await readSpreadsheet(file), file.name);

        if (result.errors.length > 0) {
          failedFiles.push({
            fileName: file.name,
            reason: result.errors[0],
          });
          continue;
        }

        batchRecords.push(...result.records);
        fileNames.push(file.name);
      } catch (error) {
        failedFiles.push({
          fileName: file.name,
          reason: error instanceof Error ? error.message : '导入失败',
        });
      }
    }

    if (batchRecords.length === 0) {
      setMessage(
        failedFiles[0]
          ? `${failedFiles[0].fileName}：${failedFiles[0].reason}`
          : '没有可导入的数据文件。',
      );
      event.target.value = '';
      return;
    }

    const mergeResult = onImportBatch({
      records: batchRecords,
      fileNames,
      failedFiles,
    });

    const segments = [`本次新增 ${mergeResult.addedRecords} 条记录`];
    if (mergeResult.duplicateRecords > 0) {
      segments.push(`重复跳过 ${mergeResult.duplicateRecords} 条`);
    }
    if (failedFiles.length > 0) {
      segments.push(`失败 ${failedFiles.length} 个文件`);
    }
    segments.push(`当前累计 ${mergeResult.totalRecords} 条`);

    setMessage(`${segments.join('，')}。`);
    event.target.value = '';
  }

  function handleClear() {
    onClearData();
    setMessage('已清空导入数据，恢复到初始演示看板。');
  }

  return (
    <section className={styles.importPanel}>
      <div className={styles.importActions}>
        <label className={styles.uploadLabel} htmlFor="file-input">
          上传 Excel 或 CSV
        </label>
        <button className={styles.ghostButton} type="button" onClick={handleClear}>
          清空数据
        </button>
      </div>
      <input
        className={styles.uploadInput}
        id="file-input"
        type="file"
        accept=".csv,.xlsx,.xls"
        multiple
        onChange={handleChange}
      />
      <div className={styles.importSummary}>
        <div className={styles.importStats}>
          <span className={styles.importStat}>已导入文件 {summary.fileCount}</span>
          <span className={styles.importStat}>累计记录 {summary.totalRecords}</span>
          <span className={styles.importStat}>本次新增 {summary.lastAddedRecords}</span>
          <span className={styles.importStat}>失败文件 {summary.lastFailedFiles}</span>
        </div>
        {summary.fileNames.length > 0 ? (
          <p className={styles.importFiles}>已导入：{summary.fileNames.join('、')}</p>
        ) : (
          <p className={styles.importFiles}>当前使用初始演示数据。</p>
        )}
      </div>
      <p
        className={`${styles.importMessage} ${
          message.includes('新增') || message.includes('恢复')
            ? styles.importSuccess
            : message.includes('失败') || message.includes('missing required column')
              ? styles.importError
              : ''
        }`}
      >
        {message}
      </p>
    </section>
  );
}
