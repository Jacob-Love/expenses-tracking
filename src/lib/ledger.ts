// Ledger domain: entry model, quick-add parser, and the monthly metrics every
// view reads from. Pure functions — no React, no storage.

export type Kind = 'expense' | 'revenue';
export type Cadence = 'once' | 'weekly' | 'monthly' | 'annual';

export interface Entry {
  id: string;
  kind: Kind;
  name: string;
  amount: number;
  category: string;
  cadence: Cadence;
  /** ISO yyyy-mm-dd. For recurring entries, the first charge. */
  date: string;
  /** false while paused (an open range in `pauses`). */
  active: boolean;
  /** Paused stretches. `to` is the day billing resumed; missing while still paused. */
  pauses?: { from: string; to?: string }[];
  /** Cancelled: no charges on or after this day. */
  endDate?: string;
}

export type Status = 'active' | 'paused' | 'cancelled';

/** Is this recurring entry billing on day `d`? Past charges stay counted after a pause or cancel. */
export function isBilling(e: Entry, d: Date): boolean {
  if (parse(e.date) > d) return false;
  if (e.endDate && d >= parse(e.endDate)) return false;
  // Paused by an older version (no history kept): treat as paused all along.
  if (e.active === false && !e.pauses?.length) return false;
  return !(e.pauses || []).some((p) => d >= parse(p.from) && (!p.to || d < parse(p.to)));
}

export function statusOf(e: Entry, today = new Date()): Status {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (e.endDate && t >= parse(e.endDate)) return 'cancelled';
  return isBilling(e, t) || parse(e.date) > t ? 'active' : 'paused';
}

/** Apply a pause / resume / cancel / restore as of `on` (ISO date). */
export function setStatus(e: Entry, action: 'pause' | 'resume' | 'cancel' | 'restore', on: string): Entry {
  const pauses = [...(e.pauses || [])];
  const open = pauses.findIndex((p) => !p.to);
  switch (action) {
    case 'pause':
      if (open >= 0 || e.active === false) return e;
      return { ...e, active: false, pauses: [...pauses, { from: on }] };
    case 'resume':
      if (open >= 0) pauses[open] = { ...pauses[open], to: on };
      else if (e.active === false) pauses.push({ from: e.date, to: on }); // legacy pause
      return { ...e, active: true, pauses };
    case 'cancel':
      return { ...e, endDate: on };
    case 'restore': {
      const { endDate: _, ...rest } = e;
      return rest;
    }
  }
}

export const EXP_CATS = ['Payroll', 'Contractors', 'Software', 'Ad spend'];
export const REV_CATS = ['Retainer', 'Project', 'Product'];
export const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const CAD_LABEL: Record<Cadence, string> = { once: 'One-time', weekly: 'Weekly', monthly: 'Monthly', annual: 'Annual' };
export const CAD_SUFFIX: Record<Cadence, string> = { once: '', weekly: '/wk', monthly: '/mo', annual: '/yr' };

export const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addMonths = (d: Date, n: number) => {
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1);
  r.setDate(Math.min(d.getDate(), new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()));
  return r;
};
export const money = (n: number) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
export const money2 = (n: number) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/** Monthly equivalent. Weekly is 52/12 ≈ 4.33× — a month is not four weeks. */
export const monthly = (e: Pick<Entry, 'cadence' | 'amount'>) => (e.cadence === 'monthly' ? e.amount : e.cadence === 'annual' ? e.amount / 12 : e.cadence === 'weekly' ? (e.amount * 52) / 12 : 0);
export const pct = (cur: number, prev: number) => (prev ? Math.round(((cur - prev) / Math.abs(prev)) * 100) : null);
export const dateLabel = (s: string) => { const d = parse(s); return `${MON[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`; };
export const shortDate = (d: Date) => `${MON[d.getMonth()]} ${pad(d.getDate())}`;
export const uid = () => Math.random().toString(36).slice(2, 9);

export function seed(now = new Date()): Entry[] {
  const y = now.getFullYear(), m = now.getMonth();
  const d = (mo: number, day: number) => iso(new Date(y, m + mo, day));
  const e = (kind: Kind, name: string, amount: number, category: string, cadence: Cadence, date: string, active = true): Entry => ({ id: uid(), kind, name, amount, category, cadence, date, active });
  return [
    e('expense', 'Design tool — team seats', 45, 'Software', 'monthly', d(-9, 4)),
    e('expense', 'Cloud hosting', 212, 'Software', 'monthly', d(-11, 1)),
    e('expense', 'Email + docs suite', 86, 'Software', 'monthly', d(-14, 12)),
    e('expense', 'Analytics platform', 1188, 'Software', 'annual', d(-11, 18)),
    e('expense', 'Accounting software', 30, 'Software', 'monthly', d(-6, 22)),
    e('expense', 'Password manager', 8, 'Software', 'monthly', d(-5, 9), false),
    e('expense', 'Payroll — 3 FTE', 21400, 'Payroll', 'monthly', d(-10, 28)),
    e('expense', 'Contractor — dev sprint', 4800, 'Contractors', 'monthly', d(-4, 15)),
    e('expense', 'Contractor — video edit', 1250, 'Contractors', 'once', d(0, 2)),
    e('expense', 'Meta ads — Sep', 6420, 'Ad spend', 'once', d(-1, 30)),
    e('expense', 'Meta ads — Aug', 5870, 'Ad spend', 'once', d(-2, 31)),
    e('expense', 'Meta ads — Jul', 5100, 'Ad spend', 'once', d(-3, 31)),
    e('expense', 'Google ads — Sep', 1900, 'Ad spend', 'once', d(-1, 30)),
    e('expense', 'Conference tickets', 1480, 'Contractors', 'once', d(-2, 11)),
    e('revenue', 'Retainer — Client 01', 12000, 'Retainer', 'monthly', d(-12, 1)),
    e('revenue', 'Retainer — Client 02', 8500, 'Retainer', 'monthly', d(-7, 1)),
    e('revenue', 'Retainer — Client 03', 6000, 'Retainer', 'monthly', d(-3, 15)),
    e('revenue', 'Retainer — Client 04', 4500, 'Retainer', 'monthly', d(-9, 1), false),
    e('revenue', 'Annual support plan — Client 01', 18000, 'Retainer', 'annual', d(-10, 20)),
    e('revenue', 'Brand project — Client 05', 14000, 'Project', 'once', d(-1, 8)),
    e('revenue', 'Landing page build', 6500, 'Project', 'once', d(-3, 19)),
    e('revenue', 'Template sales', 2340, 'Product', 'once', d(0, 1)),
    e('revenue', 'Audit — Client 06', 3200, 'Project', 'once', d(-5, 3)),
  ];
}

const AMOUNT_RE = /(\$)?\s*(\d[\d,]*(?:\.\d{1,2})?)\s*(k)?\s*(?:\/|per\s+|a\s+|every\s+)?\s*(mo|month|monthly|m|yr|year|annual|annually|y|wk|week|weekly|w)?\b/gi;

// Which number in the line is the amount? One marked with $, k or a cadence
// wins. Otherwise skip labels like "Client 02" and years, then take the largest
// ("Hosting 212 for 3 servers" → 212).
function pickAmount(s: string): RegExpMatchArray | null {
  const all = [...s.matchAll(AMOUNT_RE)].map((m) => [m[0], m[2], m[3], m[4], m[1]] as const);
  if (!all.length) return null;
  const toMatch = (c: (typeof all)[number]) => [c[0], c[1], c[2], c[3]] as unknown as RegExpMatchArray;
  const marked = all.find((c) => c[2] || c[3] || c[4]);
  if (marked) return toMatch(marked);
  const value = (c: (typeof all)[number]) => parseFloat(c[1].replace(/,/g, ''));
  const plain = all.filter((c) => !/^0\d/.test(c[1]) && !/^20\d\d$/.test(c[1]));
  const pool = plain.length ? plain : all;
  return toMatch(pool.reduce((a, b) => (value(b) > value(a) ? b : a)));
}

export interface QuickParse { kind: Kind; name: string; amount: number; cadence: Cadence; category: string; /** The amount/cadence text as typed, e.g. "15/mo". */ amountText?: string; /** ISO date when the line names one. */ date?: string }

// "+Retainer client 02 4500/mo" → revenue monthly 4500; "Design tool 24/mo"; "Contractor invoice 1800"
// ── Dates in quick-add ──────────────────────────────────────────────────────
// "yesterday", "last fri", "3 days ago", "oct 2", "2nd october", "10/2",
// "10/2/26", "2026-10-02", "on the 3rd". A date without a year that would land
// more than 30 days in the future is read as last year (you log what already
// happened). Dates are removed from the line before the amount is picked, so
// "Figma 12 on 10/28" is $12 on Oct 28, not $28.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MONTH_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?';
const DAY_RE = '(sun(?:day)?|mon(?:day)?|tue(?:s(?:day)?)?|wed(?:nesday)?|thu(?:r(?:s(?:day)?)?)?|fri(?:day)?|sat(?:urday)?)';
const ORD = '(\\d{1,2})(?:st|nd|rd|th)?';
const LEAD = '(?:\\b(?:on|dated|from)\\s+)?';

export function parseDate(text: string, now = new Date()): { date: string; text: string; label: string } | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const valid = (y: number, m: number, d: number) => { const r = new Date(y, m, d); return r.getMonth() === m && r.getDate() === d ? r : null; };
  const noYear = (m: number, d: number) => {
    const r = valid(today.getFullYear(), m, d);
    if (!r) return null;
    return r.getTime() - today.getTime() > 30 * 86400000 ? valid(today.getFullYear() - 1, m, d) : r;
  };
  const year = (y: string) => (y.length === 2 ? 2000 + Number(y) : Number(y));
  const rules: [RegExp, (m: RegExpMatchArray) => Date | null][] = [
    [new RegExp(`${LEAD}\\b(\\d{4})-(\\d{1,2})-(\\d{1,2})\\b`, 'i'), (m) => valid(Number(m[1]), Number(m[2]) - 1, Number(m[3]))],
    [new RegExp(`${LEAD}\\b(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{2}|\\d{4}))?\\b`, 'i'), (m) => (m[3] ? valid(year(m[3]), Number(m[1]) - 1, Number(m[2])) : noYear(Number(m[1]) - 1, Number(m[2])))],
    [new RegExp(`${LEAD}\\b${MONTH_RE}\\s+${ORD}(?:,?\\s+(\\d{4}))?\\b`, 'i'), (m) => { const mo = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase()); return m[3] ? valid(Number(m[3]), mo, Number(m[2])) : noYear(mo, Number(m[2])); }],
    [new RegExp(`${LEAD}\\b(?:the\\s+)?${ORD}\\s+(?:of\\s+)?${MONTH_RE}(?:,?\\s+(\\d{4}))?\\b`, 'i'), (m) => { const mo = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase()); return m[3] ? valid(Number(m[3]), mo, Number(m[1])) : noYear(mo, Number(m[1])); }],
    [/\b(today|yesterday|tomorrow)\b/i, (m) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + ({ today: 0, yesterday: -1, tomorrow: 1 } as Record<string, number>)[m[1].toLowerCase()])],
    [/\b(\d{1,3})\s+days?\s+ago\b/i, (m) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - Number(m[1]))],
    [/\b(?:a|1|one)\s+week\s+ago\b|\blast\s+week\b/i, () => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)],
    // Short day names need "on"/"last" in front so names like "Sun Life" stay names.
    [new RegExp(`\\b(?:on|last)\\s+${DAY_RE}\\b|\\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\\b`, 'i'), (m) => { const wd = DAYS.indexOf((m[1] || m[2]).slice(0, 3).toLowerCase()); const back = (today.getDay() - wd + 7) % 7 || 7; return new Date(today.getFullYear(), today.getMonth(), today.getDate() - back); }],
    [/\bon\s+the\s+(\d{1,2})(?:st|nd|rd|th)?\b/i, (m) => { const d = Number(m[1]); const r = valid(today.getFullYear(), today.getMonth(), d); return r && r <= today ? r : valid(today.getFullYear(), today.getMonth() - 1, d) || addMonths(new Date(today.getFullYear(), today.getMonth() - 1, 1), 0); }],
  ];
  for (const [re, fn] of rules) {
    const m = text.match(re);
    if (!m) continue;
    const d = fn(m);
    if (!d) continue;
    return { date: iso(d), text: text.replace(m[0], ' ').replace(/\s+/g, ' ').trim(), label: m[0].trim() };
  }
  return null;
}


// ── Billing words ───────────────────────────────────────────────────────────
// What the line says about billing, typos included ("subcsription", "montly").
// When the line says it, that wins over any guess, the model's included.

function editDistance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

const CADENCE_WORDS: [string, Cadence, number][] = [
  ['weekly', 'weekly', 1], ['wkly', 'weekly', 0],
  ['subscription', 'monthly', 2], ['subscriptions', 'monthly', 2], ['monthly', 'monthly', 1], ['recurring', 'monthly', 2],
  ['annual', 'annual', 1], ['annually', 'annual', 1], ['yearly', 'annual', 1],
];

export function statedCadence(text: string): { cadence: Cadence; words: string[] } | null {
  const t = text.toLowerCase();
  if (/\b(one[- ]?time|once|one[- ]?off)\b/.test(t)) return { cadence: 'once', words: (t.match(/\b(one[- ]?time|once|one[- ]?off)\b/g) || []) };
  if (/\d\s*k?\s*(\/|per\s+|a\s+|every\s+)\s*(wk|week|w)\b|\b(per|a|every)\s+week\b/.test(t)) return { cadence: 'weekly', words: [] };
  if (/\d\s*k?\s*(\/|per\s+|a\s+|every\s+)\s*(yr|year|y)\b|\b(per|a|every)\s+year\b/.test(t)) return { cadence: 'annual', words: [] };
  if (/\d\s*k?\s*(\/|per\s+|a\s+|every\s+)\s*(mo|month|m)\b|\b(per|a|every)\s+month\b/.test(t)) return { cadence: 'monthly', words: [] };
  const words = t.split(/[^a-z]+/).filter(Boolean);
  if (words.some((w) => w === 'sub' || w === 'subs')) return { cadence: 'monthly', words: words.filter((w) => w === 'sub' || w === 'subs') };
  for (const [target, cadence, max] of CADENCE_WORDS) {
    const hits = words.filter((w) => w.length >= target.length - max && editDistance(w, target) <= max);
    if (hits.length) return { cadence, words: hits };
  }
  return null;
}

export function parseQuick(raw: string, now = new Date()): QuickParse | null {
  let s = raw.trim();
  if (!s) return null;
  let kind: Kind = 'expense';
  if (/^\+/.test(s) || /\b(revenue|income|paid us|invoice paid|retainer|client)\b/i.test(s)) kind = 'revenue';
  s = s.replace(/^\+\s*/, '');
  const dt = parseDate(s, now);
  if (dt) s = dt.text;
  const date = dt?.date;
  const am = pickAmount(s);
  if (!am) return { kind, name: s, amount: NaN, cadence: 'once', category: kind === 'revenue' ? 'Project' : 'Software', ...(date ? { date } : {}) };
  let amount = parseFloat(am[1].replace(/,/g, ''));
  if (am[2]) amount *= 1000;
  const unit = (am[3] || '').toLowerCase();
  const said = statedCadence(s);
  const cadence: Cadence = said ? said.cadence : /^(mo|month|monthly|m)$/.test(unit) ? 'monthly' : /^(yr|year|annual|annually|y)$/.test(unit) ? 'annual' : /^(wk|week|weekly|w)$/.test(unit) ? 'weekly' : 'once';
  let name = s.replace(am[0], ' ');
  for (const w of said?.words || []) name = name.replace(new RegExp(`\\b${w.replace(/[^a-z -]/g, '')}\\b`, 'i'), ' ');
  name = name.replace(/\b(one[- ]?(time|off)|once|weekly|wkly|monthly|annual|yearly|subscriptions?|subs?|recurring|revenue|income)\b/gi, '').replace(/\s+/g, ' ').trim();
  // "for frame.io which is for video storage" → "frame.io"
  name = name.replace(/\s+(which|that|it)\s+(is|was|'s)\b.*$/i, '').replace(/^(for|paid|paying|bought|to)\s+/i, '').replace(/\s+(for|to|on)$/i, '').trim();
  if (!name) name = kind === 'revenue' ? 'Revenue' : 'Expense';
  name = name[0].toUpperCase() + name.slice(1);
  let category: string;
  if (kind === 'revenue') category = /retainer|client|monthly/i.test(raw) && cadence !== 'once' ? 'Retainer' : /product|sale|template|shop/i.test(raw) ? 'Product' : cadence === 'once' ? 'Project' : 'Retainer';
  else if (/payroll|salary|salaries|wage|employee|fte|staff/i.test(raw)) category = 'Payroll';
  else if (/contractor|freelanc|invoice|agency|consult|editor|video edit|design work/i.test(raw)) category = 'Contractors';
  else if (/\bads?\b|meta|google|tiktok|spend|campaign|boost/i.test(raw)) category = 'Ad spend';
  else category = 'Software';
  return { kind, name, amount, cadence, category, amountText: am[0].trim(), ...(date ? { date } : {}) };
}

// Sample entries from early versions were saved into real browsers. They are
// recognised by exact name + amount so they can be cleared without touching
// anything the user logged.
const SAMPLE_KEYS = new Set(seed(new Date(2000, 0, 1)).map((e) => `${e.name}|${e.amount}`));
export const isSampleEntry = (e: Pick<Entry, 'name' | 'amount'>) => SAMPLE_KEYS.has(`${e.name}|${e.amount}`);

export interface MonthPoint { label: string; rev: number; exp: number; year: number; month: number }
export interface Renewal extends Entry { next: Date; days: number; nextIso: string; /** Charges inside the 30-day window (weekly entries hit 4–5 times). */ count: number }

// ── Charges ─────────────────────────────────────────────────────────────────
// A ledger entry is a one-off or a recurring plan; a charge is one payment on
// one day. Lists, totals and the P&L are built from charges, so a monthly
// subscription shows up in every month it billed, not only its start month.

export interface Charge { key: string; entry: Entry; date: string; amount: number }

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const plusDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export function chargesIn(entries: Entry[], from: Date, to: Date): Charge[] {
  const lo = day(from), hi = day(to);
  const out: Charge[] = [];
  const push = (e: Entry, d: Date) => { if (d >= lo && d <= hi && (e.cadence === 'once' || isBilling(e, d))) out.push({ key: `${e.id}:${iso(d)}`, entry: e, date: iso(d), amount: e.amount }); };
  for (const e of entries) {
    const start = parse(e.date);
    if (e.cadence === 'once') { push(e, start); continue; }
    if (start > hi) continue;
    if (e.cadence === 'weekly') {
      const skip = Math.max(0, Math.ceil((lo.getTime() - start.getTime()) / (7 * 86400000)));
      for (let d = plusDays(start, skip * 7); d <= hi; d = plusDays(d, 7)) push(e, d);
      continue;
    }
    const step = e.cadence === 'annual' ? 12 : 1;
    const monthsIn = Math.max(0, (lo.getFullYear() - start.getFullYear()) * 12 + lo.getMonth() - start.getMonth());
    for (let k = Math.floor(monthsIn / step) * step; ; k += step) {
      const d = addMonths(start, k);
      if (d > hi) break;
      push(e, d);
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date) || a.entry.name.localeCompare(b.entry.name));
}

export const sumCharges = (cs: Charge[], kind?: Kind) => cs.filter((c) => !kind || c.entry.kind === kind).reduce((a, c) => a + c.amount, 0);

export function byCategory(cs: Charge[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of cs) out[c.entry.category] = (out[c.entry.category] || 0) + c.amount;
  return out;
}

/** Monthly revenue/expense totals from `from`'s month through `to`, cash basis. */
export function monthBuckets(entries: Entry[], from: Date, to: Date): MonthPoint[] {
  const out: MonthPoint[] = [];
  for (let d = new Date(from.getFullYear(), from.getMonth(), 1); d <= to; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const cs = chargesIn(entries, d < from ? from : d, end > to ? to : end);
    out.push({ label: MON[d.getMonth()], rev: sumCharges(cs, 'revenue'), exp: sumCharges(cs, 'expense'), year: d.getFullYear(), month: d.getMonth() });
  }
  return out;
}

// ── Periods ─────────────────────────────────────────────────────────────────

export type PeriodKey = 'month' | 'lastMonth' | '3m' | 'ytd' | '12m' | 'all' | 'custom';
export const PERIOD_LABEL: Record<PeriodKey, string> = { month: 'This month', lastMonth: 'Last month', '3m': '3 months', ytd: 'This year', '12m': '12 months', all: 'All time', custom: 'Custom' };

export interface Period { key: PeriodKey; from: Date; to: Date; label: string; prev: { from: Date; to: Date } | null }

const shiftMonths = (d: Date, n: number) => addMonths(d, n);
const fmtRange = (a: Date, b: Date) => (a.getFullYear() === b.getFullYear() ? `${MON[a.getMonth()]} ${a.getDate()} – ${MON[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}` : `${MON[a.getMonth()]} ${a.getDate()}, ${a.getFullYear()} – ${MON[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}`);

export function periodFor(key: PeriodKey, entries: Entry[], now = new Date(), custom?: { from: string; to: string }): Period {
  const t = day(now), y = t.getFullYear(), m = t.getMonth();
  const calendar = (from: Date, to: Date, months: number, label: string): Period => ({ key, from, to, label, prev: { from: shiftMonths(from, -months), to: shiftMonths(to, -months) } });
  switch (key) {
    case 'month': return calendar(new Date(y, m, 1), t, 1, `${MON[m]} ${y}`);
    case 'lastMonth': { const f = new Date(y, m - 1, 1); return calendar(f, new Date(y, m, 0), 1, `${MON[f.getMonth()]} ${f.getFullYear()}`); }
    case '3m': return calendar(new Date(y, m - 2, 1), t, 3, fmtRange(new Date(y, m - 2, 1), t));
    case 'ytd': return { key, from: new Date(y, 0, 1), to: t, label: `${y} to date`, prev: { from: new Date(y - 1, 0, 1), to: shiftMonths(t, -12) } };
    case '12m': return calendar(new Date(y, m - 11, 1), t, 12, fmtRange(new Date(y, m - 11, 1), t));
    case 'all': {
      const first = entries.reduce((a, e) => (e.date < a ? e.date : a), iso(t));
      const f = parse(first);
      return { key, from: f > t ? t : f, to: t, label: 'All time', prev: null };
    }
    case 'custom': {
      let f = custom?.from ? parse(custom.from) : new Date(y, m, 1), to = custom?.to ? parse(custom.to) : t;
      if (f > to) [f, to] = [to, f];
      const len = Math.round((to.getTime() - f.getTime()) / 86400000) + 1;
      return { key, from: f, to, label: fmtRange(f, to), prev: { from: plusDays(f, -len), to: plusDays(f, -1) } };
    }
  }
}

/** The comparison range, or null when it starts before the first entry (a % change against missing data is noise). */
export function comparable(period: Period, entries: Entry[]): { from: Date; to: Date } | null {
  if (!period.prev || !entries.length) return null;
  const first = entries.reduce((a, e) => (e.date < a ? e.date : a), entries[0].date);
  return period.prev.from >= parse(first) ? period.prev : null;
}

export function metrics(entries: Entry[], now = new Date()) {
  const y = now.getFullYear(), mo = now.getMonth();
  const today = new Date(y, mo, now.getDate());
  // Run rate as of a day. A subscription whose first charge is still ahead
  // (people often enter the next renewal date) is already a commitment today.
  const committed = (e: Entry, at: Date) => (parse(e.date) > at ? at.getTime() === today.getTime() && statusOf(e, today) === 'active' : isBilling(e, at));
  const sumRec = (kind: Kind, at: Date) => entries.filter((e) => e.kind === kind && e.cadence !== 'once' && committed(e, at)).reduce((a, e) => a + monthly(e), 0);
  const endOfMonth = (off: number) => new Date(y, mo + off + 1, 0);
  // Cash basis: each month counts the charges that actually happened in it,
  // through today. Run-rate figures above stay monthly equivalents.
  const series: MonthPoint[] = monthBuckets(entries, new Date(y, mo - 11, 1), today);
  const cur = series[11], prev = series[10];
  const catMonth = byCategory(chargesIn(entries.filter((e) => e.kind === 'expense'), new Date(y, mo, 1), today));
  const subs = entries.filter((e) => e.kind === 'expense' && e.cadence !== 'once');
  const activeSubs = subs.filter((e) => statusOf(e, today) === 'active');
  const pausedSubs = subs.filter((e) => statusOf(e, today) === 'paused');
  const cancelledSubs = subs.filter((e) => statusOf(e, today) === 'cancelled');
  const nextDate = (e: Entry) => {
    let d = parse(e.date);
    if (e.cadence === 'weekly') {
      // Jump straight to the first charge on or after today.
      const weeks = Math.max(0, Math.ceil((today.getTime() - d.getTime()) / (7 * 86400000)));
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + weeks * 7);
    }
    const step = e.cadence === 'annual' ? 12 : 1;
    let guard = 0;
    while (d < today && guard++ < 600) d = addMonths(d, step);
    return d;
  };
  const horizon = new Date(y, mo, now.getDate() + 30);
  const renewals: Renewal[] = entries
    .filter((e) => e.cadence !== 'once' && statusOf(e, today) === 'active')
    .map((e) => ({ ...e, next: nextDate(e) }))
    .filter((r) => r.next <= horizon && isBilling(r, r.next))
    .sort((a, b) => a.next.getTime() - b.next.getTime())
    .map((r) => ({ ...r, nextIso: iso(r.next), days: Math.round((r.next.getTime() - today.getTime()) / 86400000), count: r.cadence === 'weekly' ? Math.floor(((r.endDate && parse(r.endDate) <= horizon ? parse(r.endDate).getTime() - 1 : horizon.getTime()) - r.next.getTime()) / (7 * 86400000)) + 1 : 1 }));
  const thisYear = series.filter((s) => s.year === y);
  return {
    mrr: sumRec('revenue', today), mrrPrev: sumRec('revenue', endOfMonth(-1)),
    burn: sumRec('expense', today), burnPrev: sumRec('expense', endOfMonth(-1)),
    revMonth: cur.rev, expMonth: cur.exp, revPrevMonth: prev.rev, expPrevMonth: prev.exp,
    series, catMonth, activeSubs, pausedSubs, cancelledSubs, renewals, nextDate,
    yearRev: thisYear.reduce((a, s) => a + s.rev, 0), yearExp: thisYear.reduce((a, s) => a + s.exp, 0),
    today,
  };
}

export type Metrics = ReturnType<typeof metrics>;

export function reportFacts(m: Metrics) {
  return [
    `Recurring revenue/mo: ${money(m.mrr)} (prev ${money(m.mrrPrev)})`,
    `Recurring costs/mo: ${money(m.burn)} (prev ${money(m.burnPrev)})`,
    `This month revenue: ${money(m.revMonth)}, expenses: ${money(m.expMonth)}, net: ${money(m.revMonth - m.expMonth)}`,
    `Last month revenue: ${money(m.revPrevMonth)}, expenses: ${money(m.expPrevMonth)}`,
    `Expenses by category this month: ${Object.entries(m.catMonth).map(([k, v]) => `${k} ${money(v)}`).join(', ')}`,
    `Active subscriptions: ${m.activeSubs.length} — ${m.activeSubs.map((e) => `${e.name} ${money(monthly(e))}/mo`).join('; ')}`,
    `Paused subscriptions: ${m.pausedSubs.map((e) => e.name).join('; ') || 'none'}`,
    `Cancelled subscriptions: ${m.cancelledSubs.map((e) => `${e.name} (ended ${e.endDate})`).join('; ') || 'none'}`,
    `Renewals next 30 days: ${m.renewals.map((r) => `${r.name} ${money(r.amount)}${r.count > 1 ? ` ×${r.count} (weekly)` : ''} from ${r.nextIso}`).join('; ') || 'none'}`,
    `Last 6 months (rev/exp): ${m.series.slice(-6).map((x) => `${x.label} ${money(x.rev)}/${money(x.exp)}`).join(', ')}`,
  ].join('\n');
}

// ── Known names ─────────────────────────────────────────────────────────────
// Vendors and sources repeat. Matching ignores case, spacing and punctuation
// ("frame io", "FRAME.IO" → "Frame.io") so one vendor stays one name.

export const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** One entry per distinct name, most recent first. */
export function knownNames(entries: Entry[]): Entry[] {
  const seen = new Set<string>();
  const out: Entry[] = [];
  for (const e of [...entries].sort((a, b) => b.date.localeCompare(a.date))) {
    const k = normName(e.name);
    if (k && !seen.has(k)) { seen.add(k); out.push(e); }
  }
  return out;
}

/** The existing entry this name refers to, if any. */
export function findKnown(name: string, entries: Entry[]): Entry | null {
  const k = normName(name);
  if (k.length < 2) return null;
  return knownNames(entries).find((e) => normName(e.name) === k) || null;
}

/** Names to offer while typing: prefix matches first, then word matches. */
export function suggestNames(query: string, entries: Entry[], limit = 5): Entry[] {
  const q = normName(query);
  if (q.length < 2) return [];
  const known = knownNames(entries).filter((e) => normName(e.name) !== q);
  const prefix = known.filter((e) => normName(e.name).startsWith(q));
  const words = known.filter((e) => !prefix.includes(e) && e.name.toLowerCase().split(/[^a-z0-9]+/).some((w) => w.length > 1 && normName(w).startsWith(q)));
  return [...prefix, ...words].slice(0, limit);
}

// ── Status commands in quick-add ────────────────────────────────────────────
// "cancel frame.io", "pause figma", "resume figma", "cancel netflix on oct 1".

export type StatusVerb = 'pause' | 'resume' | 'cancel' | 'restore';
const VERBS: [RegExp, StatusVerb][] = [
  [/^(cancel(?:l?ed)?|stop(?:ped)?|end(?:ed)?|unsubscribe(?:d)?)$/i, 'cancel'],
  [/^(pause[d]?|hold)$/i, 'pause'],
  [/^(resume[d]?|unpause[d]?|restart(?:ed)?)$/i, 'resume'],
  [/^(restore[d]?|reactivate[d]?)$/i, 'restore'],
];

export function parseCommand(text: string, entries: Entry[], now = new Date()): { verb: StatusVerb; word: string; rest: string; date: string; entry: Entry | null } | null {
  const m = text.trim().match(/^([a-z]+)\s+(.+)$/i);
  if (!m) return null;
  const verb = VERBS.find(([re]) => re.test(m[1]))?.[1];
  if (!verb) return null;
  const dt = parseDate(m[2], now);
  const rest = (dt ? dt.text : m[2]).replace(/\$?\d[\d,.]*\s*(\/\s*\w+)?/g, ' ').replace(/\b(subscription|sub|plan|membership)\b/gi, ' ').replace(/\s+/g, ' ').trim();
  const recurring = entries.filter((e) => e.cadence !== 'once');
  const exact = recurring.filter((e) => normName(e.name) === normName(rest));
  const pool = exact.length ? exact : rest.length >= 2 ? recurring.filter((e) => normName(e.name).startsWith(normName(rest))) : [];
  // Prefer the one the verb applies to (e.g. a paused one for "resume").
  const status = (e: Entry) => statusOf(e, now);
  const fits = (e: Entry) => (verb === 'cancel' || verb === 'pause' ? status(e) === 'active' || (verb === 'cancel' && status(e) === 'paused') : verb === 'resume' ? status(e) !== 'active' : status(e) === 'cancelled');
  const entry = pool.find(fits) || (pool.length === 1 ? pool[0] : null);
  return { verb, word: m[1], rest, date: dt?.date || iso(now), entry };
}
