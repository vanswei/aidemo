import cors from 'cors';
import express from 'express';
import { analyzeDashboard } from './analyze-service.js';
import type { AppConfig } from './config.js';
import { createOpenAiClient } from './openai-client.js';
import { analysisRequestSchema } from './validate.js';

type Dependencies = {
  analyzeDashboard: typeof analyzeDashboard;
};

export function createApp(
  config: AppConfig,
  dependencies: Dependencies = { analyzeDashboard },
) {
  const app = express();
  const client = createOpenAiClient(config.openAiBaseUrl, config.openAiApiKey);

  app.use(cors());
  app.use(express.json({ limit: '512kb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.post('/api/analyze', async (request, response) => {
    try {
      const payload = analysisRequestSchema.parse(request.body);
      const result = await dependencies.analyzeDashboard(payload, client, config.openAiModel);
      response.json(result);
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : '分析请求失败',
      });
    }
  });

  return app;
}
