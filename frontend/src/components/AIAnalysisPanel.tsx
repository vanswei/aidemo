import { useState } from 'react';
import type { AnalysisRequest, AnalysisResponse } from '../domain/analysis';
import { requestAnalysis } from '../services/analysis-api';
import styles from './dashboard.module.css';

type Props = {
  payload: AnalysisRequest;
};

export default function AIAnalysisPanel({ payload }: Props) {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    setError('');

    try {
      const next = await requestAnalysis(payload);
      setResult(next);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : '分析请求失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleWrap}>
          <h2 className={styles.panelTitle}>AI 运营分析</h2>
          <p className={styles.panelSubtitle}>基于当前筛选结果手动生成运营判断与下一步建议。</p>
        </div>
        <button className={styles.ghostButton} type="button" onClick={handleAnalyze} disabled={loading}>
          {loading ? '分析中...' : '开始分析'}
        </button>
      </div>
      {error ? <p className={styles.importError}>{error}</p> : null}
      {result ? (
        <div className={styles.analysisResult}>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>总体判断</span>
            <p>{result.summary}</p>
          </div>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>平台洞察</span>
            <p>{result.platformInsights.join('；')}</p>
          </div>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>风险提醒</span>
            <p>{result.risks.join('；')}</p>
          </div>
          <div className={styles.noteCard}>
            <span className={styles.panelLabel}>建议动作</span>
            <p>{result.actions.join('；')}</p>
          </div>
        </div>
      ) : (
        <p className={styles.muted}>点击“开始分析”后生成当前驾驶舱的 AI 诊断结果。</p>
      )}
    </section>
  );
}
