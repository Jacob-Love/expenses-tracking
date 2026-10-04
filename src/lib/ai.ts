// Model access for the client. Two routes, one interface:
//   1. A key pasted in Model settings (this browser only) → Gemini directly.
//   2. Otherwise the server proxy (/api/ai/*), which holds GEMINI_API_KEY.
// With neither, callers fall back to the rule-based categorizer.

import { DEFAULT_MODEL, geminiComplete } from '../../server/gemini.ts';
import { classifyRequest, parseClassify, reportRequest, type ClassifyResult } from '../../server/prompts.ts';
import { store } from './storage.ts';

const GKEY = 'ledger-gemini-key';

export interface AiStatus { server: boolean; model: string }

let status: AiStatus = { server: false, model: DEFAULT_MODEL };

export async function loadAiStatus(): Promise<AiStatus> {
  try {
    const r = await fetch('/api/ai/status');
    if (r.ok) status = (await r.json()) as AiStatus;
  } catch { /* static hosting without the proxy */ }
  return status;
}

export const browserKey = () => store.get(GKEY) || '';
export const setBrowserKey = (k: string) => (k ? store.set(GKEY, k) : store.remove(GKEY));
export const aiAvailable = () => !!browserKey() || status.server;
export const aiModel = () => status.model;

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = (await r.json().catch(() => ({}))) as T & { error?: string };
  if (!r.ok) throw new Error(j.error || `Model request failed (${r.status})`);
  return j;
}

export async function aiClassify(text: string, cats: { expense: string[]; revenue: string[] }): Promise<ClassifyResult | null> {
  if (!aiAvailable()) return null;
  const input = { text, ...cats };
  try {
    const key = browserKey();
    if (key) return parseClassify(await geminiComplete(key, classifyRequest(input), status.model), input);
    return (await post<{ result: ClassifyResult | null }>('/api/ai/classify', input)).result;
  } catch {
    return null;
  }
}

export async function aiReport(facts: string): Promise<string> {
  const key = browserKey();
  if (key) return (await geminiComplete(key, reportRequest(facts), status.model)).trim();
  return (await post<{ text: string }>('/api/ai/report', { facts })).text;
}
