import { Activity } from 'lucide-react';
import { EmptyState, KpiCard, Toggle } from '../components/ds.tsx';
import { DeleteButton, h2, mono } from '../components/ui.tsx';
import { CAD_LABEL, CAD_SUFFIX, money, money2, monthly, parse, shortDate, type Entry, type Metrics } from '../lib/ledger.ts';

export type StatusAction = 'pause' | 'resume' | 'cancel' | 'restore';

const textBtn = { border: 0, background: 'transparent', padding: 0, fontSize: 12, color: '#6B7280', cursor: 'pointer' } as const;

export function Subscriptions({ m, onEdit, onRemove, onStatus }: { m: Metrics; onEdit: (e: Entry) => void; onRemove: (id: string) => void; onStatus: (id: string, action: StatusAction) => void }) {
  const subs = [...m.activeSubs, ...m.pausedSubs].sort((a, b) => monthly(b) - monthly(a));
  const next30 = m.renewals.filter((r) => r.kind === 'expense');
  const sumPlans = (cads: Entry['cadence'][]) => m.activeSubs.filter((e) => cads.includes(e.cadence)).reduce((a, e) => a + monthly(e), 0);
  const cancelled = [...m.cancelledSubs].sort((a, b) => (b.endDate || '').localeCompare(a.endDate || ''));
  const saved = cancelled.reduce((a, e) => a + monthly(e), 0);

  return (
    <section data-screen-label="Subscriptions" className="fade-up" style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <KpiCard label="Monthly commitment" value={money(m.burn)} note={`${money(m.burn * 12)} / yr`} breakdown={{ aLabel: m.activeSubs.some((e) => e.cadence === 'weekly') ? 'Weekly + monthly' : 'Monthly plans', aValue: money(sumPlans(['weekly', 'monthly'])), bLabel: 'Annual plans', bValue: money(sumPlans(['annual']) * 12) + ' / yr' }} />
        <KpiCard label="Active" value={String(m.activeSubs.length)} note={`${m.pausedSubs.length} paused · ${cancelled.length} cancelled`} />
        <KpiCard label="Next 30 days" value={money(next30.reduce((a, r) => a + r.amount * r.count, 0))} note={`${next30.reduce((a, r) => a + r.count, 0)} charges`} />
      </div>

      {subs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {subs.map((e) => {
            const paused = m.pausedSubs.includes(e);
            const since = paused ? (e.pauses || []).find((p) => !p.to)?.from : undefined;
            const nd = m.nextDate(e), days = Math.round((nd.getTime() - m.today.getTime()) / 86400000);
            return (
              <div key={e.id} className="sub-card" style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface-2)', backgroundImage: 'radial-gradient(130% 130% at 0% 0%, rgba(255,255,255,0.05), transparent 55%)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color .3s, transform .3s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, opacity: paused ? 0.55 : 1 }}>
                  <div style={{ minWidth: 0 }}>
                    <button type="button" onClick={() => onEdit(e)} style={{ display: 'block', maxWidth: '100%', fontSize: 14, fontWeight: 500, color: '#F3F4F6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', border: 0, background: 'transparent', padding: 0, font: 'inherit', textAlign: 'left' }}>{e.name}</button>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{e.category} · {CAD_LABEL[e.cadence]}</div>
                  </div>
                  <Toggle on={!paused} onToggle={(on) => onStatus(e.id, on ? 'resume' : 'pause')} label={paused ? `Resume ${e.name}` : `Pause ${e.name}`} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, opacity: paused ? 0.55 : 1 }}>
                  <span style={{ fontSize: 24, lineHeight: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: '#fff' }}>{money2(e.amount)}</span>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{e.cadence === 'annual' ? `/ yr · ${money(e.amount / 12)} / mo` : e.cadence === 'weekly' ? `/ wk · ${money(monthly(e))} / mo` : '/ mo'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 11, ...mono, color: paused ? 'var(--text-4)' : days <= 3 ? 'var(--warn)' : '#6B7280' }}>{paused ? (since ? `Paused since ${shortDate(parse(since))}` : 'Paused') : `Renews ${shortDate(nd)} · in ${days}d`}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <button type="button" className="hover-white" onClick={() => onStatus(e.id, 'cancel')} style={{ ...textBtn, padding: '4px 6px' }}>Cancel</button>
                    <DeleteButton onClick={() => onRemove(e.id)} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={<Activity size={20} />} title={cancelled.length ? 'No active subscriptions' : 'No subscriptions yet'} hint="Add an expense with a weekly, monthly or annual cadence and it lands here with its renewal date." size="page" />
      )}

      {cancelled.length > 0 && (
        <div style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface-2)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '16px 20px 8px', flexWrap: 'wrap' }}>
            <h2 style={h2}>Cancelled</h2>
            <span style={{ fontSize: 12, color: '#6B7280' }}>past charges stay in your history · {money(saved)} / mo no longer going out</span>
          </div>
          {cancelled.map((e) => (
            <div key={e.id} className="row-hover" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto auto', gap: 12, alignItems: 'center', padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <button type="button" onClick={() => onEdit(e)} style={{ minWidth: 0, textAlign: 'left', border: 0, background: 'transparent', padding: 0, font: 'inherit', cursor: 'pointer' }}>
                <div style={{ color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                <div style={{ fontSize: 11, color: '#6B7280', ...mono }}>{money2(e.amount)}{CAD_SUFFIX[e.cadence]} · ended {e.endDate ? shortDate(parse(e.endDate)) : ''}</div>
              </button>
              <button type="button" className="hover-white" onClick={() => onStatus(e.id, 'restore')} style={{ ...textBtn, color: '#818CF8' }}>Restore</button>
              <DeleteButton onClick={() => onRemove(e.id)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
