import { describe, expect, it } from 'vitest';
import { addMonths, iso, metrics, parseQuick, rulesConfident, type Entry } from './ledger.ts';

describe('parseQuick', () => {
  it('reads a monthly software subscription', () => {
    expect(parseQuick('Design tool 24/mo')).toEqual({ kind: 'expense', name: 'Design tool', amount: 24, cadence: 'monthly', category: 'Software' });
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
  it('flags lines the rules cannot place', () => {
    expect(rulesConfident('Meta ads 300')).toBe(true);
    expect(rulesConfident('Office chairs 640')).toBe(false);
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
