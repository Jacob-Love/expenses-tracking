import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ds.tsx';
import { fieldLabel, input, mono } from '../components/ui.tsx';
import { EXP_CATS, REV_CATS, iso, type Cadence, type Entry, type Kind } from '../lib/ledger.ts';

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('input, select, button:not([data-close])')?.focus();
    return () => prev?.focus?.();
  }, []);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className="fade-up-fast" style={{ width: '100%', maxWidth: 460, maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'var(--surface-3)', boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.06)', padding: 24, display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', color: '#fff' }}>{title}</h2>
          <button type="button" data-close className="icon-btn" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 0, background: 'transparent', color: '#6B7280', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export interface FormState { id: string | null; kind: Kind; name: string; amount: string; category: string; cadence: Cadence; date: string }
export const blankForm = (): FormState => ({ id: null, kind: 'expense', name: '', amount: '', category: 'Software', cadence: 'once', date: iso(new Date()) });
export const formFrom = (e: Entry): FormState => ({ id: e.id, kind: e.kind, name: e.name, amount: String(e.amount), category: e.category, cadence: e.cadence, date: e.date });

export function EntryModal({ initial, cats, addCategory, onSubmit, onClose }: {
  initial: FormState; cats: (k: Kind) => string[]; addCategory: (k: Kind, name: string) => string; onSubmit: (f: FormState, amount: number) => void; onClose: () => void;
}) {
  const [f, setF] = useState(initial);
  const [error, setError] = useState('');
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCat, setNewCat] = useState('');
  const newCatRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (newCatOpen) newCatRef.current?.focus(); }, [newCatOpen]);
  const set = (p: Partial<FormState>) => { setF((s) => ({ ...s, ...p })); setError(''); };
  const isRev = f.kind === 'revenue';

  const submit = () => {
    const amount = parseFloat(String(f.amount).replace(/[^0-9.]/g, ''));
    if (!f.name.trim()) return setError('Give it a name.');
    if (!(amount > 0)) return setError('Amount needs to be more than zero.');
    if (!f.date) return setError('Pick a date.');
    onSubmit(f, amount);
  };
  const commitCat = () => {
    const name = newCat.trim().replace(/\s+/g, ' ');
    if (!name) return;
    set({ category: addCategory(f.kind, name) });
    setNewCatOpen(false);
    setNewCat('');
  };

  return (
    <Dialog title={f.id ? 'Edit entry' : 'New entry'} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4, borderRadius: 8, background: 'var(--surface-1)' }} role="radiogroup" aria-label="Kind">
          {([['expense', 'Expense'], ['revenue', 'Revenue']] as const).map(([v, label]) => (
            <button key={v} type="button" role="radio" aria-checked={f.kind === v} onClick={() => set({ kind: v, category: v === 'revenue' ? REV_CATS[0] : EXP_CATS[0] })} style={{ height: 32, borderRadius: 6, border: 0, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: f.kind === v ? 'var(--surface-4)' : 'transparent', color: f.kind === v ? '#fff' : '#6B7280', transition: 'all .12s' }}>{label}</button>
          ))}
        </div>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={fieldLabel}>{isRev ? 'Source' : 'Name'}</span>
          <input value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder={isRev ? 'Retainer — Client 02' : 'Cloud hosting'} style={input} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
            <span style={fieldLabel}>Amount (USD)</span>
            <input value={f.amount} onChange={(e) => set({ amount: e.target.value })} inputMode="decimal" placeholder="0.00" style={{ ...input, fontVariantNumeric: 'tabular-nums' }} />
          </label>
          <div style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={fieldLabel}>Category</span>
              {newCatOpen && <button type="button" className="hover-white" onClick={() => { setNewCatOpen(false); setNewCat(''); }} style={{ border: 0, background: 'transparent', padding: 0, fontSize: 12, color: '#6B7280', cursor: 'pointer' }}>Cancel</button>}
            </div>
            {newCatOpen && (
              <div style={{ display: 'flex', gap: 6 }}>
                <input ref={newCatRef} value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitCat(); } if (e.key === 'Escape') { e.stopPropagation(); setNewCatOpen(false); } }} placeholder="e.g. Rent" aria-label="New category name" style={{ ...input, flex: 1, minWidth: 0, border: '1px solid rgba(99,102,241,0.5)' }} />
                <button type="button" onClick={commitCat} style={{ height: 38, padding: '0 12px', borderRadius: 8, border: 0, background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Add</button>
              </div>
            )}
            <select value={f.category} onChange={(e) => set({ category: e.target.value })} aria-label="Category" style={{ ...input, padding: '0 10px' }}>
              {cats(f.kind).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="button" className="hover-white" onClick={() => { setNewCatOpen(true); setNewCat(''); }} style={{ justifySelf: 'start', border: 0, background: 'transparent', padding: 0, fontSize: 12, color: '#818CF8', cursor: 'pointer' }}>+ New category</button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <span style={fieldLabel}>Billing</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }} role="radiogroup" aria-label="Billing">
            {([['once', 'One-time'], ['monthly', 'Monthly'], ['annual', 'Annual']] as const).map(([v, label]) => {
              const on = f.cadence === v;
              return <button key={v} type="button" role="radio" aria-checked={on} onClick={() => set({ cadence: v })} style={{ height: 34, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: `1px solid ${on ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: on ? 'rgba(99,102,241,0.16)' : 'var(--surface-4)', color: on ? '#C7D2FE' : '#9CA3AF', transition: 'all .12s' }}>{label}</button>;
            })}
          </div>
        </div>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={fieldLabel}>{f.cadence === 'once' ? 'Date' : 'First charge'}</span>
          <input type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} style={{ ...input, colorScheme: 'dark' }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>{f.cadence === 'once' ? 'When it hit the account.' : 'Renewals are projected from this date.'}</span>
        </label>

        {error && <div role="alert" style={{ fontSize: 13, color: '#F87171', padding: '8px 12px', borderRadius: 8, background: 'rgba(248,113,113,0.1)' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="solid" type="submit">{f.id ? 'Save' : 'Add'}</Button>
        </div>
      </form>
    </Dialog>
  );
}

export function SettingsModal({ initialKey, model, serverKey, onSave, onClose }: { initialKey: string; model: string; serverKey: boolean; onSave: (k: string) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(initialKey);
  return (
    <Dialog title="Model" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(draft.trim()); }} style={{ display: 'grid', gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: '20px', color: '#9CA3AF' }}>
          Gemini categorizes anything the rules can't place and writes the monthly report. Model: <span style={{ ...mono, color: '#D0D6E0' }}>{model}</span>.
          {serverKey
            ? ' A server key is configured, so you can leave this empty. A key saved here overrides it in this browser only.'
            : ' The key stays in this browser — it is never sent anywhere except Google.'}
        </p>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={fieldLabel}>Gemini API key</span>
          <input type="password" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="AIza…" autoComplete="off" style={{ ...input, ...mono }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>Get one at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com/apikey</a>. Leave empty to remove.</span>
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="solid" type="submit">Save</Button>
        </div>
      </form>
    </Dialog>
  );
}
