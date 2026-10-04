// /api/ai/* — keeps GEMINI_API_KEY on the server. One router, two adapters:
//   handleAi   — Node req/res (Vite dev server, server/index.ts)
//   handleAiWeb — Web Request/Response (Netlify Functions)

import type { IncomingMessage, ServerResponse } from 'node:http';
import { DEFAULT_MODEL, GeminiError, geminiComplete } from './gemini.ts';
import { classifyRequest, parseClassify, reportRequest, type ClassifyInput } from './prompts.ts';

const MAX_BODY = 16 * 1024;

type Env = Record<string, string | undefined>;
interface Reply { status: number; data: unknown }

/** Returns null when the path is not an AI route. */
export async function routeAi(method: string, path: string, readBody: () => Promise<string>, env: Env): Promise<Reply | null> {
  if (!path.startsWith('/api/ai/')) return null;
  const key = env.GEMINI_API_KEY || '';
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;

  if (path === '/api/ai/status' && method === 'GET') return { status: 200, data: { server: !!key, model } };
  if (method !== 'POST' || (path !== '/api/ai/classify' && path !== '/api/ai/report')) return { status: 404, data: { error: 'Not found' } };
  if (!key) return { status: 503, data: { error: 'GEMINI_API_KEY is not set on the server' } };

  try {
    const raw = await readBody();
    if (raw.length > MAX_BODY) return { status: 413, data: { error: 'Request too large' } };
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw || '{}'); } catch { return { status: 400, data: { error: 'Invalid JSON' } }; }

    if (path === '/api/ai/classify') {
      const input: ClassifyInput = { text: String(body.text || ''), expense: body.expense as string[], revenue: body.revenue as string[] };
      if (!input.text.trim() || !Array.isArray(input.expense) || !Array.isArray(input.revenue) || !input.expense.length || !input.revenue.length) {
        return { status: 400, data: { error: 'text, expense[] and revenue[] are required' } };
      }
      const out = await geminiComplete(key, classifyRequest(input), model);
      return { status: 200, data: { result: parseClassify(out, input) } };
    }
    const facts = String(body.facts || '');
    if (!facts.trim()) return { status: 400, data: { error: 'facts is required' } };
    const text = await geminiComplete(key, reportRequest(facts), model);
    return { status: 200, data: { text: text.trim() } };
  } catch (e) {
    const status = e instanceof GeminiError && (e.status >= 500 || e.status === 429 || e.status === 400) ? e.status : 502;
    return { status, data: { error: e instanceof Error ? e.message : 'Model request failed' } };
  }
}

function readNode(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) { resolve('x'.repeat(MAX_BODY + 1)); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/** Node adapter. Returns true when the request was handled. */
export async function handleAi(req: IncomingMessage, res: ServerResponse, env: Env = process.env): Promise<boolean> {
  const reply = await routeAi(req.method || 'GET', (req.url || '').split('?')[0], () => readNode(req), env);
  if (!reply) return false;
  res.statusCode = reply.status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(reply.data));
  return true;
}

/** Web adapter (Netlify Functions, any fetch-style runtime). */
export async function handleAiWeb(req: Request, env: Env = process.env): Promise<Response> {
  const reply = (await routeAi(req.method, new URL(req.url).pathname, () => req.text(), env)) || { status: 404, data: { error: 'Not found' } };
  return new Response(JSON.stringify(reply.data), { status: reply.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
