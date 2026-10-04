// Ledger domain: entry model, quick-add parser, and the monthly metrics every
// view reads from. Pure functions — no React, no storage.

export type Kind = 'expense' | 'revenue';
export type Cadence = 'once' | 'monthly' | 'annual';

export interface Entry {
  id: string;
  kind: Kind;
  name: string;
  amount: number;
  category: string;
  cadence: Cadence;
  /** ISO yyyy-mm-dd. For recurring entries, the first charge. */
  date: string;
  active: boolean;
}

export const EXP_CATS = ['Payroll', 'Contractors', 'Software', 'Ad spend'];
export const REV_CATS = ['Retainer', 'Project', 'Product'];
export const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const CAD_LABEL: Record<Cadence, string> = { once: 'One-time', monthly: 'Monthly', annual: 'Annual' };

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
export const monthly = (e: Pick<Entry, 'cadence' | 'amount'>) => (e.cadence === 'monthly' ? e.amount : e.cadence === 'annual' ? e.amount / 12 : 0);
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

const AMOUNT_RE = /(\$)?\s*(\d[\d,]*(?:\.\d{1,2})?)\s*(k)?\s*(?:\/|per\s+|a\s+|every\s+)?\s*(mo|month|monthly|m|yr|year|annual|annually|y)?\b/gi;

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
  let cadence: Cadence = 'once';
  const unit = (am[3] || '').toLowerCase();
  if (/^(mo|month|monthly|m)$/.test(unit) || /\b(monthly|subscription|sub)\b/i.test(s)) cadence = 'monthly';
  if (/^(yr|year|annual|annually|y)$/.test(unit) || /\b(annual|yearly)\b/i.test(s)) cadence = 'annual';
  let name = s.replace(am[0], ' ').replace(/\b(one[- ]?time|once|monthly|annual|yearly|subscription|sub|revenue|income)\b/gi, '').replace(/\s+/g, ' ').trim();
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
export interface Renewal extends Entry { next: Date; days: number; nextIso: string }

export function metrics(entries: Entry[], now = new Date()) {
  const y = now.getFullYear(), mo = now.getMonth();
  const today = new Date(y, mo, now.getDate());
  const activeAt = (e: Entry, at: Date) => e.active !== false && parse(e.date) <= at;
  const sumRec = (kind: Kind, at: Date) => entries.filter((e) => e.kind === kind && e.cadence !== 'once' && activeAt(e, at)).reduce((a, e) => a + monthly(e), 0);
  const endOfMonth = (off: number) => new Date(y, mo + off + 1, 0);
  const valueIn = (e: Entry) => (e.cadence === 'once' ? e.amount : monthly(e));
  // Monthly series: one-offs land in their date's month; recurring entries add
  // their monthly amount each month from their start (annual spread /12).
  const series: MonthPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(y, mo - i, 1), eom = endOfMonth(-i);
    const inMonth = (e: Entry) => { const p = parse(e.date); return p.getFullYear() === d.getFullYear() && p.getMonth() === d.getMonth(); };
    const counts = (e: Entry) => (e.cadence === 'once' && inMonth(e)) || (e.cadence !== 'once' && activeAt(e, eom));
    const rev = entries.filter((e) => e.kind === 'revenue' && counts(e)).reduce((a, e) => a + valueIn(e), 0);
    const exp = entries.filter((e) => e.kind === 'expense' && counts(e)).reduce((a, e) => a + valueIn(e), 0);
    series.push({ label: MON[d.getMonth()], rev, exp, year: d.getFullYear(), month: d.getMonth() });
  }
  const cur = series[11], prev = series[10];
  const catMonth: Record<string, number> = {};
  entries
    .filter((e) => e.kind === 'expense' && ((e.cadence === 'once' && parse(e.date).getFullYear() === y && parse(e.date).getMonth() === mo) || (e.cadence !== 'once' && activeAt(e, endOfMonth(0)))))
    .forEach((e) => { catMonth[e.category] = (catMonth[e.category] || 0) + valueIn(e); });
  const subs = entries.filter((e) => e.kind === 'expense' && e.cadence !== 'once');
  const activeSubs = subs.filter((e) => e.active !== false), pausedSubs = subs.filter((e) => e.active === false);
  const nextDate = (e: Entry) => {
    let d = parse(e.date);
    const step = e.cadence === 'annual' ? 12 : 1;
    let guard = 0;
    while (d < today && guard++ < 600) d = addMonths(d, step);
    return d;
  };
  const horizon = new Date(y, mo, now.getDate() + 30);
  const renewals: Renewal[] = entries
    .filter((e) => e.cadence !== 'once' && e.active !== false)
    .map((e) => ({ ...e, next: nextDate(e) }))
    .filter((r) => r.next <= horizon)
    .sort((a, b) => a.next.getTime() - b.next.getTime())
    .map((r) => ({ ...r, nextIso: iso(r.next), days: Math.round((r.next.getTime() - today.getTime()) / 86400000) }));
  const thisYear = series.filter((s) => s.year === y);
  return {
    mrr: sumRec('revenue', today), mrrPrev: sumRec('revenue', endOfMonth(-1)),
    burn: sumRec('expense', today), burnPrev: sumRec('expense', endOfMonth(-1)),
    revMonth: cur.rev, expMonth: cur.exp, revPrevMonth: prev.rev, expPrevMonth: prev.exp,
    series, catMonth, activeSubs, pausedSubs, renewals, nextDate,
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
    `Renewals next 30 days: ${m.renewals.map((r) => `${r.name} ${money(r.amount)} on ${r.nextIso}`).join('; ') || 'none'}`,
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
