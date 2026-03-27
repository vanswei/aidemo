import type { AnalysisRequest } from './types.js';

export function buildAnalysisPrompt(request: AnalysisRequest) {
  return [
    '你是中文社媒运营分析助手。',
    '请只基于给定数据输出 JSON，不要输出额外解释。',
    '字段必须包含 summary、platformInsights、risks、actions。',
    '每个数组字段输出 1 到 3 条简洁中文结论。',
    `输入数据：${JSON.stringify(request)}`,
  ].join('\n');
}
