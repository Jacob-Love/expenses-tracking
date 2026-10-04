import { describe, expect, it, vi } from 'vitest';
import { PassThrough } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { geminiComplete } from './gemini.ts';
import { classifyRequest, parseClassify } from './prompts.ts';
import { handleAi, handleAiWeb } from './handler.ts';

const ok = (text: string) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'thinking…', thought: true }, { text }] } }] }), { status: 200 });

describe('geminiComplete', () => {
  it('sends the key in a header, sets minimal thinking on 3.x, and drops thought parts', async () => {
    const f = vi.fn(async () => ok('hello'));
    const out = await geminiComplete('k1', { prompt: 'hi', thinking: 'minimal', json: true }, 'gemini-3.1-flash-lite', f as unknown as typeof fetch);
    expect(out).toBe('hello');
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).not.toContain('k1');
    expect((init.headers as Record<string, string>)['x-goog-api-key']).toBe('k1');
    const body = JSON.parse(String(init.body));
    expect(body.generationConfig.thinkingConfig).toEqual({ thinkingLevel: 'minimal' });
    expect(body.generationConfig.responseMimeType).toBe('application/json');
  });

  it('retries once without thinkingConfig when the model rejects it', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: 'thinking_level is not supported' } }), { status: 400 }))
      .mockResolvedValueOnce(ok('done'));
    expect(await geminiComplete('k', { prompt: 'x' }, 'gemini-3.1-flash-lite', f as unknown as typeof fetch)).toBe('done');
    expect(JSON.parse(String((f.mock.calls[1][1] as RequestInit).body)).generationConfig.thinkingConfig).toBeUndefined();
  });

  it('surfaces the API error message', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ error: { message: 'API key not valid' } }), { status: 403 }));
    await expect(geminiComplete('bad', { prompt: 'x' }, 'gemini-3.1-flash-lite', f as unknown as typeof fetch)).rejects.toThrow('API key not valid');
  });
});

describe('classify prompt + parsing', () => {
  const input = { text: 'Office chairs 640', expense: ['Payroll', 'Software', 'Office'], revenue: ['Retainer', 'Project'] };

  it('constrains category to the known lists', () => {
    const req = classifyRequest(input);
    expect((req.schema as { properties: { category: { enum: string[] } } }).properties.category.enum).toEqual(['Payroll', 'Software', 'Office', 'Retainer', 'Project']);
  });

  it('accepts valid output and repairs a category from the wrong list', () => {
    expect(parseClassify('{"kind":"expense","category":"office","cadence":"once","name":"Office chairs"}', input)).toEqual({ kind: 'expense', category: 'Office', cadence: 'once', name: 'Office chairs' });
    expect(parseClassify('{"kind":"expense","category":"Retainer","cadence":"fortnightly","name":"x"}', input)).toMatchObject({ category: 'Payroll', cadence: 'once' });
    expect(parseClassify('not json', input)).toBeNull();
  });
});

function call(method: string, url: string, body?: unknown, env: NodeJS.ProcessEnv = {}) {
  const req = new PassThrough() as unknown as IncomingMessage & PassThrough;
  Object.assign(req, { method, url });
  let status = 0, payload = '';
  const res = { statusCode: 200, setHeader() {}, end(s: string) { status = res.statusCode; payload = s; } } as unknown as ServerResponse;
  const p = handleAi(req, res, env);
  req.end(body === undefined ? undefined : JSON.stringify(body));
  return p.then((handled) => ({ handled, status, json: payload ? JSON.parse(payload) : null }));
}

describe('handleAi', () => {
  it('ignores non-AI routes', async () => {
    expect((await call('GET', '/index.html')).handled).toBe(false);
  });
  it('reports server key status without leaking the key', async () => {
    const r = await call('GET', '/api/ai/status', undefined, { GEMINI_API_KEY: 'secret' });
    expect(r.json).toEqual({ server: true, model: 'gemini-3.1-flash-lite' });
  });
  it('returns 503 when no key is configured', async () => {
    expect((await call('POST', '/api/ai/classify', { text: 'x', expense: ['a'], revenue: ['b'] })).status).toBe(503);
  });
  it('validates classify input', async () => {
    expect((await call('POST', '/api/ai/classify', { text: '' }, { GEMINI_API_KEY: 'k' })).status).toBe(400);
  });
  it('does not expose a generic prompt endpoint', async () => {
    expect((await call('POST', '/api/ai/complete', { prompt: 'anything' }, { GEMINI_API_KEY: 'k' })).status).toBe(404);
  });
});

describe('handleAiWeb (Netlify)', () => {
  it('serves status and rejects unknown routes', async () => {
    const r = await handleAiWeb(new Request('https://x.netlify.app/api/ai/status'), { GEMINI_API_KEY: 'k' });
    expect(await r.json()).toEqual({ server: true, model: 'gemini-3.1-flash-lite' });
    expect((await handleAiWeb(new Request('https://x.netlify.app/api/ai/nope', { method: 'POST', body: '{}' }), { GEMINI_API_KEY: 'k' })).status).toBe(404);
  });
  it('rejects oversized and malformed bodies', async () => {
    const big = new Request('https://x/api/ai/report', { method: 'POST', body: 'x'.repeat(20000) });
    expect((await handleAiWeb(big, { GEMINI_API_KEY: 'k' })).status).toBe(413);
    const bad = new Request('https://x/api/ai/report', { method: 'POST', body: '{nope' });
    expect((await handleAiWeb(bad, { GEMINI_API_KEY: 'k' })).status).toBe(400);
  });
});
