import { CreditCard, Search } from 'lucide-react';
import { EmptyState, KpiCard } from '../components/ds.tsx';
import { ChargeTable, Chip, TableFooter, cardFlat } from '../components/ui.tsx';
import { byCategory, chargesIn, comparable, money, money2, monthBuckets, pct, sumCharges, type Entry, type Period } from '../lib/ledger.ts';

export interface ExpenseFilters { cat: string; cad: string; search: string }

export function Expenses({ entries, period, cats, filters, setFilters, onEdit, onRemove }: {
  entries: Entry[]; period: Period; cats: string[]; filters: ExpenseFilters; setFilters: (f: Partial<ExpenseFilters>) => void; onEdit: (e: Entry) => void; onRemove: (id: string) => void;
}) {
  const q = filters.search.trim().toLowerCase();
  const expenses = entries.filter((e) => e.kind === 'expense');
  const all = chargesIn(expenses, period.from, period.to);
  const rows = all.filter(({ entry: e }) => (filters.cat === 'All' || e.category === filters.cat) && (filters.cad === 'All' || (filters.cad === 'Recurring' ? e.cadence !== 'once' : e.cadence === 'once')) && (!q || e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)));
  const spent = sumCharges(all);
  const cmp = comparable(period, entries);
  const prevSpent = cmp ? sumCharges(chargesIn(expenses, cmp.from, cmp.to)) : null;
  const recurring = sumCharges(all.filter((c) => c.entry.cadence !== 'once'));
  const top = Object.entries(byCategory(all)).sort((a, b) => b[1] - a[1])[0];
  const spark = monthBuckets(expenses, period.from, period.to).map((s) => s.exp);
  const filtered = filters.cat !== 'All' || filters.cad !== 'All' || !!q;

  return (
    <section data-screen-label="Expenses" className="fade-up" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <KpiCard label={`Spent · ${period.label}`} value={money(spent)} changePercent={prevSpent === null ? null : pct(spent, prevSpent)} prevValue={prevSpent === null ? undefined : money(prevSpent)} invertColor sparkData={spark.length > 1 ? spark : []} />
        <KpiCard label="Recurring" value={money(recurring)} note={spent ? `${Math.round((recurring / spent) * 100)}% of spend · ${money(spent - recurring)} one-time` : ''} />
        <KpiCard label="Largest category" value={top ? top[0] : '—'} note={top && spent ? `${money(top[1])} · ${Math.round((top[1] / spent) * 100)}% of spend` : ''} />
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
          <ChargeTable head="Name" rows={rows} onEdit={onEdit} onRemove={onRemove} empty={<EmptyState icon={<CreditCard size={20} />} title={filtered ? 'No expenses match' : `Nothing went out · ${period.label}`} hint={filtered ? 'Clear a filter or pick a wider date range.' : 'Pick a wider date range, or log a charge in the bar above.'} />} />
          <div style={{ minWidth: 700 }}>
            <TableFooter count={`${rows.length} ${rows.length === 1 ? 'charge' : 'charges'}${filtered ? ` of ${all.length}` : ''} · ${period.label}`} total={money2(sumCharges(rows))} />
          </div>
        </div>
      </div>
    </section>
  );
}
