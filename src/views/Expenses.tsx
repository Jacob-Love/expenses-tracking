import { CreditCard, Search } from 'lucide-react';
import { EmptyState, KpiCard } from '../components/ds.tsx';
import { Chip, LedgerTable, TableFooter, cardFlat } from '../components/ui.tsx';
import { money, money2, pct, type Entry, type Metrics } from '../lib/ledger.ts';

export interface ExpenseFilters { cat: string; cad: string; search: string }

export function Expenses({ entries, m, cats, filters, setFilters, onEdit, onRemove }: {
  entries: Entry[]; m: Metrics; cats: string[]; filters: ExpenseFilters; setFilters: (f: Partial<ExpenseFilters>) => void; onEdit: (e: Entry) => void; onRemove: (id: string) => void;
}) {
  const q = filters.search.trim().toLowerCase();
  const all = entries.filter((e) => e.kind === 'expense');
  const rows = all
    .filter((e) => (filters.cat === 'All' || e.category === filters.cat) && (filters.cad === 'All' || (filters.cad === 'Recurring' ? e.cadence !== 'once' : e.cadence === 'once')) && (!q || e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)))
    .sort((a, b) => b.date.localeCompare(a.date));
  const top = Object.entries(m.catMonth).sort((a, b) => b[1] - a[1])[0];
  const ser = m.series, year = m.today.getFullYear();

  return (
    <section data-screen-label="Expenses" className="fade-up" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <KpiCard label="Spent this month" value={money(m.expMonth)} changePercent={pct(m.expMonth, m.expPrevMonth)} prevValue={money(m.expPrevMonth)} invertColor sparkData={ser.map((s) => s.exp)} />
        <KpiCard label="Spent this year" value={money(m.yearExp)} sparkData={ser.filter((s) => s.year === year).map((s) => s.exp)} />
        <KpiCard label="Largest category" value={top ? top[0] : '—'} prevValue={top && m.expMonth ? `${Math.round((top[1] / m.expMonth) * 100)}% of this month` : ''} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', ...cats].map((c) => <Chip key={c} label={c} active={filters.cat === c} onClick={() => setFilters({ cat: c })} />)}
        <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        {['All', 'Recurring', 'One-time'].map((c) => <Chip key={c} label={c} active={filters.cad === c} onClick={() => setFilters({ cad: c })} />)}
        <span style={{ flex: 1 }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, padding: '0 10px', borderRadius: 8, background: 'var(--surface-3)', border: '1px solid rgba(255,255,255,0.06)', minWidth: 200 }}>
          <span style={{ color: '#6B7280', display: 'inline-flex' }}><Search size={14} /></span>
          <input value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} placeholder="Search expenses" aria-label="Search expenses" style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', color: '#D1D5DB', fontSize: 13, minWidth: 0 }} />
        </label>
      </div>

      <div style={cardFlat}>
        <div style={{ overflowX: 'auto' }}>
          <LedgerTable head="Name" rows={rows} onEdit={onEdit} onRemove={onRemove} empty={<EmptyState icon={<CreditCard size={20} />} title="No expenses match" hint="Clear a filter, or add a one-time charge or subscription with Add entry." />} />
          <div style={{ minWidth: 700 }}>
            <TableFooter count={`${rows.length} of ${all.length}`} total={money2(rows.reduce((a, e) => a + e.amount, 0))} />
          </div>
        </div>
      </div>
    </section>
  );
}
