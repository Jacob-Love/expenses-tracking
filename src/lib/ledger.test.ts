import { describe, expect, it } from 'vitest';
import { addMonths, findKnown, parseDate, statedCadence, isSampleEntry, iso, metrics, parseQuick, seed, suggestNames, type Entry } from './ledger.ts';

describe('parseQuick', () => {
  it('reads a monthly software subscription', () => {
    expect(parseQuick('Design tool 24/mo')).toEqual({ kind: 'expense', name: 'Design tool', amount: 24, cadence: 'monthly', category: 'Software', amountText: '24/mo' });
  });
  it('treats a leading + as revenue and /mo as a retainer', () => {
    expect(parseQuick('+Retainer client 02 4500/mo')).toMatchObject({ kind: 'revenue', amount: 4500, cadence: 'monthly', category: 'Retainer' });
  });
  it('routes contractor invoices to Contractors, one-time', () => {
    expect(parseQuick('Contractor invoice 1800')).toMatchObject({ kind: 'expense', amount: 1800, cadence: 'once', category: 'Contractors' });
  });
  it('handles k suffix, commas and annual cadence', () => {
    expect(parseQuick('Analytics 1.2k/yr')).toMatchObject({ amount: 1200, cadence: 'annual' });
    expect(parseQuick('Payroll $21,400 monthly')).toMatchObject({ amount: 21400, cadence: 'monthly', category: 'Payroll' });
  });
  it('picks the amount, not a label number or a year', () => {
    expect(parseQuick('Retainer client 02 4500')).toMatchObject({ amount: 4500, name: 'Retainer client 02' });
    expect(parseQuick('Hosting 212 for 3 servers')).toMatchObject({ amount: 212 });
    expect(parseQuick('Meta ads 2026 300')).toMatchObject({ amount: 300 });
    expect(parseQuick('3 seats $90/mo')).toMatchObject({ amount: 90, cadence: 'monthly' });
  });
  it('returns NaN amount when none is present and null for empty input', () => {
    expect(parseQuick('coffee')!.amount).toBeNaN();
    expect(parseQuick('   ')).toBeNull();
  });
  it('strips filler from the name and does not call storage a contractor', () => {
    expect(parseQuick('For frame.io which is for video storage 15')).toMatchObject({ name: 'Frame.io', amount: 15, category: 'Software' });
    expect(parseQuick('Video editor 900')).toMatchObject({ category: 'Contractors' });
  });
  it('recognises sample entries by name and amount only', () => {
    expect(seed().every(isSampleEntry)).toBe(true);
    expect(isSampleEntry({ name: 'Cloud hosting', amount: 99 })).toBe(false);
    expect(isSampleEntry({ name: 'Frame.io', amount: 15 })).toBe(false);
  });
});

describe('addMonths', () => {
  it('clamps to the end of shorter months', () => {
    expect(iso(addMonths(new Date(2026, 0, 31), 1))).toBe('2026-02-28');
  });
});

describe('metrics', () => {
  const now = new Date(2026, 9, 3); // Oct 3 2026
  const e = (p: Partial<Entry>): Entry => ({ id: Math.random().toString(36), kind: 'expense', name: 'x', amount: 100, category: 'Software', cadence: 'once', date: '2026-10-01', active: true, ...p });

  it('counts recurring amounts monthly and spreads annual /12', () => {
    const m = metrics([
      e({ cadence: 'monthly', amount: 50, date: '2026-01-05' }),
      e({ cadence: 'annual', amount: 1200, date: '2026-03-10' }),
      e({ kind: 'revenue', category: 'Retainer', cadence: 'monthly', amount: 1000, date: '2026-02-01' }),
    ], now);
    expect(m.burn).toBe(150);
    expect(m.mrr).toBe(1000);
    expect(m.expMonth).toBe(150);
  });

  it('drops paused entries from the run rate', () => {
    const m = metrics([e({ cadence: 'monthly', amount: 50, date: '2026-01-05', active: false })], now);
    expect(m.burn).toBe(0);
    expect(m.pausedSubs).toHaveLength(1);
  });

  it('puts one-offs in their own month only', () => {
    const m = metrics([e({ amount: 300, date: '2026-09-15' })], now);
    expect(m.expPrevMonth).toBe(300);
    expect(m.expMonth).toBe(0);
  });

  it('projects renewals inside the 30-day window', () => {
    const m = metrics([e({ cadence: 'monthly', amount: 20, date: '2026-05-20' }), e({ cadence: 'annual', amount: 999, date: '2025-12-01' })], now);
    expect(m.renewals.map((r) => r.nextIso)).toEqual(['2026-10-20']);
    expect(m.renewals[0].days).toBe(17);
  });
});

describe('known names', () => {
  const mk = (name: string, date: string, category = 'Software'): Entry => ({ id: name + date, kind: 'expense', name, amount: 10, category, cadence: 'monthly', date, active: true });
  const entries = [mk('Frame.io', '2026-09-01'), mk('Figma', '2026-08-01'), mk('Meta ads — Sep', '2026-09-30', 'Ad spend'), mk('frame io', '2026-01-01')];

  it('matches regardless of case, spacing and punctuation, preferring the latest spelling', () => {
    expect(findKnown('FRAME IO', entries)?.name).toBe('Frame.io');
    expect(findKnown('frameio', entries)?.name).toBe('Frame.io');
    expect(findKnown('Frames', entries)).toBeNull();
  });
  it('suggests prefix matches first, then word matches, without duplicates', () => {
    expect(suggestNames('f', entries)).toEqual([]);
    expect(suggestNames('fr', entries).map((e) => e.name)).toEqual(['Frame.io']);
    expect(suggestNames('fi', entries).map((e) => e.name)).toEqual(['Figma']);
    expect(suggestNames('ads', entries).map((e) => e.name)).toEqual(['Meta ads — Sep']);
    expect(suggestNames('frame.io', entries)).toEqual([]);
  });
});

describe('dates in quick-add', () => {
  const now = new Date(2026, 9, 4); // Sun Oct 4 2026
  const q = (t: string) => parseQuick(t, now)!;
  it('reads relative dates', () => {
    expect(q('Figma 45 yesterday')).toMatchObject({ date: '2026-10-03', amount: 45, name: 'Figma' });
    expect(q('Lunch 30 3 days ago').date).toBe('2026-10-01');
    expect(q('Hosting 212 last friday').date).toBe('2026-10-02');
    expect(q('Hosting 212 on fri').date).toBe('2026-10-02');
    expect(q('Hosting 212 on the 1st').date).toBe('2026-10-01');
  });
  it('reads calendar dates and keeps them out of the amount', () => {
    expect(q('Figma 12 on 10/28')).toMatchObject({ amount: 12, date: '2026-10-28', name: 'Figma' });
    expect(q('Figma 12 on 12/15').date).toBe('2025-12-15');
    expect(q('Figma 12 on 9/28')).toMatchObject({ amount: 12, date: '2026-09-28' });
    expect(q('Meta ads 300 oct 2')).toMatchObject({ amount: 300, date: '2026-10-02', name: 'Meta ads' });
    expect(q('Meta ads 300 2nd of September').date).toBe('2026-09-02');
    expect(q('Audit 3200 2026-03-05').date).toBe('2026-03-05');
    expect(q('Audit 3200 3/5/25').date).toBe('2025-03-05');
  });
  it('leaves lines without dates alone', () => {
    expect(q('Sun Life insurance 90/mo')).toMatchObject({ name: 'Sun Life insurance', amount: 90 });
    expect(q('Sun Life insurance 90/mo').date).toBeUndefined();
    expect(q('24/7 support 30').amount).toBe(30);
    expect(parseDate('Frame.io 15/mo', now)).toBeNull();
  });
  it('drops cadence words from the name', () => {
    expect(q('frame.io 40 one-time')).toMatchObject({ name: 'Frame.io', cadence: 'once' });
  });
});

describe('billing words', () => {
  it('reads subscription and typos as monthly and strips them from the name', () => {
    expect(parseQuick('Frame.io subscription 15')).toMatchObject({ name: 'Frame.io', cadence: 'monthly' });
    expect(parseQuick('frame.io subcsription 15')).toMatchObject({ name: 'Frame.io', cadence: 'monthly' });
    expect(parseQuick('Notion montly 10')).toMatchObject({ name: 'Notion', cadence: 'monthly' });
    expect(parseQuick('Analytics anual 1188')).toMatchObject({ name: 'Analytics', cadence: 'annual' });
  });
  it('does not mistake look-alike words', () => {
    expect(statedCadence('Subcontractor invoice 900')).toBeNull();
    expect(statedCadence('Subway lunch 12')).toBeNull();
    expect(parseQuick('Subcontractor invoice 900')).toMatchObject({ cadence: 'once', category: 'Contractors' });
  });
  it('one-time wins and units still work', () => {
    expect(statedCadence('figma subscription 40 one-time')?.cadence).toBe('once');
    expect(statedCadence('figma 40/mo')?.cadence).toBe('monthly');
    expect(statedCadence('figma 400 per year')?.cadence).toBe('annual');
    expect(statedCadence('figma 40')).toBeNull();
  });
});
