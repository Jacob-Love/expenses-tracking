// Shared Gemini caller. Used by the dev middleware, the production server,
// and (with a browser-held key) the client. No SDK — one REST call.

export const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

export type ThinkingLevel = 'minimal' | 'low' | 'medium' | 'high';

export interface CompleteRequest {
  system?: string;
  prompt: string;
  maxTokens?: number;
  /** Ask for application/json output, optionally constrained by a schema. */
  json?: boolean;
  schema?: unknown;
  thinking?: ThinkingLevel;
}

export class GeminiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function body(req: CompleteRequest, model: string, withThinking: boolean) {
  const generationConfig: Record<string, unknown> = {};
  if (req.maxTokens) generationConfig.maxOutputTokens = req.maxTokens;
  if (req.json) generationConfig.responseMimeType = 'application/json';
  if (req.json && req.schema) generationConfig.responseSchema = req.schema;
  // Gemini 3.x defaults to "high" thinking, which is slow and bills thought
  // tokens. Classification needs none of it.
  if (withThinking && /^gemini-3/.test(model)) generationConfig.thinkingConfig = { thinkingLevel: req.thinking || 'minimal' };
  return {
    ...(req.system ? { systemInstruction: { parts: [{ text: req.system }] } } : {}),
    contents: [{ role: 'user', parts: [{ text: req.prompt }] }],
    generationConfig,
  };
}

async function call(key: string, model: string, payload: unknown, fetchImpl: typeof fetch) {
  return fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify(payload),
  });
}

export async function geminiComplete(key: string, req: CompleteRequest, model = DEFAULT_MODEL, fetchImpl: typeof fetch = fetch): Promise<string> {
  let res = await call(key, model, body(req, model, true), fetchImpl);
  // A model that rejects thinkingConfig gets one retry without it.
  if (res.status === 400) {
    const text = await res.text();
    if (/thinking/i.test(text)) res = await call(key, model, body(req, model, false), fetchImpl);
    else throw new GeminiError(400, errorMessage(text));
  }
  if (!res.ok) throw new GeminiError(res.status, errorMessage(await res.text()));
  const j = (await res.json()) as { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[] };
  const parts = j.candidates?.[0]?.content?.parts || [];
  return parts.filter((p) => !p.thought).map((p) => p.text || '').join('');
}

function errorMessage(text: string) {
  try {
    const j = JSON.parse(text) as { error?: { message?: string } };
    if (j.error?.message) return j.error.message;
  } catch { /* not JSON */ }
  return text.slice(0, 200) || 'Gemini request failed';
}
