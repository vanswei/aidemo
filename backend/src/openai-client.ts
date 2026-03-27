import OpenAI from 'openai';

export function createOpenAiClient(baseURL: string, apiKey: string) {
  return new OpenAI({
    baseURL,
    apiKey,
  });
}
