import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, CreditCard, LayoutDashboard, PanelLeft, PanelLeftClose, Plus, Settings2, Sparkles, TrendingUp, X, Zap } from 'lucide-react';
import { Button, SidebarNavItem } from './components/ds.tsx';
import { h2 } from './components/ui.tsx';
import { aiAvailable, aiClassify, aiModel, aiReport, browserKey, loadAiStatus, setBrowserKey, type AiStatus } from './lib/ai.ts';
import { CAD_LABEL, EXP_CATS, REV_CATS, iso, metrics, money, money2, isSampleEntry, parseQuick, reportFacts, uid, type Entry, type Kind } from './lib/ledger.ts';
import { KEYS, store } from './lib/storage.ts';
import { Expenses, type ExpenseFilters } from './views/Expenses.tsx';
import { EntryModal, SettingsModal, blankForm, formFrom, type FormState } from './views/Modals.tsx';
import { Overview } from './views/Overview.tsx';
import { Revenue } from './views/Revenue.tsx';
import { Subscriptions } from './views/Subscriptions.tsx';

type Page = 'overview' | 'expenses' | 'subs' | 'revenue';
type CustomCats = Record<Kind, string[]>;
type AiGuess = Awaited<ReturnType<typeof aiClassify>>;

// New ledgers start empty. Browsers that were seeded with sample data by an
// earlier version get it removed once; the user's own entries are kept.
function loadEntries(): Entry[] {
  const saved = store.json<Entry[]>(KEYS.entries);
  if (!Array.isArray(saved)) return [];
  if (store.get(KEYS.sampleCleared)) return saved;
  const mine = saved.filter((e) => !isSampleEntry(e));
  store.set(KEYS.entries, JSON.stringify(mine));
  store.set(KEYS.sampleCleared, '1');
  return mine;
}

const withTimeout = <T,>(p: Promise<T>, ms: number) => Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]);

function loadCats(): CustomCats {
  const c = store.json<CustomCats>(KEYS.cats);
  return c && Array.isArray(c.expense) && Array.isArray(c.revenue) ? c : { expense: [], revenue: [] };
}

function loadCollapsed() {
  const saved = store.get(KEYS.sidebar);
  if (saved !== null) return saved === '1';
  return typeof window !== 'undefined' && window.innerWidth < 760;
}

const TITLES: Record<Page, [string, string]> = {
  overview: ['Overview', 'Revenue in, expenses out, and what renews next.'],
  expenses: ['Expenses', 'Every charge — one-time and recurring.'],
  subs: ['Subscriptions', 'Recurring costs. Pause one and it drops out of the run rate.'],
  revenue: ['Revenue', 'Retainers, projects, product sales.'],
};

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(loadEntries);
  const [customCats, setCustomCats] = useState<CustomCats>(loadCats);
  const [page, setPage] = useState<Page>('overview');
  const [collapsed, setCollapsed] = useState(loadCollapsed);
  const [modal, setModal] = useState<FormState | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ai, setAi] = useState<AiStatus>({ server: false, model: aiModel() });
  const [hasBrowserKey, setHasBrowserKey] = useState(() => !!browserKey());
  const [expFilters, setExpFilters] = useState<ExpenseFilters>({ cat: 'All', cad: 'All', search: '' });
  const [revFilter, setRevFilter] = useState('All');
  const [quick, setQuick] = useState('');
  const [quickAI, setQuickAI] = useState<AiGuess>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [report, setReport] = useState({ open: false, busy: false, text: '' });
  const aiTimer = useRef<number>(undefined);
  const toastTimer = useRef<number>(undefined);
  const quickRef = useRef(quick);
  quickRef.current = quick;

  useEffect(() => { loadAiStatus().then(setAi); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setModal(null); setSettingsOpen(false); setReport((r) => ({ ...r, open: false })); } };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(aiTimer.current); clearTimeout(toastTimer.current); };
  }, []);

  const m = useMemo(() => metrics(entries), [entries]);

  const save = useCallback((next: Entry[]) => { setEntries(next); store.set(KEYS.entries, JSON.stringify(next)); }, []);
  const flash = useCallback((msg: string) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(''), 2600); }, []);
  const upsert = (entry: Omit<Entry, 'id' | 'active'> & { id?: string | null; active?: boolean }) => {
    const next = entry.id
      ? entries.map((e) => (e.id === entry.id ? ({ ...e, ...entry, id: e.id } as Entry) : e))
      : [{ ...entry, id: uid(), active: true } as Entry, ...entries];
    save(next);
  };
  const remove = (id: string) => save(entries.filter((e) => e.id !== id));
  const toggleActive = (id: string, on: boolean) => save(entries.map((e) => (e.id === id ? { ...e, active: on } : e)));

  const cats = useCallback((kind: Kind) => {
    const base = kind === 'revenue' ? REV_CATS : EXP_CATS;
    return [...base, ...(customCats[kind] || []).filter((c) => !base.includes(c))];
  }, [customCats]);
  const addCategory = (kind: Kind, name: string) => {
    const exists = cats(kind).find((c) => c.toLowerCase() === name.toLowerCase());
    if (exists) return exists;
    const next = { ...customCats, [kind]: [...(customCats[kind] || []), name] };
    setCustomCats(next);
    store.set(KEYS.cats, JSON.stringify(next));
    return name;
  };

  // Quick add: rules give an instant preview; when a model is available it
  // cleans the name and picks the category, and Enter waits for that answer.
  const askModel = (v: string) => aiClassify(v, { expense: cats('expense'), revenue: cats('revenue') });
  const onQuick = (v: string) => {
    setQuick(v);
    setQuickAI(null);
    clearTimeout(aiTimer.current);
    const p = parseQuick(v);
    if (!p || !(p.amount > 0) || !aiAvailable()) return;
    aiTimer.current = window.setTimeout(async () => {
      setAiBusy(true);
      const r = await askModel(v);
      if (quickRef.current === v && r) setQuickAI(r);
      if (quickRef.current === v) setAiBusy(false);
    }, 600);
  };
  const preview = (text: string, ai: AiGuess) => {
    const p = parseQuick(text);
    if (!p) return null;
    // A custom category named in the line wins over the guess.
    const hit = cats(p.kind).find((c) => !EXP_CATS.includes(c) && !REV_CATS.includes(c) && text.toLowerCase().includes(c.toLowerCase()));
    if (hit) p.category = hit;
    return ai ? { ...p, kind: ai.kind, category: hit || ai.category, cadence: ai.cadence || p.cadence, name: ai.name || p.name } : p;
  };
  const qp = preview(quick, quickAI);
  const quickReady = !!(qp && qp.amount > 0) && !submitting;
  const quickSubmit = async () => {
    if (submitting) return;
    if (!qp || !(qp.amount > 0)) return flash('Add an amount — e.g. “Hosting 212/mo”.');
    clearTimeout(aiTimer.current);
    let final = qp;
    if (!quickAI && aiAvailable()) {
      setSubmitting(true);
      setAiBusy(true);
      const r = await withTimeout(askModel(quick), 6000);
      setSubmitting(false);
      if (r) final = preview(quick, r) || qp;
    }
    upsert({ kind: final.kind, name: final.name, amount: final.amount, category: final.category, cadence: final.cadence, date: iso(new Date()) });
    setQuick('');
    setQuickAI(null);
    setAiBusy(false);
    flash(`Logged ${final.name} · ${money2(final.amount)}${final.cadence === 'monthly' ? '/mo' : final.cadence === 'annual' ? '/yr' : ''} → ${final.category}`);
  };

  const makeReport = async () => {
    if (!aiAvailable()) { setSettingsOpen(true); flash('Add a Gemini key to write reports.'); return; }
    setReport({ open: true, busy: true, text: '' });
    try {
      const text = await aiReport(reportFacts(m));
      setReport({ open: true, busy: false, text });
    } catch (e) {
      setReport({ open: true, busy: false, text: `The model did not answer (${e instanceof Error ? e.message : 'unknown error'}). Check the key under Model settings and try again.` });
    }
  };

  const submitForm = (f: FormState, amount: number) => {
    upsert({ id: f.id, kind: f.kind, name: f.name.trim(), amount, category: f.category, cadence: f.cadence, date: f.date });
    setModal(null);
    flash(f.id ? 'Updated.' : 'Logged.');
  };
  const openEdit = (e: Entry) => setModal(formFrom(e));

  const toggleSidebar = () => { store.set(KEYS.sidebar, collapsed ? '0' : '1'); setCollapsed(!collapsed); };
  const netRun = m.mrr - m.burn;
  const subtitle: Record<Page, string> = { overview: 'this month', expenses: `${entries.filter((e) => e.kind === 'expense').length} logged`, subs: `${m.activeSubs.length} active`, revenue: `${entries.filter((e) => e.kind === 'revenue').length} entries` };
  const modelStatus = hasBrowserKey ? `Gemini · ${ai.model}` : ai.server ? `Gemini · ${ai.model} (server)` : 'No model — categorizing by rules';
  const modelColor = hasBrowserKey || ai.server ? 'var(--ok)' : 'var(--warn)';
  const nav: [Page, string, typeof LayoutDashboard][] = [['overview', 'Overview', LayoutDashboard], ['expenses', 'Expenses', CreditCard], ['subs', 'Subscriptions', Activity], ['revenue', 'Revenue', TrendingUp]];

  return (
    <div data-surface="app" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-0)', color: 'var(--app-fg)', fontFamily: 'var(--font-app)', fontSize: 14, lineHeight: '20px', letterSpacing: '-0.16px', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'var(--page-lift)' }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'var(--page-vignette)' }} />

      {/* Sidebar */}
      <aside style={{ width: collapsed ? 68 : 260, flexShrink: 0, position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-0)', borderRight: '1px solid rgba(255,255,255,0.05)', transition: 'width .3s cubic-bezier(.4,0,.2,1)', overflow: 'hidden', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px 8px 24px', minHeight: 64 }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', color: '#fff' }}>Ledger</span>
              <span style={{ fontFamily: 'var(--font-mono-app)', fontSize: 10, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-4)' }}>USD</span>
            </div>
          )}
          <button type="button" onClick={toggleSidebar} title="Toggle sidebar" aria-label="Toggle sidebar" aria-expanded={!collapsed} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, color: '#6B7280', background: 'transparent', border: 0, cursor: 'pointer', marginLeft: 'auto', marginRight: 'auto' }}>
            {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', marginTop: 16, flex: 1 }}>
          {nav.map(([p, label, Icon]) => <SidebarNavItem key={p} icon={<Icon size={20} />} label={label} active={page === p} collapsed={collapsed} onClick={() => setPage(p)} />)}
        </nav>

        <button type="button" className="hover-white" onClick={() => setSettingsOpen(true)} title="Model settings" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px 0' : '12px 24px', border: 0, background: 'transparent', color: '#6B7280', cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap', textAlign: 'left', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <span style={{ display: 'inline-flex', flexShrink: 0 }}><Settings2 size={16} /></span>
          {!collapsed && (
            <span style={{ display: 'grid', gap: 1, minWidth: 0 }}>
              <span>Model</span>
              <span style={{ fontSize: 11, color: modelColor, fontFamily: 'var(--font-mono-app)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{modelStatus}</span>
            </span>
          )}
        </button>
        {!collapsed && (
          <div style={{ padding: '16px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 }}>Net / month</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: netRun >= 0 ? 'var(--ok)' : 'var(--bad)' }}>{(netRun >= 0 ? '+' : '') + money(netRun)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 }}>Entries</span>
              <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', color: '#9CA3AF' }}>{entries.length}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="ledger-main" style={{ flex: 1, minWidth: 0, padding: 24, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20 }}>
          <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', letterSpacing: '-0.02em', fontWeight: 500, color: '#fff' }}>{TITLES[page][0]} <span style={{ color: 'var(--text-3)' }}>{subtitle[page]}</span></h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>{TITLES[page][1]}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="ghost" icon={<Sparkles size={14} />} onClick={makeReport} disabled={report.busy}>{report.busy ? 'Writing…' : 'Monthly report'}</Button>
              <Button variant="ghost" icon={<Plus size={16} />} onClick={() => setModal(blankForm())}>Full form</Button>
            </div>
          </header>

          {report.open && (
            <div className="fade-up" aria-live="polite" style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'var(--surface-2)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)', padding: '20px 24px', display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={h2}>Monthly report</h2>
                  <span style={{ fontFamily: 'var(--font-mono-app)', fontSize: 10, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-4)' }}>Written from your ledger · check the numbers before you act</span>
                </div>
                <button type="button" className="icon-btn" onClick={() => setReport((r) => ({ ...r, open: false }))} aria-label="Close report" style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 0, background: 'transparent', color: '#6B7280', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              {report.busy && (
                <div style={{ display: 'grid', gap: 8 }}>
                  {['70%', '90%', '55%'].map((w) => <div key={w} style={{ height: 14, width: w, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />)}
                </div>
              )}
              <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: 14, lineHeight: '22px', color: '#D0D6E0', maxWidth: '72ch', textWrap: 'pretty' }}>{report.text}</p>
            </div>
          )}

          {/* Quick add: one line, Enter to log */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 8px 0 16px', borderRadius: 10, border: `1px solid ${quickReady ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.08)'}`, background: 'var(--surface-2)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)', transition: 'border-color .16s' }}>
              <span style={{ color: '#6B7280', display: 'inline-flex' }}><Zap size={16} /></span>
              <input value={quick} onChange={(e) => onQuick(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') quickSubmit(); }} aria-label="Quick add an entry" placeholder="Type it like you'd say it — “Design tool 24/mo”, “Contractor invoice 1800”, “+Retainer client 02 4500/mo”" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#F3F4F6', fontSize: 15 }} />
              {quickReady && qp && (
                <div className="quick-preview" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono-app)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, color: qp.kind === 'revenue' ? 'var(--ok)' : 'var(--text-3)', background: qp.kind === 'revenue' ? 'var(--ok-dim)' : 'rgba(255,255,255,.05)' }}>{qp.kind === 'revenue' ? 'Revenue' : 'Expense'}</span>
                  <span className="qp-meta" style={{ fontSize: 12, color: '#9CA3AF' }}>{qp.category + (quickAI ? ' · Gemini' : aiBusy ? ' · checking…' : '')}</span>
                  <span className="qp-meta" style={{ fontSize: 12, color: '#9CA3AF' }}>· {CAD_LABEL[qp.cadence]}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: '#fff', marginLeft: 4 }}>{money2(qp.amount)}</span>
                </div>
              )}
              <Button variant="solid" size="sm" onClick={quickSubmit} disabled={!quickReady}>{submitting ? 'Sorting…' : 'Log ↵'}</Button>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#4B5563', paddingLeft: 4, flexWrap: 'wrap' }}>
              <span className="quick-hint">Amount anywhere · “/mo” or “/yr” makes it recurring · start with “+” for revenue · category is guessed from words like payroll, contractor, ads</span>
              {toast && <span role="status" style={{ color: 'var(--ok)' }}>{toast}</span>}
            </div>
          </div>

          {page === 'overview' && <Overview entries={entries} m={m} onEdit={openEdit} />}
          {page === 'expenses' && <Expenses entries={entries} m={m} cats={cats('expense')} filters={expFilters} setFilters={(f) => setExpFilters((s) => ({ ...s, ...f }))} onEdit={openEdit} onRemove={remove} />}
          {page === 'subs' && <Subscriptions m={m} onEdit={openEdit} onRemove={remove} onToggle={toggleActive} />}
          {page === 'revenue' && <Revenue entries={entries} m={m} filter={revFilter} setFilter={setRevFilter} onEdit={openEdit} onRemove={remove} />}
        </div>
      </main>

      {settingsOpen && (
        <SettingsModal
          initialKey={browserKey()}
          model={ai.model}
          serverKey={ai.server}
          onClose={() => setSettingsOpen(false)}
          onSave={(k) => {
            setBrowserKey(k);
            setHasBrowserKey(!!k);
            setSettingsOpen(false);
            flash(k ? `Using Gemini (${ai.model}).` : ai.server ? 'Browser key removed — using the server key.' : 'Gemini key removed.');
          }}
        />
      )}
      {modal && <EntryModal key={modal.id || 'new'} initial={modal} cats={cats} addCategory={addCategory} onSubmit={submitForm} onClose={() => setModal(null)} />}
    </div>
  );
}
