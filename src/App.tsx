import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Activity, CreditCard, Download, LayoutDashboard, PanelLeft, PanelLeftClose, Plus, Settings2, Sparkles, TrendingUp, X, Zap } from 'lucide-react';
import { Button, SidebarNavItem } from './components/ds.tsx';
import { PeriodPicker, h2 } from './components/ui.tsx';
import { download, exportName, pnlCsv, transactionsCsv } from './lib/export.ts';
import { aiAvailable, aiClassify, aiModel, aiReport, browserKey, loadAiStatus, setBrowserKey, type AiStatus } from './lib/ai.ts';
import { CAD_LABEL, CAD_SUFFIX, EXP_CATS, REV_CATS, iso, metrics, money, money2, dateLabel, periodFor, type PeriodKey, findKnown, parseCommand, setStatus, statusOf, isSampleEntry, knownNames, normName, parseDate, parseQuick, statedCadence, reportFacts, suggestNames, uid, type Entry, type Kind } from './lib/ledger.ts';
import { KEYS, store } from './lib/storage.ts';
import { Expenses, type ExpenseFilters } from './views/Expenses.tsx';
import { EntryModal, SettingsModal, blankForm, formFrom, type FormState } from './views/Modals.tsx';
import { Overview } from './views/Overview.tsx';
import { Revenue } from './views/Revenue.tsx';
import { Subscriptions, type StatusAction } from './views/Subscriptions.tsx';

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
  const [exportOpen, setExportOpen] = useState(false);
  const [periodKey, setPeriodKey] = useState<PeriodKey>(() => (store.get(KEYS.period) as PeriodKey) || 'month');
  const [customRange, setCustomRange] = useState<{ from: string; to: string }>(() => store.json(KEYS.periodCustom) || { from: '', to: '' });
  const [quick, setQuick] = useState('');
  const [quickAI, setQuickAI] = useState<AiGuess>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestSel, setSuggestSel] = useState(-1);
  const quickInput = useRef<HTMLInputElement>(null);
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
  const period = useMemo(() => periodFor(periodKey, entries, new Date(), customRange), [periodKey, entries, customRange]);
  const changePeriod = (key: PeriodKey, custom?: { from: string; to: string }) => {
    setPeriodKey(key);
    store.set(KEYS.period, key);
    if (custom) { setCustomRange(custom); store.set(KEYS.periodCustom, JSON.stringify(custom)); }
  };

  const save = useCallback((next: Entry[]) => { setEntries(next); store.set(KEYS.entries, JSON.stringify(next)); }, []);
  const flash = useCallback((msg: string) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(''), 2600); }, []);
  const upsert = (entry: Omit<Entry, 'id' | 'active'> & { id?: string | null; active?: boolean }) => {
    const next = entry.id
      ? entries.map((e) => (e.id === entry.id ? ({ ...e, ...entry, id: e.id } as Entry) : e))
      : [{ ...entry, id: uid(), active: true } as Entry, ...entries];
    save(next);
  };
  const remove = (id: string) => save(entries.filter((e) => e.id !== id));
  const changeStatus = (id: string, action: StatusAction, on = iso(new Date())) => {
    const e = entries.find((x) => x.id === id);
    if (!e) return;
    // "resume" on a cancelled entry means bring it back.
    const act: StatusAction = action === 'resume' && statusOf(e) === 'cancelled' ? 'restore' : action;
    save(entries.map((x) => (x.id === id ? setStatus(x, act, on) : x)));
    const when = on === iso(new Date()) ? '' : ` from ${dateLabel(on)}`;
    flash({ pause: `Paused ${e.name}${when} — it stops counting from then; past charges stay.`, resume: `Resumed ${e.name}${when}.`, cancel: `Cancelled ${e.name}${when} — past charges stay in your history.`, restore: `Restored ${e.name}.` }[act]);
  };

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

  // Quick add: rules give an instant preview. A name already in the ledger
  // (any case/spacing) is reused with its category, with no model call. Other
  // lines go to the model when one is available, and Enter waits for it.
  const known = useMemo(() => knownNames(entries), [entries]);
  const askModel = (v: string) => aiClassify(v, { expense: cats('expense'), revenue: cats('revenue'), known: known.slice(0, 80).map((e) => e.name) });
  const onQuick = (v: string) => {
    setQuick(v);
    setQuickAI(null);
    setSuggestOpen(true);
    setSuggestSel(-1);
    clearTimeout(aiTimer.current);
    const p = parseQuick(v);
    if (!p || !(p.amount > 0) || !aiAvailable() || findKnown(p.name, entries) || parseCommand(v, entries)) { setAiBusy(false); return; }
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
    const said = statedCadence(text)?.cadence;
    // Billing words in the line beat the model's guess; it only fills the gap.
    const base = ai ? { ...p, kind: ai.kind, category: hit || ai.category, cadence: said || ai.cadence || p.cadence, name: ai.name || p.name } : p;
    const match = findKnown(p.name, entries) || (ai?.name ? findKnown(ai.name, entries) : null);
    if (!match) return { ...base, matched: false };
    // "frame.io 15" for a monthly vendor means this month's charge of that subscription.
    return { ...base, kind: match.kind, category: hit || match.category, name: match.name, cadence: said || match.cadence, matched: true };
  };
  const cmd = parseCommand(quick, entries);
  const qp = cmd ? null : preview(quick, quickAI);
  const quickReady = (cmd ? !!cmd.entry : !!(qp && qp.amount > 0)) && !submitting;
  const typedName = cmd ? cmd.rest : parseQuick(quick)?.name || '';
  const suggestions = suggestOpen && !qp?.matched && !(cmd?.entry && normName(cmd.entry.name) === normName(cmd.rest)) ? suggestNames(typedName, cmd ? entries.filter((e) => e.cadence !== 'once') : entries) : [];
  const pickSuggestion = (e: Entry) => {
    if (cmd) { onQuick(`${cmd.word} ${e.name}`); setSuggestOpen(false); quickInput.current?.focus(); return; }
    const p = parseQuick(quick);
    const rest = [p?.amountText, parseDate(quick)?.label].filter(Boolean).join(' ');
    const next = `${quick.trim().startsWith('+') ? '+' : ''}${e.name} ${rest}`.replace(/\s+$/, rest ? '' : ' ');
    onQuick(next);
    setSuggestOpen(false);
    quickInput.current?.focus();
  };
  const quickSubmit = async () => {
    if (submitting) return;
    if (cmd) {
      if (!cmd.entry) return flash(cmd.rest ? `No subscription or recurring entry called “${cmd.rest}”.` : 'Name the subscription — e.g. “cancel Frame.io”.');
      changeStatus(cmd.entry.id, cmd.verb, cmd.date);
      setQuick(''); setSuggestOpen(false); clearTimeout(aiTimer.current); setAiBusy(false);
      return;
    }
    if (!qp || !(qp.amount > 0)) return flash('Add an amount — e.g. “Hosting 212/mo”.');
    clearTimeout(aiTimer.current);
    let final = qp;
    if (!quickAI && !qp.matched && aiAvailable()) {
      setSubmitting(true);
      setAiBusy(true);
      const r = await withTimeout(askModel(quick), 6000);
      setSubmitting(false);
      if (r) final = preview(quick, r) || qp;
    }
    const per = (c: Entry['cadence']) => CAD_SUFFIX[c];
    // A recurring entry already counts every month. Logging it again as
    // recurring would double it, so update the existing one instead.
    const existing = entries.find((e) => e.cadence !== 'once' && statusOf(e) === 'active' && e.kind === final.kind && normName(e.name) === normName(final.name));
    if (existing && final.cadence !== 'once') {
      upsert({ ...existing, amount: final.amount, cadence: final.cadence });
      flash(existing.amount === final.amount && existing.cadence === final.cadence
        ? `${existing.name} is already tracked at ${money2(existing.amount)}${per(existing.cadence)} — nothing added.`
        : `Updated ${existing.name}: ${money2(existing.amount)}${per(existing.cadence)} → ${money2(final.amount)}${per(final.cadence)}`);
    } else {
      upsert({ kind: final.kind, name: final.name, amount: final.amount, category: final.category, cadence: final.cadence, date: final.date || iso(new Date()) });
      flash(existing
        ? `Logged a one-time ${existing.name} charge · ${money2(final.amount)}. Its ${CAD_LABEL[existing.cadence].toLowerCase()} subscription is already counted.`
        : `Logged ${final.name} · ${money2(final.amount)}${per(final.cadence)} → ${final.category}${final.date && final.date !== iso(new Date()) ? ` · ${dateLabel(final.date)}` : ''}`);
    }
    setQuick('');
    setQuickAI(null);
    setAiBusy(false);
    setSuggestOpen(false);
  };
  const onQuickKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const n = suggestions.length;
    if (n && e.key === 'ArrowDown') { e.preventDefault(); setSuggestSel((i) => (i + 1) % n); return; }
    if (n && e.key === 'ArrowUp') { e.preventDefault(); setSuggestSel((i) => (i <= 0 ? n - 1 : i - 1)); return; }
    if (n && e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); pickSuggestion(suggestions[Math.max(0, suggestSel)]); return; }
    if (n && e.key === 'Enter' && suggestSel >= 0) { e.preventDefault(); pickSuggestion(suggestions[suggestSel]); return; }
    if (n && e.key === 'Escape') { e.stopPropagation(); setSuggestOpen(false); return; }
    if (e.key === 'Enter') quickSubmit();
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
  const subtitle: Record<Page, string> = { overview: period.label, expenses: `${entries.filter((e) => e.kind === 'expense').length} logged`, subs: `${m.activeSubs.length} active`, revenue: `${entries.filter((e) => e.kind === 'revenue').length} entries` };
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
              <span style={{ position: 'relative' }}>
                <Button variant="ghost" icon={<Download size={14} />} onClick={() => setExportOpen((o) => !o)} aria-expanded={exportOpen} aria-haspopup="menu">Export</Button>
                {exportOpen && (
                  <>
                    <div onClick={() => setExportOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
                    <div role="menu" className="fade-up-fast" style={{ position: 'absolute', right: 0, top: 42, zIndex: 21, width: 260, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'var(--surface-3)', boxShadow: '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.05)', padding: 4, display: 'grid' }}>
                      <div style={{ padding: '6px 10px 4px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 }}>CSV · {period.label}</div>
                      {([['P&L statement', 'Monthly totals, categories, net profit', () => download(exportName('pnl', period), pnlCsv(entries, period))], ['Transactions', 'Every charge and payment in the range', () => download(exportName('transactions', period), transactionsCsv(entries, period))]] as const).map(([label, hint, run]) => (
                        <button key={label} type="button" role="menuitem" className="row-hover" onClick={() => { run(); setExportOpen(false); flash(`Downloaded ${label.toLowerCase()} · ${period.label}`); }} style={{ display: 'grid', gap: 2, textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 0, background: 'transparent', cursor: 'pointer', font: 'inherit' }}>
                          <span style={{ color: '#F3F4F6', fontSize: 14 }}>{label}</span>
                          <span style={{ color: '#6B7280', fontSize: 12 }}>{hint}</span>
                        </button>
                      ))}
                      {page === 'subs' && <div style={{ padding: '6px 10px', fontSize: 12, color: '#6B7280' }}>Uses the date range set on the other pages.</div>}
                    </div>
                  </>
                )}
              </span>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 6, position: 'relative', zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 8px 0 16px', borderRadius: 10, border: `1px solid ${quickReady ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.08)'}`, background: 'var(--surface-2)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)', transition: 'border-color .16s' }}>
              <span style={{ color: '#6B7280', display: 'inline-flex' }}><Zap size={16} /></span>
              <input ref={quickInput} value={quick} onChange={(e) => onQuick(e.target.value)} onKeyDown={onQuickKey} onBlur={() => setTimeout(() => setSuggestOpen(false), 120)} role="combobox" aria-expanded={suggestions.length > 0} aria-controls="quick-suggest" aria-autocomplete="list" aria-activedescendant={suggestSel >= 0 ? `quick-suggest-${suggestSel}` : undefined} autoComplete="off" aria-label="Quick add an entry" placeholder="Type it like you'd say it — “Design tool 24/mo”, “Contractor invoice 1800”, “+Retainer client 02 4500/mo”" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#F3F4F6', fontSize: 15 }} />
              {cmd && (
                <div className="quick-preview" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono-app)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, color: cmd.verb === 'cancel' ? 'var(--bad)' : cmd.verb === 'pause' ? 'var(--warn)' : 'var(--ok)', background: cmd.verb === 'cancel' ? 'var(--bad-dim)' : cmd.verb === 'pause' ? 'var(--warn-dim)' : 'var(--ok-dim)' }}>{cmd.verb}</span>
                  {cmd.entry
                    ? <span className="qp-meta" style={{ fontSize: 12, color: '#E5E7EB' }}>{cmd.entry.name} · {money2(cmd.entry.amount)}{CAD_SUFFIX[cmd.entry.cadence]}{cmd.date !== iso(new Date()) ? ` · from ${dateLabel(cmd.date)}` : ''}</span>
                    : <span className="qp-meta" style={{ fontSize: 12, color: '#6B7280' }}>{cmd.rest ? 'no match' : 'which one?'}</span>}
                </div>
              )}
              {quickReady && qp && (
                <div className="quick-preview" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono-app)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, color: qp.kind === 'revenue' ? 'var(--ok)' : 'var(--text-3)', background: qp.kind === 'revenue' ? 'var(--ok-dim)' : 'rgba(255,255,255,.05)' }}>{qp.kind === 'revenue' ? 'Revenue' : 'Expense'}</span>
                  {(qp.matched || quickAI) && <span className="qp-meta" style={{ fontSize: 12, color: '#E5E7EB', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }} title={qp.matched ? 'Matches a name you already use' : 'Name from Gemini'}>{qp.name}</span>}
                  <span className="qp-meta" style={{ fontSize: 12, color: '#9CA3AF' }}>{qp.category + (qp.matched ? ' · saved' : quickAI ? ' · Gemini' : aiBusy ? ' · checking…' : '')}</span>
                  <span className="qp-meta" style={{ fontSize: 12, color: '#9CA3AF' }}>· {CAD_LABEL[qp.cadence]}</span>
                  {qp.date && qp.date !== iso(new Date()) && <span className="qp-meta" style={{ fontSize: 12, color: '#C7D2FE', fontFamily: 'var(--font-mono-app)' }}>· {dateLabel(qp.date)}</span>}
                  <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: '#fff', marginLeft: 4 }}>{money2(qp.amount)}</span>
                </div>
              )}
              <Button variant="solid" size="sm" onClick={quickSubmit} disabled={!quickReady}>{submitting ? 'Sorting…' : cmd ? `${cmd.verb[0].toUpperCase()}${cmd.verb.slice(1)} ↵` : 'Log ↵'}</Button>
            </div>
            {suggestions.length > 0 && (
              <div id="quick-suggest" role="listbox" aria-label="Names you've used" className="fade-up-fast" style={{ position: 'absolute', top: 52, left: 0, right: 0, maxWidth: 520, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'var(--surface-3)', boxShadow: '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.05)', padding: 4, display: 'grid' }}>
                <div style={{ padding: '6px 10px 4px', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4B5563', fontWeight: 600 }}>Used before · Tab to fill</div>
                {suggestions.map((e, i) => (
                  <div key={e.id} id={`quick-suggest-${i}`} role="option" aria-selected={i === suggestSel} onMouseDown={(ev) => { ev.preventDefault(); pickSuggestion(e); }} onMouseEnter={() => setSuggestSel(i)} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', background: i === suggestSel ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                    <span style={{ color: '#F3F4F6', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{e.name}</span>
                    <span style={{ color: '#6B7280', fontSize: 12, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{e.category} · {CAD_LABEL[e.cadence]} · {money2(e.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#4B5563', paddingLeft: 4, flexWrap: 'wrap' }}>
              <span className="quick-hint">Amount anywhere · “/wk”, “/mo” or “/yr” makes it recurring · “yesterday”, “oct 2” or “10/2” sets the date · start with “+” for revenue · Tab fills a name you've used · “cancel”, “pause” or “resume” + a name</span>
              {toast && <span role="status" style={{ color: 'var(--ok)' }}>{toast}</span>}
            </div>
          </div>

          {page !== 'subs' && <PeriodPicker period={period} custom={customRange} onChange={changePeriod} />}
          {page === 'overview' && <Overview entries={entries} m={m} period={period} onEdit={openEdit} />}
          {page === 'expenses' && <Expenses entries={entries} period={period} cats={cats('expense')} filters={expFilters} setFilters={(f) => setExpFilters((s) => ({ ...s, ...f }))} onEdit={openEdit} onRemove={remove} />}
          {page === 'subs' && <Subscriptions m={m} onEdit={openEdit} onRemove={remove} onStatus={changeStatus} />}
          {page === 'revenue' && <Revenue entries={entries} m={m} period={period} filter={revFilter} setFilter={setRevFilter} onEdit={openEdit} onRemove={remove} />}
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
      {modal && (() => { const cur = modal.id ? entries.find((e) => e.id === modal.id) : undefined; return <EntryModal key={modal.id || 'new'} initial={modal} cats={cats} addCategory={addCategory} onSubmit={submitForm} onClose={() => setModal(null)} status={cur && cur.cadence !== 'once' ? statusOf(cur) : undefined} onStatus={cur ? (a) => { changeStatus(cur.id, a); setModal(null); } : undefined} />; })()}
    </div>
  );
}
