import { Calendar, Zap } from 'lucide-react';
import { EmptyState, KpiCard } from '../components/ds.tsx';
import { cardFlat, cardLit, colHead, h2, mono, signed } from '../components/ui.tsx';
import { CAD_LABEL, dateLabel, isBilling, money, monthly, pct, shortDate, type Entry, type Metrics } from '../lib/ledger.ts';

export function kpis(entries: Entry[], m: Metrics) {
  const ser = m.series;
  const net = m.revMonth - m.expMonth, netPrev = m.revPrevMonth - m.expPrevMonth;
  const subsCountAt = (at: Date) => entries.filter((e) => e.kind === 'expense' && e.cadence !== 'once' && isBilling(e, at)).length;
  const revRec = (cad: Entry['cadence']) => entries.filter((e) => e.kind === 'revenue' && e.cadence === cad && isBilling(e, m.today)).reduce((a, e) => a + monthly(e), 0);
  const burnCat = (c: string) => m.activeSubs.filter((e) => e.category === c).reduce((a, e) => a + monthly(e), 0);
  return {
    mrr: { value: money(m.mrr), delta: pct(m.mrr, m.mrrPrev), prev: money(m.mrrPrev), spark: ser.map((s) => s.rev), breakdown: { aLabel: 'Monthly', aValue: money(revRec('monthly') + revRec('weekly')), bLabel: 'Annual ÷ 12', bValue: money(revRec('annual')) } },
    burn: { value: money(m.burn), delta: pct(m.burn, m.burnPrev), prev: money(m.burnPrev), spark: ser.map((s) => s.exp), breakdown: { aLabel: 'Payroll', aValue: money(burnCat('Payroll')), bLabel: 'Software', bValue: money(burnCat('Software')) } },
    net: { value: money(net), delta: pct(net, netPrev), prev: money(netPrev), spark: ser.map((s) => s.rev - s.exp), breakdown: { aLabel: 'Revenue', aValue: money(m.revMonth), bLabel: 'Expenses', bValue: money(m.expMonth) } },
    subs: { value: String(m.activeSubs.length), delta: m.activeSubs.length - subsCountAt(new Date(m.today.getFullYear(), m.today.getMonth(), 0)), spark: ser.map((s) => subsCountAt(new Date(s.year, s.month + 1, 0))), breakdown: { aLabel: 'Monthly cost', aValue: money(m.burn), bLabel: 'Paused', bValue: String(m.pausedSubs.length) } },
  };
}

const RECENT_COLS = 'minmax(180px,2fr) 1fr 1fr 1fr 120px';

export function Overview({ entries, m, onEdit }: { entries: Entry[]; m: Metrics; onEdit: (e: Entry) => void }) {
  const k = kpis(entries, m);
  const ser = m.series, maxV = Math.max(1, ...ser.map((s) => Math.max(s.rev, s.exp)));
  const renewals = m.renewals.slice(0, 7);
  const renewalsOut = m.renewals.filter((r) => r.kind === 'expense').reduce((a, r) => a + r.amount * r.count, 0);
  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <section data-screen-label="Overview" className="fade-up" style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
        <KpiCard label="Recurring revenue / mo" value={k.mrr.value} changePercent={k.mrr.delta} prevValue={k.mrr.prev} sparkData={k.mrr.spark} breakdown={k.mrr.breakdown} />
        <KpiCard label="Recurring costs / mo" value={k.burn.value} changePercent={k.burn.delta} prevValue={k.burn.prev} invertColor sparkData={k.burn.spark} breakdown={k.burn.breakdown} />
        <KpiCard label="Net this month" value={k.net.value} changePercent={k.net.delta} prevValue={k.net.prev} sparkData={k.net.spark} breakdown={k.net.breakdown} />
        <KpiCard label="Active subscriptions" value={k.subs.value} changePercent={k.subs.delta} neutral sparkData={k.subs.spark} breakdown={k.subs.breakdown} />
      </div>

      <div className="ledger-split">
        {/* P&L chart */}
        <div style={{ ...cardLit, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <h2 style={h2}>Profit &amp; loss</h2>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{`${ser[0].label} ${ser[0].year} – ${ser[11].label} ${ser[11].year}`}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px 16px', flexWrap: 'wrap', fontSize: 12, color: '#9CA3AF' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--ok)' }} />Revenue <span style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{money(ser.reduce((a, s) => a + s.rev, 0))}</span></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,.28)' }} />Expenses <span style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{money(ser.reduce((a, s) => a + s.exp, 0))}</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, height: 190, alignItems: 'stretch' }} role="img" aria-label="Monthly revenue and expenses for the last 12 months">
            {ser.map((s, i) => {
              const net = s.rev - s.exp;
              const netLabel = (net >= 0 ? '+' : '') + (Math.abs(net) >= 1000 ? (net / 1000).toFixed(1) + 'k' : money(net));
              return (
                <div key={`${s.year}-${s.month}`} title={`${s.label}: revenue ${money(s.rev)}, expenses ${money(s.exp)}`} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ flex: 1, display: 'flex', gap: 3, alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ flex: 1, height: `${Math.round((s.rev / maxV) * 100)}%`, minHeight: 2, background: 'var(--ok)', opacity: 0.85, borderRadius: '3px 3px 0 0', transition: 'height .3s cubic-bezier(.4,0,.2,1)' }} />
                    <div style={{ flex: 1, height: `${Math.round((s.exp / maxV) * 100)}%`, minHeight: 2, background: 'rgba(255,255,255,0.26)', borderRadius: '3px 3px 0 0', transition: 'height .3s cubic-bezier(.4,0,.2,1)' }} />
                  </div>
                  <div style={{ ...mono, fontSize: 10, letterSpacing: '0.6px', textAlign: 'center', color: i === 11 ? '#fff' : '#62666D', textTransform: 'uppercase' }}>{s.label}</div>
                  <div className="pl-net" style={{ fontSize: 11, textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: net >= 0 ? 'var(--ok)' : 'var(--bad)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{netLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming renewals */}
        <div style={{ ...cardLit, padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <h2 style={h2}>Upcoming renewals</h2>
            <span style={{ fontSize: 12, color: '#6B7280' }}>next 30 days · {money(renewalsOut)} out</span>
          </div>
          {renewals.length > 0 ? (
            <div style={{ display: 'grid' }}>
              {renewals.map((r) => {
                const soon = r.days <= 3;
                return (
                  <div key={r.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: '4px 12px', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: '#E5E7EB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', ...mono }}>{shortDate(r.next)} · {CAD_LABEL[r.cadence]}{r.count > 1 ? ` · ×${r.count}` : ''}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: r.kind === 'revenue' ? 'var(--ok)' : '#EDEDED' }}>{(r.kind === 'revenue' ? '+' : '−') + money(r.amount)}</div>
                      <span style={{ display: 'inline-block', ...mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', padding: '1px 6px', borderRadius: 999, color: soon ? 'var(--warn)' : 'var(--text-3)', background: soon ? 'var(--warn-dim)' : 'rgba(255,255,255,.05)' }}>
                        {r.days <= 0 ? 'today' : r.days === 1 ? 'tomorrow' : `in ${r.days}d`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={<Calendar size={18} />} title="Nothing renews in the next 30 days" hint="Weekly, monthly and annual entries show up here as their charge date approaches." />
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div style={cardFlat}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '16px 20px 8px' }}>
          <h2 style={h2}>Recent</h2>
          <span style={{ fontSize: 12, color: '#6B7280' }}>last 8 entries by date</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 620 }}>
            <div style={{ display: 'grid', gridTemplateColumns: RECENT_COLS, gap: 12, padding: '6px 20px', ...colHead, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>Name</span><span>Category</span><span>Date</span><span>Type</span><span style={{ textAlign: 'right' }}>Amount</span>
            </div>
            {recent.map((e) => (
              <div key={e.id} role="button" tabIndex={0} onClick={() => onEdit(e)} onKeyDown={(ev) => { if (ev.key === 'Enter') onEdit(e); }} className="row-hover" style={{ display: 'grid', gridTemplateColumns: RECENT_COLS, gap: 12, padding: '10px 20px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background-color .12s' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: e.kind === 'revenue' ? 'var(--ok)' : 'rgba(255,255,255,.35)' }} />
                  <span style={{ color: '#E5E7EB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</span>
                </span>
                <span style={{ color: '#9CA3AF', fontSize: 13 }}>{e.category}</span>
                <span style={{ color: '#9CA3AF', fontSize: 12, ...mono }}>{dateLabel(e.date)}</span>
                <span style={{ color: '#9CA3AF', fontSize: 13 }}>{CAD_LABEL[e.cadence]}</span>
                <span style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: e.kind === 'revenue' ? 'var(--ok)' : '#EDEDED' }}>{signed(e)}</span>
              </div>
            ))}
            {!recent.length && <EmptyState icon={<Zap size={18} />} title="Your entries will show up here" hint="Type a charge in the bar above — “Frame.io 15/mo”, “Contractor invoice 1800”, “+Client retainer 4500/mo” — and press Enter." />}
          </div>
        </div>
      </div>
    </section>
  );
}
