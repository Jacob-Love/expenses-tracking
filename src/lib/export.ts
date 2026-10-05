// CSV exports for a period: a P&L statement and the transaction list.
// Opens cleanly in Excel, Numbers and Google Sheets.

import { CAD_LABEL, MON, byCategory, chargesIn, iso, monthBuckets, sumCharges, type Entry, type Period } from './ledger.ts';

// Quote every text cell; neutralise leading = + - @ so a vendor name can't run
// as a spreadsheet formula.
const text = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
const num = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
const toCsv = (rows: (string | number)[][]) => rows.map((r) => r.map((c) => (typeof c === 'number' ? num(c) : text(c))).join(',')).join('\r\n') + '\r\n';

export function pnlCsv(entries: Entry[], period: Period, now = new Date()): string {
  const cs = chargesIn(entries, period.from, period.to);
  const rev = cs.filter((c) => c.entry.kind === 'revenue'), exp = cs.filter((c) => c.entry.kind === 'expense');
  const months = monthBuckets(entries, period.from, period.to);
  const cats = (r: Record<string, number>) => Object.entries(r).sort((a, b) => b[1] - a[1]);
  const totalRev = sumCharges(rev), totalExp = sumCharges(exp);
  const rows: (string | number)[][] = [
    ['Profit & loss', period.label],
    ['Period', `${iso(period.from)} to ${iso(period.to)}`],
    ['Generated', iso(now)],
    ['Basis', 'Cash: charges dated in the period, through the period end'],
    [],
    ['Month', 'Revenue', 'Expenses', 'Net'],
    ...months.map((m) => [`${MON[m.month]} ${m.year}`, m.rev, m.exp, m.rev - m.exp]),
    ['Total', totalRev, totalExp, totalRev - totalExp],
    [],
    ['Revenue by category', 'Amount'],
    ...cats(byCategory(rev)).map(([k, v]) => [k, v]),
    ['Total revenue', totalRev],
    [],
    ['Expenses by category', 'Amount'],
    ...cats(byCategory(exp)).map(([k, v]) => [k, v]),
    ['Total expenses', totalExp],
    [],
    ['Net profit', totalRev - totalExp],
  ];
  return toCsv(rows);
}

export function transactionsCsv(entries: Entry[], period: Period): string {
  const cs = chargesIn(entries, period.from, period.to).sort((a, b) => a.date.localeCompare(b.date) || a.entry.name.localeCompare(b.entry.name));
  return toCsv([
    ['Date', 'Type', 'Name', 'Category', 'Billing', 'Amount', 'Signed amount'],
    ...cs.map((c) => [c.date, c.entry.kind === 'revenue' ? 'Revenue' : 'Expense', c.entry.name, c.entry.category, CAD_LABEL[c.entry.cadence], c.amount, c.entry.kind === 'revenue' ? c.amount : -c.amount]),
  ]);
}

export function download(filename: string, csv: string) {
  // BOM so Excel reads UTF-8 (em dashes, accents) correctly.
  const url = URL.createObjectURL(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const exportName = (kind: string, period: Period) => `ledger-${kind}-${iso(period.from)}-to-${iso(period.to)}.csv`;
