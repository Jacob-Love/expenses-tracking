import { TrendingUp } from 'lucide-react';
import { EmptyState, KpiCard } from '../components/ds.tsx';
import { ChargeTable, Chip, TableFooter, cardFlat } from '../components/ui.tsx';
import { chargesIn, comparable, money, money2, monthBuckets, pct, sumCharges, type Entry, type Metrics, type Period } from '../lib/ledger.ts';

export function Revenue({ entries, m, period, filter, setFilter, onEdit, onRemove }: {
  entries: Entry[]; m: Metrics; period: Period; filter: string; setFilter: (f: string) => void; onEdit: (e: Entry) => void; onRemove: (id: string) => void;
}) {
  const revenue = entries.filter((e) => e.kind === 'revenue');
  const all = chargesIn(revenue, period.from, period.to);
  const rows = all.filter(({ entry: e }) => filter === 'All' || (filter === 'Recurring' ? e.cadence !== 'once' : e.cadence === 'once'));
  const earned = sumCharges(all);
  const cmp = comparable(period, entries);
  const prevEarned = cmp ? sumCharges(chargesIn(revenue, cmp.from, cmp.to)) : null;
  const once = sumCharges(all.filter((c) => c.entry.cadence === 'once'));
  const spark = monthBuckets(revenue, period.from, period.to).map((s) => s.rev);

  return (
    <section data-screen-label="Revenue" className="fade-up" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <KpiCard label="Recurring revenue / mo · now" value={money(m.mrr)} changePercent={pct(m.mrr, m.mrrPrev)} prevValue={money(m.mrrPrev)} sparkData={m.series.map((s) => s.rev)} />
        <KpiCard label={`Earned · ${period.label}`} value={money(earned)} changePercent={prevEarned === null ? null : pct(earned, prevEarned)} prevValue={prevEarned === null ? undefined : money(prevEarned)} sparkData={spark.length > 1 ? spark : []} />
        <KpiCard label="One-time" value={money(once)} note={earned ? `${Math.round((once / earned) * 100)}% of earnings · ${money(earned - once)} recurring` : ''} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'Recurring', 'One-time'].map((c) => <Chip key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />)}
      </div>

      <div style={cardFlat}>
        <div style={{ overflowX: 'auto' }}>
          <ChargeTable head="Source" revenue rows={rows} onEdit={onEdit} onRemove={onRemove} empty={<EmptyState icon={<TrendingUp size={20} />} title={filter !== 'All' ? 'No revenue matches' : `No revenue · ${period.label}`} hint="Pick a wider date range, or log a payment with “+” in the bar above — “+Client retainer 4500/mo”." />} />
          <div style={{ minWidth: 700 }}>
            <TableFooter count={`${rows.length} ${rows.length === 1 ? 'payment' : 'payments'}${filter !== 'All' ? ` of ${all.length}` : ''} · ${period.label}`} total={money2(sumCharges(rows))} />
          </div>
        </div>
      </div>
    </section>
  );
}
