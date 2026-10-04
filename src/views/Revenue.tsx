import { TrendingUp } from 'lucide-react';
import { EmptyState, KpiCard } from '../components/ds.tsx';
import { Chip, LedgerTable, TableFooter, cardFlat } from '../components/ui.tsx';
import { money, money2, parse, pct, type Entry, type Metrics } from '../lib/ledger.ts';

export function Revenue({ entries, m, filter, setFilter, onEdit, onRemove }: {
  entries: Entry[]; m: Metrics; filter: string; setFilter: (f: string) => void; onEdit: (e: Entry) => void; onRemove: (id: string) => void;
}) {
  const all = entries.filter((e) => e.kind === 'revenue');
  const rows = all.filter((e) => filter === 'All' || (filter === 'Recurring' ? e.cadence !== 'once' : e.cadence === 'once')).sort((a, b) => b.date.localeCompare(a.date));
  const year = m.today.getFullYear(), ser = m.series;
  const onceYear = all.filter((e) => e.cadence === 'once' && parse(e.date).getFullYear() === year).reduce((a, e) => a + e.amount, 0);

  return (
    <section data-screen-label="Revenue" className="fade-up" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <KpiCard label="Recurring revenue / mo" value={money(m.mrr)} changePercent={pct(m.mrr, m.mrrPrev)} prevValue={money(m.mrrPrev)} sparkData={ser.map((s) => s.rev)} />
        <KpiCard label="Earned this month" value={money(m.revMonth)} changePercent={pct(m.revMonth, m.revPrevMonth)} prevValue={money(m.revPrevMonth)} sparkData={ser.map((s) => s.rev)} />
        <KpiCard label="Earned this year" value={money(m.yearRev)} prevValue={`${money(onceYear)} one-time`} sparkData={ser.filter((s) => s.year === year).map((s) => s.rev)} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'Recurring', 'One-time'].map((c) => <Chip key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />)}
      </div>

      <div style={cardFlat}>
        <div style={{ overflowX: 'auto' }}>
          <LedgerTable head="Source" revenue rows={rows} onEdit={onEdit} onRemove={onRemove} empty={<EmptyState icon={<TrendingUp size={20} />} title="No revenue recorded" hint="Add a retainer, a project invoice, or product sales with Add entry." />} />
          <div style={{ minWidth: 700 }}>
            <TableFooter count={`${rows.length} of ${all.length}`} total={money2(rows.reduce((a, e) => a + e.amount, 0))} />
          </div>
        </div>
      </div>
    </section>
  );
}
