import { z } from 'zod';
import { buildAnalysisPrompt } from './prompt.js';
import type { AnalysisRequest, AnalysisResponse } from './types.js';

const analysisResponseSchema = z.object({
  summary: z.string(),
  platformInsights: z.array(z.string()),
  risks: z.array(z.string()),
  actions: z.array(z.string()),
});

function normalizeField(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter((item) => item.length > 0);
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return [];
}

function normalizeResponse(payload: unknown) {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const summaryParts = normalizeField(raw.summary);

  return {
    summary: summaryParts[0] ?? '',
    platformInsights: normalizeField(raw.platformInsights),
    risks: normalizeField(raw.risks),
    actions: normalizeField(raw.actions),
  };
}

export async function analyzeDashboard(
  request: AnalysisRequest,
  client: {
    chat: {
      completions: {
        create: (...args: any[]) => Promise<{
          choices: Array<{ message: { content: string | null } }>;
        }>;
      };
    };
  },
  model: string,
): Promise<AnalysisResponse> {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [{ role: 'user', content: buildAnalysisPrompt(request) }],
  });

  const content = completion.choices[0]?.message.content;
  return analysisResponseSchema.parse(normalizeResponse(JSON.parse(content ?? '{}')));
}
