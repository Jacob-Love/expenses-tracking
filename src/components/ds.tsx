// Spectra design system components used by Ledger, ported 1:1 from
// project/_ds/.../_ds_bundle.js. Keep values in sync with that source.

import { useId, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export function Sparkline({ data = [], changePercent = null, width = 60, height = 28 }: { data?: number[]; changePercent?: number | null; width?: number; height?: number }) {
  const gid = `sparkfill-${useId().replace(/:/g, '')}`;
  if (!data.length) return null;
  const p = 2;
  const isUp = (changePercent ?? 0) > 0;
  const isNeutral = changePercent === null || changePercent === 0;
  const color = isNeutral ? '#8B5CF6' : isUp ? 'var(--roas-good)' : 'var(--roas-bad)';
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${p + (i / Math.max(1, data.length - 1)) * (width - p * 2)},${height - p - ((v - min) / range) * (height - p * 2)}`);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ flexShrink: 0 }} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={[`${p},${height}`, ...pts, `${width - p},${height}`].join(' ')} fill={`url(#${gid})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function ChangeTag({ percent, invertColor = false, neutral = false }: { percent?: number | null; invertColor?: boolean; neutral?: boolean }) {
  if (percent === null || percent === undefined) return null;
  const isUp = percent > 0, isZero = percent === 0;
  const color = isZero || neutral ? '#9CA3AF' : invertColor ? (isUp ? 'var(--roas-bad)' : 'var(--roas-good)') : isUp ? 'var(--roas-good)' : 'var(--roas-bad)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color }}>
      {!isZero && <span style={{ lineHeight: 1 }}>{isUp ? '↑' : '↓'}</span>}
      {Math.abs(percent)}%
    </span>
  );
}

export interface Breakdown { aLabel: string; aValue: string; bLabel: string; bValue: string }

function BreakdownRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, color, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

export function KpiCard({ label, value, changePercent = null, prevValue, invertColor = false, neutral = false, sparkData = [], breakdown, style }: {
  label: string; value: ReactNode; changePercent?: number | null; prevValue?: string; invertColor?: boolean; neutral?: boolean; sparkData?: number[]; breakdown?: Breakdown; style?: CSSProperties;
}) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 'var(--app-r-xl)', border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface-2)', backgroundImage: 'radial-gradient(130% 130% at 0% 0%, rgba(255,255,255,0.05), transparent 55%)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)', padding: 16, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
        <ChangeTag percent={changePercent} invertColor={invertColor} neutral={neutral} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 28, lineHeight: '34px', letterSpacing: '-0.02em', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
          {prevValue && <span style={{ fontSize: 11, color: '#4B5563' }}>from {prevValue}</span>}
        </div>
        <Sparkline data={sparkData} changePercent={changePercent} />
      </div>
      {breakdown && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'grid', gap: 2 }}>
          <BreakdownRow label={breakdown.aLabel} value={breakdown.aValue} color="rgba(52,211,153,.85)" />
          <BreakdownRow label={breakdown.bLabel} value={breakdown.bValue} color="rgba(56,189,248,.85)" />
        </div>
      )}
    </div>
  );
}

export function SidebarNavItem({ icon, label, active = false, collapsed = false, onClick }: { icon: ReactNode; label: string; active?: boolean; collapsed?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      className="nav-item"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', position: 'relative', padding: collapsed ? '12px 0' : '12px 24px', justifyContent: collapsed ? 'center' : undefined, color: active ? (collapsed ? '#818CF8' : '#fff') : '#9CA3AF', transition: 'color var(--t) var(--ease), background-color var(--t) var(--ease)', border: 0, background: 'transparent', width: '100%', textAlign: 'left', font: 'inherit' }}
    >
      {active && !collapsed && (
        <>
          <div style={{ position: 'absolute', insetBlock: 0, left: 0, right: 8, background: 'var(--surface-2)', borderRadius: 'var(--app-r-lg)' }} />
          <div style={{ position: 'absolute', insetBlock: 0, right: 8, width: 224, background: 'linear-gradient(to right, #171717, rgba(79,70,229,0.30))', borderTopRightRadius: 'var(--app-r-lg)', borderBottomRightRadius: 'var(--app-r-lg)' }} />
        </>
      )}
      {active && collapsed && <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-2)', borderRadius: 'var(--app-r-lg)' }} />}
      <span style={{ position: 'relative', zIndex: 10, flexShrink: 0, display: 'inline-flex' }}>{icon}</span>
      {!collapsed && <span style={{ position: 'relative', zIndex: 10, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 14 }}>{label}</span>}
    </button>
  );
}

export function Button({ variant = 'ghost', size = 'md', icon, iconRight, children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'ghost' | 'quiet'; size?: 'sm' | 'md' | 'lg'; icon?: ReactNode; iconRight?: ReactNode }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function Toggle({ on, loading, onToggle, label, style }: { on: boolean; loading?: boolean; onToggle?: (on: boolean) => void; label?: string; style?: CSSProperties }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!on}
      aria-label={label}
      disabled={loading}
      onClick={(e) => { e.stopPropagation(); onToggle?.(!on); }}
      style={{ position: 'relative', display: 'inline-flex', height: 18, width: 32, flexShrink: 0, borderRadius: 'var(--r-full)', border: 0, padding: 0, background: on ? '#2563EB' : '#374151', opacity: loading ? 0.4 : 1, cursor: loading ? 'wait' : 'pointer', transition: 'background-color .2s var(--ease)', ...style }}
    >
      <span style={{ pointerEvents: 'none', display: 'inline-block', height: 14, width: 14, marginTop: 2, marginLeft: 2, borderRadius: 'var(--r-full)', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.35)', transform: on ? 'translateX(14px)' : 'translateX(0)', transition: 'transform .2s var(--ease)' }} />
    </button>
  );
}

export function EmptyState({ icon, title, hint, action, size = 'inline', style }: { icon?: ReactNode; title: string; hint?: string; action?: { label: string; onClick: () => void }; size?: 'inline' | 'page'; style?: CSSProperties }) {
  const page = size === 'page';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: page ? '80px 24px' : '48px 20px', ...style }}>
      {icon && (
        <div aria-hidden="true" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--app-r-xl)', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', color: '#6B7280', height: page ? 48 : 40, width: page ? 48 : 40 }}>{icon}</div>
      )}
      <p style={{ margin: 0, fontWeight: 500, color: '#E5E7EB', fontSize: page ? 16 : 14, lineHeight: page ? '24px' : '20px' }}>{title}</p>
      {hint && <p style={{ margin: '6px 0 0', maxWidth: '42ch', fontSize: 13, lineHeight: '20px', color: '#6B7280' }}>{hint}</p>}
      {action && (
        <button type="button" onClick={action.onClick} style={{ marginTop: 20, borderRadius: 'var(--app-r-lg)', background: 'rgba(255,255,255,0.06)', padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#F3F4F6', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'background-color var(--t) var(--ease)' }}>{action.label}</button>
      )}
    </div>
  );
}
