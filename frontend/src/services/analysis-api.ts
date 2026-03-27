import type { AnalysisRequest, AnalysisResponse } from '../domain/analysis';

export async function requestAnalysis(payload: AnalysisRequest): Promise<AnalysisResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '分析请求失败' }));
    throw new Error(error.message ?? '分析请求失败');
  }

  return response.json();
}
