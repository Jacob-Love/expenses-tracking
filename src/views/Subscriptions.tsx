import { Activity } from 'lucide-react';
import { EmptyState, KpiCard, Toggle } from '../components/ds.tsx';
import { DeleteButton, mono } from '../components/ui.tsx';
import { CAD_LABEL, money, money2, monthly, shortDate, type Entry, type Metrics } from '../lib/ledger.ts';

export function Subscriptions({ m, onEdit, onRemove, onToggle }: { m: Metrics; onEdit: (e: Entry) => void; onRemove: (id: string) => void; onToggle: (id: string, on: boolean) => void }) {
  const subs = [...m.activeSubs, ...m.pausedSubs].sort((a, b) => monthly(b) - monthly(a));
  const next30 = m.renewals.filter((r) => r.kind === 'expense');
  const sumPlans = (cad: Entry['cadence']) => m.activeSubs.filter((e) => e.cadence === cad).reduce((a, e) => a + e.amount, 0);

  return (
    <section data-screen-label="Subscriptions" className="fade-up" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <KpiCard label="Monthly commitment" value={money(m.burn)} prevValue={`${money(m.burn * 12)} / yr`} breakdown={{ aLabel: 'Monthly plans', aValue: money(sumPlans('monthly')), bLabel: 'Annual plans', bValue: money(sumPlans('annual')) + ' / yr' }} />
        <KpiCard label="Active" value={String(m.activeSubs.length)} prevValue={`${m.pausedSubs.length} paused`} />
        <KpiCard label="Next 30 days" value={money(next30.reduce((a, r) => a + r.amount, 0))} prevValue={`${next30.length} charges`} />
      </div>

      {subs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {subs.map((e) => {
            const paused = e.active === false;
            const nd = m.nextDate(e), days = Math.round((nd.getTime() - m.today.getTime()) / 86400000);
            return (
              <div key={e.id} className="sub-card" style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface-2)', backgroundImage: 'radial-gradient(130% 130% at 0% 0%, rgba(255,255,255,0.05), transparent 55%)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, opacity: paused ? 0.55 : 1, transition: 'opacity .2s, border-color .3s, transform .3s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <button type="button" onClick={() => onEdit(e)} style={{ display: 'block', maxWidth: '100%', fontSize: 14, fontWeight: 500, color: '#F3F4F6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', border: 0, background: 'transparent', padding: 0, font: 'inherit', textAlign: 'left' }}>{e.name}</button>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{e.category} · {CAD_LABEL[e.cadence]}</div>
                  </div>
                  <Toggle on={!paused} onToggle={(on) => onToggle(e.id, on)} label={`${e.name} active`} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 24, lineHeight: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: '#fff' }}>{money2(e.amount)}</span>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{e.cadence === 'annual' ? `/ yr · ${money(e.amount / 12)} / mo` : '/ mo'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 11, ...mono, color: paused ? 'var(--text-4)' : days <= 3 ? 'var(--warn)' : '#6B7280' }}>{paused ? 'Paused' : `Renews ${shortDate(nd)} · in ${days}d`}</span>
                  <DeleteButton onClick={() => onRemove(e.id)} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<Activity size={20} />} title="No subscriptions yet" hint="Add an expense with a monthly or annual cadence and it lands here with its renewal date." size="page" />
      )}
    </section>
  );
}
