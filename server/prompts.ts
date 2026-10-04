// The only two things the model is asked to do. Both the server proxy and the
// browser-key path build requests here, so the proxy never forwards
// arbitrary prompts — it is not a general-purpose LLM endpoint.

import type { CompleteRequest } from './gemini.ts';

export interface ClassifyInput {
  text: string;
  expense: string[];
  revenue: string[];
  /** Names already in the ledger, so the model reuses their spelling. */
  known?: string[];
}

export interface ClassifyResult {
  kind: 'expense' | 'revenue';
  category: string;
  cadence: 'once' | 'monthly' | 'annual';
  name: string;
}

const MAX_TEXT = 300;
const MAX_FACTS = 6000;
const MAX_CATS = 60;
const MAX_KNOWN = 80;

const clean = (s: unknown, max: number) => String(s ?? '').replace(/[\u0000-\u0009\u000b-\u001f]/g, ' ').slice(0, max);
const cleanCats = (a: unknown) => (Array.isArray(a) ? a : []).slice(0, MAX_CATS).map((c) => clean(c, 40).trim()).filter(Boolean);

export function classifyRequest(input: ClassifyInput): CompleteRequest {
  const expense = cleanCats(input.expense), revenue = cleanCats(input.revenue);
  const known = (Array.isArray(input.known) ? input.known : []).slice(0, MAX_KNOWN).map((n) => clean(n, 60).trim()).filter(Boolean);
  return {
    json: true,
    thinking: 'minimal',
    maxTokens: 200,
    schema: {
      type: 'OBJECT',
      properties: {
        kind: { type: 'STRING', enum: ['expense', 'revenue'] },
        category: { type: 'STRING', enum: [...new Set([...expense, ...revenue])] },
        cadence: { type: 'STRING', enum: ['once', 'monthly', 'annual'] },
        name: { type: 'STRING' },
      },
      required: ['kind', 'category', 'cadence', 'name'],
    },
    system: 'You categorize single lines from a small business ledger. Money the business pays out is an expense; money it receives is revenue. Pick the closest category from the list for that kind. Cadence is monthly or annual only when the line says it recurs. The name is the vendor or source, short, without the amount, cadence or date, with the vendor\'s usual capitalization. If the line refers to a name already in the ledger, return that name exactly as listed.',
    prompt: `Expense categories: ${expense.join(', ')}\nRevenue categories: ${revenue.join(', ')}${known.length ? `\nNames already in the ledger: ${known.join(' | ')}` : ''}\nLine: ${clean(input.text, MAX_TEXT)}`,
  };
}

/** Validate model output against the lists; never trust it blindly. */
export function parseClassify(out: string, input: ClassifyInput): ClassifyResult | null {
  try {
    const j = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1)) as Partial<ClassifyResult>;
    const kind = j.kind === 'revenue' ? 'revenue' : 'expense';
    const cats = kind === 'revenue' ? input.revenue : input.expense;
    const hit = cats.find((c) => c.toLowerCase() === String(j.category || '').toLowerCase());
    return {
      kind,
      category: hit || cats[0],
      cadence: j.cadence === 'monthly' || j.cadence === 'annual' ? j.cadence : 'once',
      name: clean(j.name, 80).trim(),
    };
  } catch {
    return null;
  }
}

export function reportRequest(facts: string): CompleteRequest {
  return {
    thinking: 'low',
    maxTokens: 1200,
    system: 'You are a blunt bookkeeper for a small business. Write in second person, present tense, short sentences, concrete numbers. No adjectives like powerful or seamless. No emoji. Plain text with short line breaks, no markdown headers or bullets.',
    prompt: `Write a monthly finance report in under 180 words: what changed, where the money goes, what to cut or watch, and one action for next week. Facts:\n${clean(facts, MAX_FACTS).replace(/ {2,}/g, ' ')}`,
  };
}
