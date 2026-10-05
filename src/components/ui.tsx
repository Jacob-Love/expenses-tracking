// Small shared pieces of the Ledger layout (card shells, chips, table rows).

import type { CSSProperties, ReactNode } from 'react';
import { Repeat, Trash2 } from 'lucide-react';
import { CAD_LABEL, PERIOD_LABEL, dateLabel, iso, money2, statusOf, type Charge, type Entry, type Period, type PeriodKey } from '../lib/ledger.ts';

export const cardLit: CSSProperties = { position: 'relative', overflow: 'hidden', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface-2)', backgroundImage: 'radial-gradient(130% 130% at 0% 0%, rgba(255,255,255,0.05), transparent 55%)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)', minWidth: 0 };
export const cardFlat: CSSProperties = { position: 'relative', overflow: 'hidden', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface-2)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)' };
export const h2: CSSProperties = { margin: 0, fontSize: 16, lineHeight: '24px', fontWeight: 600, letterSpacing: '-0.01em', color: '#EDEDED' };
export const colHead: CSSProperties = { fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 };
export const fieldLabel: CSSProperties = { fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600 };
export const input: CSSProperties = { height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'var(--surface-4)', color: '#F3F4F6', fontSize: 14, outline: 'none' };
export const mono: CSSProperties = { fontFamily: 'var(--font-mono-app)' };

export function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} style={{ height: 30, padding: '0 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: `1px solid ${active ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: active ? 'rgba(99,102,241,0.16)' : 'var(--surface-2)', color: active ? '#C7D2FE' : '#9CA3AF', transition: 'all .12s' }}>
      {label}
    </button>
  );
}

export function DeleteButton({ onClick, style }: { onClick: () => void; style?: CSSProperties }) {
  return (
    <button type="button" className="del-btn" onClick={(e) => { e.stopPropagation(); onClick(); }} title="Delete" aria-label="Delete" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 0, background: 'transparent', color: '#4B5563', cursor: 'pointer', ...style }}>
      <Trash2 size={14} />
    </button>
  );
}

export const signed = (e: Entry) => (e.kind === 'revenue' ? '+' : '−') + money2(e.amount);

const LEDGER_COLS = 'minmax(180px,2fr) 1fr 1fr 1fr 120px 40px';

export function LedgerTable({ head, rows, onEdit, onRemove, empty, revenue }: { head: string; rows: Entry[]; onEdit: (e: Entry) => void; onRemove: (id: string) => void; empty: ReactNode; revenue?: boolean }) {
  return (
    <div style={{ minWidth: 700 }}>
      <div style={{ display: 'grid', gridTemplateColumns: LEDGER_COLS, gap: 12, padding: '12px 20px 8px', ...colHead, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span>{head}</span><span>Category</span><span>Date</span><span>Type</span><span style={{ textAlign: 'right' }}>Amount</span><span />
      </div>
      {rows.map((e) => (
        <div key={e.id} className="row-hover" style={{ display: 'grid', gridTemplateColumns: LEDGER_COLS, gap: 12, padding: '10px 20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background-color .12s' }}>
          <button type="button" onClick={() => onEdit(e)} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, cursor: 'pointer', border: 0, background: 'transparent', padding: 0, font: 'inherit', textAlign: 'left' }}>
            <span style={{ color: '#E5E7EB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</span>
            {e.cadence !== 'once' && statusOf(e) !== 'active' && <span style={{ ...mono, fontSize: 10, letterSpacing: 1, color: 'var(--text-4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '0 6px' }}>{statusOf(e).toUpperCase()}</span>}
          </button>
          <span style={{ color: '#9CA3AF', fontSize: 13 }}>{e.category}</span>
          <span style={{ color: '#9CA3AF', fontSize: 12, ...mono }}>{dateLabel(e.date)}</span>
          <span style={{ color: '#9CA3AF', fontSize: 13 }}>{CAD_LABEL[e.cadence]}</span>
          <span style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: revenue ? 'var(--ok)' : '#EDEDED' }}>{signed(e)}</span>
          <DeleteButton onClick={() => onRemove(e.id)} style={{ justifySelf: 'end' }} />
        </div>
      ))}
      {!rows.length && empty}
    </div>
  );
}

export function TableFooter({ count, total }: { count: string; total: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', fontSize: 12, color: '#6B7280' }}>
      <span>{count}</span>
      <span>Total <span style={{ color: '#fff', fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{total}</span></span>
    </div>
  );
}

/** One row per payment. Recurring rows open their plan; only one-offs can be deleted from here. */
export function ChargeTable({ head, rows, onEdit, onRemove, empty, revenue }: { head: string; rows: Charge[]; onEdit: (e: Entry) => void; onRemove: (id: string) => void; empty: ReactNode; revenue?: boolean }) {
  return (
    <div style={{ minWidth: 700 }}>
      <div style={{ display: 'grid', gridTemplateColumns: LEDGER_COLS, gap: 12, padding: '12px 20px 8px', ...colHead, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span>{head}</span><span>Category</span><span>Date</span><span>Type</span><span style={{ textAlign: 'right' }}>Amount</span><span />
      </div>
      {rows.map((c) => {
        const e = c.entry, recurring = e.cadence !== 'once';
        return (
          <div key={c.key} className="row-hover" style={{ display: 'grid', gridTemplateColumns: LEDGER_COLS, gap: 12, padding: '10px 20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background-color .12s' }}>
            <button type="button" onClick={() => onEdit(e)} title={recurring ? `Open the ${CAD_LABEL[e.cadence].toLowerCase()} plan` : undefined} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, cursor: 'pointer', border: 0, background: 'transparent', padding: 0, font: 'inherit', textAlign: 'left' }}>
              <span style={{ color: '#E5E7EB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</span>
              {recurring && <span aria-hidden="true" style={{ color: '#4B5563', display: 'inline-flex', flexShrink: 0 }}><Repeat size={12} /></span>}
            </button>
            <span style={{ color: '#9CA3AF', fontSize: 13 }}>{e.category}</span>
            <span style={{ color: '#9CA3AF', fontSize: 12, ...mono }}>{dateLabel(c.date)}</span>
            <span style={{ color: '#9CA3AF', fontSize: 13 }}>{CAD_LABEL[e.cadence]}</span>
            <span style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: revenue ? 'var(--ok)' : '#EDEDED' }}>{(revenue ? '+' : '−') + money2(c.amount)}</span>
            {recurring ? <span /> : <DeleteButton onClick={() => onRemove(e.id)} style={{ justifySelf: 'end' }} />}
          </div>
        );
      })}
      {!rows.length && empty}
    </div>
  );
}

const PERIOD_KEYS: PeriodKey[] = ['month', 'lastMonth', '3m', 'ytd', '12m', 'all', 'custom'];

export function PeriodPicker({ period, custom, onChange }: { period: Period; custom: { from: string; to: string }; onChange: (key: PeriodKey, custom?: { from: string; to: string }) => void }) {
  const dateInput: CSSProperties = { ...input, height: 30, fontSize: 12, padding: '0 8px', colorScheme: 'dark', ...mono };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Date range">
      {PERIOD_KEYS.map((k) => <Chip key={k} label={PERIOD_LABEL[k]} active={period.key === k} onClick={() => onChange(k, k === 'custom' ? (custom.from ? custom : { from: iso(period.from), to: iso(period.to) }) : undefined)} />)}
      {period.key === 'custom' && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="date" aria-label="From date" value={custom.from} max={custom.to || undefined} onChange={(e) => onChange('custom', { ...custom, from: e.target.value })} style={dateInput} />
          <span style={{ color: '#6B7280', fontSize: 12 }}>to</span>
          <input type="date" aria-label="To date" value={custom.to} min={custom.from || undefined} onChange={(e) => onChange('custom', { ...custom, to: e.target.value })} style={dateInput} />
        </span>
      )}
      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6B7280', ...mono }}>{period.label}</span>
    </div>
  );
}
