// /api/ai/* — keeps GEMINI_API_KEY on the server. Mounted by the Vite dev
// server (vite.config.ts) and by the production server (server/index.ts).

import type { IncomingMessage, ServerResponse } from 'node:http';
import { DEFAULT_MODEL, GeminiError, geminiComplete } from './gemini.ts';
import { classifyRequest, parseClassify, reportRequest, type ClassifyInput } from './prompts.ts';

const MAX_BODY = 16 * 1024;

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new GeminiError(413, 'Request too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { reject(new GeminiError(400, 'Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

/** Returns true when the request was handled. */
export async function handleAi(req: IncomingMessage, res: ServerResponse, env: NodeJS.ProcessEnv = process.env): Promise<boolean> {
  const url = (req.url || '').split('?')[0];
  if (!url.startsWith('/api/ai/')) return false;
  const key = env.GEMINI_API_KEY || '';
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;

  if (url === '/api/ai/status' && req.method === 'GET') {
    send(res, 200, { server: !!key, model });
    return true;
  }
  if (req.method !== 'POST' || (url !== '/api/ai/classify' && url !== '/api/ai/report')) {
    send(res, 404, { error: 'Not found' });
    return true;
  }
  if (!key) {
    send(res, 503, { error: 'GEMINI_API_KEY is not set on the server' });
    return true;
  }
  try {
    const body = await readJson(req);
    if (url === '/api/ai/classify') {
      const input: ClassifyInput = { text: String(body.text || ''), expense: body.expense as string[], revenue: body.revenue as string[] };
      if (!input.text.trim() || !Array.isArray(input.expense) || !Array.isArray(input.revenue) || !input.expense.length || !input.revenue.length) {
        send(res, 400, { error: 'text, expense[] and revenue[] are required' });
        return true;
      }
      const out = await geminiComplete(key, classifyRequest(input), model);
      send(res, 200, { result: parseClassify(out, input) });
    } else {
      const facts = String(body.facts || '');
      if (!facts.trim()) { send(res, 400, { error: 'facts is required' }); return true; }
      const text = await geminiComplete(key, reportRequest(facts), model);
      send(res, 200, { text: text.trim() });
    }
  } catch (e) {
    const status = e instanceof GeminiError ? (e.status >= 500 || e.status === 429 || e.status === 413 || e.status === 400 ? e.status : 502) : 502;
    send(res, status, { error: e instanceof Error ? e.message : 'Model request failed' });
  }
  return true;
}
