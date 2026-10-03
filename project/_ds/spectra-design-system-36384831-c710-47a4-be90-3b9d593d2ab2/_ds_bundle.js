/* @ds-bundle: {"format":4,"namespace":"SpectraDesignSystem_363848","components":[{"name":"KpiCard","sourcePath":"components/data/KpiCard.jsx"},{"name":"ChangeTag","sourcePath":"components/data/KpiCard.jsx"},{"name":"KpiStrip","sourcePath":"components/data/KpiStrip.jsx"},{"name":"MetricTile","sourcePath":"components/data/MetricTile.jsx"},{"name":"Sparkline","sourcePath":"components/data/Sparkline.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"VerifyBadge","sourcePath":"components/data/VerifyBadge.jsx"},{"name":"SectionHeader","sourcePath":"components/marketing/SectionHeader.jsx"},{"name":"TerminalLog","sourcePath":"components/marketing/TerminalLog.jsx"},{"name":"NavPill","sourcePath":"components/navigation/NavPill.jsx"},{"name":"SidebarNavItem","sourcePath":"components/navigation/SidebarNavItem.jsx"},{"name":"UserProfileCard","sourcePath":"components/navigation/UserProfileCard.jsx"},{"name":"Badge","sourcePath":"components/primitives/Badge.jsx"},{"name":"Button","sourcePath":"components/primitives/Button.jsx"},{"name":"Chip","sourcePath":"components/primitives/Chip.jsx"},{"name":"Eyebrow","sourcePath":"components/primitives/Eyebrow.jsx"},{"name":"Toggle","sourcePath":"components/primitives/Toggle.jsx"},{"name":"BrowserFrame","sourcePath":"components/surfaces/BrowserFrame.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"EmptyState","sourcePath":"components/surfaces/EmptyState.jsx"},{"name":"IntegrationChip","sourcePath":"components/surfaces/IntegrationChip.jsx"},{"name":"PlanCard","sourcePath":"components/surfaces/PlanCard.jsx"}],"sourceHashes":{"components/data/KpiCard.jsx":"4378325253e2","components/data/KpiStrip.jsx":"d558024bf4e0","components/data/MetricTile.jsx":"1c86ad90c60b","components/data/Sparkline.jsx":"4fd537e6b456","components/data/StatCard.jsx":"938dd26a3471","components/data/VerifyBadge.jsx":"e7b6be8d613e","components/marketing/SectionHeader.jsx":"59291eece866","components/marketing/TerminalLog.jsx":"b7b44245001a","components/navigation/NavPill.jsx":"722dcdb39c05","components/navigation/SidebarNavItem.jsx":"179ddd73c352","components/navigation/UserProfileCard.jsx":"ae89b6e54079","components/primitives/Badge.jsx":"1db4aa8273b6","components/primitives/Button.jsx":"d5d55e736924","components/primitives/Chip.jsx":"735c4a615593","components/primitives/Eyebrow.jsx":"1c948254e1e8","components/primitives/Toggle.jsx":"5cd112782b48","components/surfaces/BrowserFrame.jsx":"ff39e5aa294f","components/surfaces/Card.jsx":"0aa921e9439f","components/surfaces/EmptyState.jsx":"0ff6f556a9e8","components/surfaces/IntegrationChip.jsx":"e3a8666e122b","components/surfaces/PlanCard.jsx":"cf0c676a1d1c","ui_kits/spectra-app/AdPerformanceScreen.jsx":"407d8710ce65","ui_kits/spectra-app/AppShell.jsx":"ae2acde30d8c","ui_kits/spectra-app/CampaignOpsScreen.jsx":"51fc5dcfe283","ui_kits/spectra-app/CreativeAnalyticsScreen.jsx":"9b295a51aee0","ui_kits/spectra-app/KratosScreen.jsx":"1ce4b82ce441","ui_kits/spectra-site/SiteChapters.jsx":"b7c55582914c","ui_kits/spectra-site/SiteTop.jsx":"836395e3d4bb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SpectraDesignSystem_363848 = window.SpectraDesignSystem_363848 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/KpiStrip.jsx
try { (() => {
/** Portfolio KPI strip — one bordered card divided into N cells. Used at the
 *  top of Campaign Ops. `tone` colours a cell's value semantically. */
function KpiStrip({
  cells = [],
  columns,
  style
}) {
  const cols = columns || Math.min(cells.length, 7);
  const toneColor = {
    good: 'var(--roas-good)',
    watch: 'var(--roas-watch)',
    bad: 'var(--roas-bad)',
    muted: '#6B7280'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-2)',
      backgroundImage: 'radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.05), transparent 52%)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
      borderRadius: 'var(--app-r-xl)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      ...style
    }
  }, cells.map((cell, i) => /*#__PURE__*/React.createElement("div", {
    key: cell.label,
    style: {
      padding: '12px 16px',
      borderLeft: i === 0 ? 'none' : '1px solid rgba(31,41,55,0.6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      lineHeight: '16px',
      color: '#6B7280',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: 4
    }
  }, cell.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontVariantNumeric: 'tabular-nums',
      color: toneColor[cell.tone] || '#fff'
    }
  }, cell.value))));
}
Object.assign(__ds_scope, { KpiStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/KpiStrip.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricTile.jsx
try { (() => {
/** Marketing figure tile. Mono micro-label, huge tabular number, optional
 *  mono caption. Sits on .stat-card chrome. */
function MetricTile({
  label,
  value,
  prefix = '',
  suffix = '',
  caption,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stat-card",
    style: {
      padding: '24px 20px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono t-micro"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "t-num",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum"
  }, prefix, value, suffix)), caption && /*#__PURE__*/React.createElement("div", {
    className: "mono t-micro",
    style: {
      marginTop: 8
    }
  }, caption));
}
Object.assign(__ds_scope, { MetricTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricTile.jsx", error: String((e && e.message) || e) }); }

// components/data/Sparkline.jsx
try { (() => {
/** 60×28 sparkline. Colour is driven by direction, not by series:
 *  emerald up, red down, violet when flat/unknown. */
function Sparkline({
  data = [],
  changePercent = null,
  width = 60,
  height = 28
}) {
  if (!data.length) return null;
  const pad = 2;
  const isUp = (changePercent ?? 0) > 0;
  const isNeutral = changePercent === null || changePercent === 0;
  const color = isNeutral ? '#8B5CF6' : isUp ? 'var(--roas-good)' : 'var(--roas-bad)';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + i / Math.max(1, data.length - 1) * (width - pad * 2);
    const y = height - pad - (v - min) / range * (height - pad * 2);
    return `${x},${y}`;
  });
  const gid = `sparkfill-${Math.abs(String(color).length + data.length + Math.round(max))}`;
  return /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.3"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("polygon", {
    points: [`${pad},${height}`, ...pts, `${width - pad},${height}`].join(' '),
    fill: `url(#${gid})`
  }), /*#__PURE__*/React.createElement("polyline", {
    points: pts.join(' '),
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }));
}
Object.assign(__ds_scope, { Sparkline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Sparkline.jsx", error: String((e && e.message) || e) }); }

// components/data/KpiCard.jsx
try { (() => {
/** The app's hero KPI card. Label + change tag, big tabular value with a
 *  sparkline, and a two-row breakdown so every card in the grid is the same
 *  height. Direction is always shown as an arrow; only colour encodes
 *  good/bad, and cost metrics invert it. */
function KpiCard({
  label,
  value,
  changePercent = null,
  prevValue,
  invertColor = false,
  neutral = false,
  sparkData = [],
  breakdown,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'var(--app-r-xl)',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'var(--surface-2)',
      backgroundImage: 'radial-gradient(130% 130% at 0% 0%, rgba(255,255,255,0.05), transparent 55%)',
      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      padding: 16,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#6B7280'
    }
  }, label), /*#__PURE__*/React.createElement(ChangeTag, {
    percent: changePercent,
    invertColor: invertColor,
    neutral: neutral
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      lineHeight: '34px',
      letterSpacing: '-0.02em',
      fontWeight: 700,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), prevValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#4B5563'
    }
  }, "from ", prevValue)), /*#__PURE__*/React.createElement(__ds_scope.Sparkline, {
    data: sparkData,
    changePercent: changePercent
  })), breakdown && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      paddingTop: 6,
      borderTop: '1px solid rgba(255,255,255,0.04)',
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(BreakdownRow, {
    label: breakdown.aLabel,
    value: breakdown.aValue,
    color: "rgba(52,211,153,.85)"
  }), /*#__PURE__*/React.createElement(BreakdownRow, {
    label: breakdown.bLabel,
    value: breakdown.bValue,
    color: "rgba(56,189,248,.85)"
  })));
}
function BreakdownRow({
  label,
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontWeight: 600,
      color,
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap'
    }
  }, value));
}
function ChangeTag({
  percent,
  invertColor = false,
  neutral = false
}) {
  if (percent === null || percent === undefined) return null;
  const isUp = percent > 0;
  const isZero = percent === 0;
  const color = isZero || neutral ? '#9CA3AF' : invertColor ? isUp ? 'var(--roas-bad)' : 'var(--roas-good)' : isUp ? 'var(--roas-good)' : 'var(--roas-bad)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      fontSize: 11,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      color
    }
  }, !isZero && /*#__PURE__*/React.createElement("span", {
    style: {
      lineHeight: 1
    }
  }, isUp ? '↑' : '↓'), Math.abs(percent), "%");
}
Object.assign(__ds_scope, { KpiCard, ChangeTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/KpiCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
/** Admin stat card: title, trend pill, big value, subtitle. Lifts 2% on
 *  hover when it is clickable. */
function StatCard({
  title,
  value,
  subtitle,
  trend,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    style: {
      background: 'var(--surface-2)',
      borderRadius: 'var(--app-r-xl)',
      border: '1px solid rgba(255,255,255,0.03)',
      padding: 24,
      cursor: onClick ? 'pointer' : undefined,
      transition: 'transform .3s var(--ease), box-shadow .3s var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: '18px',
      color: 'rgba(255,255,255,0.6)'
    }
  }, title), trend && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 8px',
      borderRadius: 'var(--r-full)',
      fontSize: 12,
      fontWeight: 500,
      background: trend.isPositive ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
      color: trend.isPositive ? 'var(--roas-good)' : 'var(--roas-bad)',
      boxShadow: `0 0 0 1px ${trend.isPositive ? 'rgba(52,211,153,0.20)' : 'rgba(248,113,113,0.20)'}`
    }
  }, trend.value)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      lineHeight: '34px',
      letterSpacing: '-0.02em',
      fontWeight: 700,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      lineHeight: '18px',
      color: 'rgba(255,255,255,0.5)',
      margin: '4px 0 0'
    }
  }, subtitle));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/VerifyBadge.jsx
try { (() => {
/** The verification badge. Spectra re-reads Meta after every write, so this
 *  is the product's signature state: VERIFIED pulses, REVERTED warns,
 *  CHECKING is quiet. */
function VerifyBadge({
  state = 'verified'
}) {
  const m = {
    verified: {
      t: 'VERIFIED',
      c: 'var(--ok)',
      b: 'var(--ok-dim)',
      ring: true
    },
    reverted: {
      t: 'REVERTED',
      c: 'var(--warn)',
      b: 'var(--warn-dim)',
      ring: false
    },
    pending: {
      t: 'CHECKING',
      c: 'var(--text-3)',
      b: 'rgba(255,255,255,.05)',
      ring: false
    }
  }[state];
  return /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0,
      fontSize: 10,
      letterSpacing: '1.1px',
      color: m.c,
      background: m.b,
      padding: '2px 7px',
      borderRadius: 'var(--r-full)',
      border: `1px solid ${m.c}30`,
      animation: m.ring ? 'pulseRing 2.6s var(--ease) infinite' : undefined
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: m.c
    }
  }), m.t);
}
Object.assign(__ds_scope, { VerifyBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/VerifyBadge.jsx", error: String((e && e.message) || e) }); }

// components/marketing/TerminalLog.jsx
try { (() => {
/** Agent transcript. Mono 11.5/23, timestamp + source column + message,
 *  with an optional verification badge on the right. GROUND TRUTH lines are
 *  emerald, META lines are dim, everything else is accent. */
function TerminalLog({
  lines = [],
  minHeight = 0,
  style
}) {
  const col = w => w === 'GROUND TRUTH' ? 'var(--ok)' : w === 'META' ? 'var(--text-4)' : 'var(--accent)';
  return /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      padding: '16px',
      fontSize: 11.5,
      lineHeight: '23px',
      minHeight,
      ...style
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-4)',
      flexShrink: 0
    }
  }, l.time), /*#__PURE__*/React.createElement("span", {
    style: {
      color: col(l.who),
      minWidth: 92,
      flexShrink: 0
    }
  }, l.who), /*#__PURE__*/React.createElement("span", {
    style: {
      color: l.dim ? 'var(--text-4)' : 'var(--text-2)',
      flex: 1
    }
  }, l.message), l.badge && /*#__PURE__*/React.createElement(__ds_scope.VerifyBadge, {
    state: l.badge
  }))));
}
Object.assign(__ds_scope, { TerminalLog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/TerminalLog.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavPill.jsx
try { (() => {
/** The marketing site's floating liquid-glass nav. 60px tall, 18px radius,
 *  blur(22px) saturate(1.7) so the hero's violet pulls through the glass,
 *  and a gradient ring for the glass edge. Shrinks to 54px on scroll. */
function NavPill({
  logo,
  links = [],
  actions,
  scrolled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nav-shell",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: `nav-pill${scrolled ? ' is-scrolled' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      zIndex: 3
    }
  }, logo), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      marginLeft: 10,
      zIndex: 3
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    className: "nav-l",
    href: l.href || '#'
  }, l.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      zIndex: 3
    }
  }, actions)));
}
Object.assign(__ds_scope, { NavPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavPill.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNavItem.jsx
try { (() => {
/** Sidebar row. The active state is the app's signature: a #171717 pill with
 *  an indigo gradient bleeding off its right edge. Collapsed (68px) drops the
 *  label and tints the icon indigo instead. */
function SidebarNavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    title: collapsed ? label : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      position: 'relative',
      padding: collapsed ? '12px 0' : '12px 24px',
      justifyContent: collapsed ? 'center' : undefined,
      color: active ? collapsed ? '#818CF8' : '#fff' : '#9CA3AF',
      transition: 'color var(--t) var(--ease), background-color var(--t) var(--ease)'
    }
  }, active && !collapsed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      insetBlock: 0,
      left: 0,
      right: 8,
      background: 'var(--surface-2)',
      borderRadius: 'var(--app-r-lg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      insetBlock: 0,
      right: 8,
      width: 224,
      background: 'linear-gradient(to right, #171717, rgba(79,70,229,0.30))',
      borderTopRightRadius: 'var(--app-r-lg)',
      borderBottomRightRadius: 'var(--app-r-lg)'
    }
  })), active && collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surface-2)',
      borderRadius: 'var(--app-r-lg)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
      display: 'inline-flex'
    }
  }, icon), !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      zIndex: 10,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      fontSize: 14
    }
  }, label));
}
Object.assign(__ds_scope, { SidebarNavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNavItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/UserProfileCard.jsx
try { (() => {
/** Sidebar footer card. #171717 at 80% with a top-down white gradient, a
 *  round avatar (initial fallback) and a stacked chevron pair. */
function UserProfileCard({
  name,
  email,
  avatar,
  collapsed = false,
  onClick
}) {
  const initial = (name || '?').charAt(0).toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: 'relative',
      background: 'rgba(23,23,23,0.8)',
      borderRadius: 'var(--app-r-xl)',
      padding: collapsed ? 8 : 12,
      margin: collapsed ? '8px 0 16px' : '12px 0 24px',
      border: '1px solid rgba(255,255,255,0.03)',
      backdropFilter: 'blur(6px)',
      cursor: 'pointer',
      transition: 'background-color var(--t) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--app-r-xl)',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: collapsed ? 0 : 12,
      justifyContent: collapsed ? 'center' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: collapsed ? 32 : 40,
      height: collapsed ? 32 : 40,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      background: 'var(--surface-4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, avatar ? /*#__PURE__*/React.createElement("img", {
    src: avatar,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'rgba(255,255,255,0.7)'
    }
  }, initial)), !collapsed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
      color: 'rgba(255,255,255,0.9)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'rgba(255,255,255,0.5)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, email)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      color: 'rgba(255,255,255,0.5)',
      fontSize: 9,
      lineHeight: '9px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u25B2"), /*#__PURE__*/React.createElement("span", null, "\u25BC")))));
}
Object.assign(__ds_scope, { UserProfileCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/UserProfileCard.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Badge.jsx
try { (() => {
/** App badge. 4 variants, 6px radius, 12px semibold. */
function Badge({
  variant = 'default',
  children,
  style
}) {
  const v = {
    default: {
      background: 'var(--primary)',
      color: '#fff',
      borderColor: 'transparent'
    },
    secondary: {
      background: 'rgba(255,255,255,0.04)',
      color: 'var(--app-fg)',
      borderColor: 'transparent'
    },
    destructive: {
      background: 'rgba(239,68,68,0.20)',
      color: '#FECACA',
      borderColor: 'transparent'
    },
    outline: {
      background: 'transparent',
      color: 'var(--app-fg)',
      borderColor: 'rgba(255,255,255,0.10)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'var(--app-r-sm)',
      border: '1px solid',
      padding: '2px 10px',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 600,
      transition: 'color var(--t) var(--ease), background-color var(--t) var(--ease)',
      ...v,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Badge.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Spectra button. Three tones, three sizes. Solid is the single accent —
 *  spend it once per view. Height/padding are fixed: 36 / 30 / 42px. */
function Button({
  variant = 'ghost',
  size = 'md',
  as = 'button',
  icon,
  iconRight,
  disabled,
  children,
  style,
  ...rest
}) {
  const Tag = as;
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    disabled: Tag === 'button' ? disabled : undefined,
    style: style
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Button.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Chip.jsx
try { (() => {
/** Mono status chip. Tone carries data meaning, never decoration. */
function Chip({
  tone = 'neutral',
  children,
  style
}) {
  const c = {
    neutral: 'var(--text-3)',
    ok: 'var(--ok)',
    warn: 'var(--warn)',
    bad: 'var(--bad)',
    accent: 'var(--accent)'
  }[tone];
  const b = {
    neutral: 'rgba(255,255,255,.05)',
    ok: 'var(--ok-dim)',
    warn: 'var(--warn-dim)',
    bad: 'var(--bad-dim)',
    accent: 'var(--accent-dim)'
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 10,
      letterSpacing: '1.1px',
      color: c,
      background: b,
      padding: '3px 8px',
      borderRadius: 'var(--r-full)',
      border: `1px solid ${c}26`,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Chip.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Eyebrow.jsx
try { (() => {
/** Section marker: a bordered chip with a violet dot and a mono uppercase
 *  label. The label whispers, the headline talks. `plain` drops the chip. */
function Eyebrow({
  children,
  dot = true,
  plain = false
}) {
  const inner = /*#__PURE__*/React.createElement("span", {
    className: "mono t-label",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap'
    }
  }, dot && /*#__PURE__*/React.createElement("i", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      flexShrink: 0,
      background: 'var(--accent)'
    }
  }), children);
  return plain ? inner : /*#__PURE__*/React.createElement("span", {
    className: "eyebrow-chip"
  }, inner);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHeader.jsx
try { (() => {
/** The site's section grammar. Default: label + H2 + lede stacked left.
 *  `split`: H2 left (6 cols), lede right (cols 8–12) — the Linear/Neon
 *  layout. Never centre a section header except in hero and CTA. */
function SectionHeader({
  label,
  title,
  lede,
  split = false,
  center = false,
  wide = false,
  style
}) {
  if (split) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, minmax(0,1fr))',
        columnGap: 40,
        rowGap: 20,
        alignItems: 'end',
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: 'span 6'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, label), /*#__PURE__*/React.createElement("h2", {
      className: "t-h2",
      style: {
        marginTop: 20,
        marginBottom: 0
      }
    }, title)), lede && /*#__PURE__*/React.createElement("p", {
      className: "t-lede",
      style: {
        gridColumn: '8 / span 5',
        margin: 0
      }
    }, lede));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: center ? 'center' : undefined,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: center ? 'flex' : undefined,
      justifyContent: center ? 'center' : undefined
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, label)), /*#__PURE__*/React.createElement("h2", {
    className: "t-h2",
    style: {
      marginTop: 20,
      marginBottom: 0,
      maxWidth: wide ? '28ch' : '19ch',
      marginInline: center ? 'auto' : undefined
    }
  }, title), lede && /*#__PURE__*/React.createElement("p", {
    className: "t-lede",
    style: {
      marginTop: 20,
      marginBottom: 0,
      maxWidth: '64ch',
      marginInline: center ? 'auto' : undefined
    }
  }, lede));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Toggle.jsx
try { (() => {
/** The Meta Ads Manager toggle, as used on every campaign row.
 *  32×18 track, 14px knob, blue when on. */
function Toggle({
  on,
  loading,
  onToggle,
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": !!on,
    "aria-label": label,
    disabled: loading,
    onClick: e => {
      e.stopPropagation();
      onToggle && onToggle(!on);
    },
    style: {
      position: 'relative',
      display: 'inline-flex',
      height: 18,
      width: 32,
      flexShrink: 0,
      borderRadius: 'var(--r-full)',
      border: 0,
      padding: 0,
      background: on ? '#2563EB' : '#374151',
      opacity: loading ? 0.4 : 1,
      cursor: loading ? 'wait' : 'pointer',
      transition: 'background-color .2s var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      pointerEvents: 'none',
      display: 'inline-block',
      height: 14,
      width: 14,
      marginTop: 2,
      marginLeft: 2,
      borderRadius: 'var(--r-full)',
      background: '#fff',
      boxShadow: '0 1px 2px rgba(0,0,0,.35)',
      transform: on ? 'translateX(14px)' : 'translateX(0)',
      transition: 'transform .2s var(--ease)'
    }
  }));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/BrowserFrame.jsx
try { (() => {
/** Product chrome. A 34px title bar with three #33363B dots and a centred
 *  mono URL, then the screen. Every product visual on the site sits in one. */
function BrowserFrame({
  url,
  glow = false,
  children,
  style,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bframe${glow ? ' bframe-glow' : ''} ${className}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 12px',
      height: 34,
      flexShrink: 0,
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: '#33363B'
    }
  }))), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      flex: 1,
      textAlign: 'center',
      fontSize: 10.5,
      color: 'var(--text-4)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, url), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42
    }
  })), children);
}
Object.assign(__ds_scope, { BrowserFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/BrowserFrame.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Surface. `variant="site"` is the marketing card (#121316, 6px, hairline);
 *  `variant="app"` is the dashboard card (#171717, 14px, corner sheen,
 *  inset top light). Depth comes from light, never from a colour wash. */
function Card({
  variant = 'site',
  interactive = false,
  topHighlight = false,
  children,
  style,
  ...rest
}) {
  const cls = variant === 'app' ? 'glass-card' : `card${interactive ? ' card-i' : ''}`;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: style
  }, rest), variant === 'app' && topHighlight && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 24,
      right: 24,
      top: 0,
      height: 1,
      pointerEvents: 'none',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: variant === 'app' ? 'relative' : undefined
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/EmptyState.jsx
try { (() => {
/** The moment most products waste. A quiet framed glyph, a title that says
 *  what WOULD be here (never "no data"), one line on how it gets filled,
 *  and an optional action. */
function EmptyState({
  icon,
  title,
  hint,
  action,
  size = 'inline',
  style
}) {
  const page = size === 'page';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: page ? '80px 24px' : '48px 20px',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--app-r-xl)',
      border: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(255,255,255,0.02)',
      color: '#6B7280',
      height: page ? 48 : 40,
      width: page ? 48 : 40
    }
  }, icon), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 500,
      color: '#E5E7EB',
      fontSize: page ? 16 : 14,
      lineHeight: page ? '24px' : '20px'
    }
  }, title), hint && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      maxWidth: '42ch',
      fontSize: 13,
      lineHeight: '20px',
      color: '#6B7280'
    }
  }, hint), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: action.onClick,
    style: {
      marginTop: 20,
      borderRadius: 'var(--app-r-lg)',
      background: 'rgba(255,255,255,0.06)',
      padding: '8px 14px',
      fontSize: 13,
      fontWeight: 500,
      color: '#F3F4F6',
      border: '1px solid rgba(255,255,255,0.08)',
      cursor: 'pointer',
      transition: 'background-color var(--t) var(--ease)'
    }
  }, action.label));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/IntegrationChip.jsx
try { (() => {
/** Integration tile. Monochrome mark on a neutral tile — six brand palettes
 *  in one strip reads as a logo salad. `status` drives the dot; "soon"
 *  dashes the border and dims the whole chip. */
function IntegrationChip({
  name,
  mark,
  status = 'live',
  style
}) {
  const soon = status === 'soon';
  const dot = {
    live: 'var(--ok)',
    beta: 'var(--warn)',
    soon: 'var(--text-4)'
  }[status];
  return /*#__PURE__*/React.createElement("span", {
    className: `integ-chip${soon ? ' is-soon' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "integ-mark"
  }, mark), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      letterSpacing: '-0.13px',
      whiteSpace: 'nowrap'
    }
  }, name), /*#__PURE__*/React.createElement("i", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 'var(--r-full)',
      marginLeft: 1,
      background: dot
    }
  }));
}
Object.assign(__ds_scope, { IntegrationChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/IntegrationChip.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/PlanCard.jsx
try { (() => {
/** Pricing tier card. Every plan is the whole product, so the shared
 *  inclusions live under the grid — a plan card carries name, price, one
 *  line, its own limits and a CTA. Featured is lifted by an accent ring. */
function PlanCard({
  name,
  price,
  cadence = '/mo',
  blurb,
  points = [],
  cta,
  featured = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `plan${featured ? ' is-featured' : ''}`,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono t-micro"
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 34,
      lineHeight: 1,
      letterSpacing: '-1.2px',
      fontWeight: 500,
      fontVariantNumeric: 'tabular-nums'
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    className: "t-sm"
  }, cadence)), blurb && /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      marginTop: 10,
      marginBottom: 0
    }
  }, blurb), points.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '18px 0 22px',
      padding: 0,
      display: 'grid',
      gap: 9
    }
  }, points.map(p => /*#__PURE__*/React.createElement("li", {
    key: p,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 16,
      height: 16,
      marginTop: 2,
      borderRadius: 5,
      display: 'grid',
      placeContent: 'center',
      color: 'var(--accent)',
      background: 'var(--accent-dim)',
      border: '1px solid var(--accent-line)',
      fontSize: 10
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    className: "t-sm",
    style: {
      color: 'var(--text-2)'
    }
  }, p)))), cta && /*#__PURE__*/React.createElement("a", {
    className: `btn ${featured ? 'btn-solid' : 'btn-ghost'}`,
    href: "#",
    style: {
      marginTop: 'auto',
      justifyContent: 'center'
    }
  }, cta));
}
Object.assign(__ds_scope, { PlanCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/PlanCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spectra-app/AdPerformanceScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Ad Performance — the default admin landing page. Every ad across every
   connected Meta account, with the TripleWhale-sourced channel split. */

function AdPerformanceScreen() {
  const {
    KpiCard,
    KpiStrip,
    Card,
    Chip,
    Badge
  } = window.SpectraKit;
  const [syncing, setSyncing] = React.useState(false);
  const sync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1400);
  };
  const hero = [{
    label: 'ROAS',
    value: '3.41x',
    changePercent: 8,
    prevValue: '3.16x',
    sparkData: [2.6, 2.9, 2.7, 3.1, 3.0, 3.4, 3.41],
    breakdown: {
      aLabel: 'New',
      aValue: '2.10x',
      bLabel: 'Repeat',
      bValue: '1.31x'
    }
  }, {
    label: 'Revenue',
    value: '$243,880',
    changePercent: 14,
    prevValue: '$213,900',
    sparkData: [28, 31, 29, 36, 34, 39, 41],
    breakdown: {
      aLabel: 'New',
      aValue: '$150,321',
      bLabel: 'Repeat',
      bValue: '$93,559'
    }
  }, {
    label: 'Total Spend',
    value: '$71,516',
    changePercent: 4,
    prevValue: '$68,760',
    neutral: true,
    sparkData: [9.2, 10.1, 9.8, 10.6, 10.2, 10.8, 10.9],
    breakdown: {
      aLabel: 'Daily Avg',
      aValue: '$10,216',
      bLabel: 'Prev Avg',
      bValue: '$9,822'
    }
  }, {
    label: 'Purchases',
    value: '1,204',
    changePercent: -3,
    prevValue: '1,241',
    sparkData: [180, 175, 168, 172, 166, 171, 172],
    breakdown: {
      aLabel: 'New',
      aValue: '742',
      bLabel: 'Repeat',
      bValue: '462'
    }
  }];
  const secondary = [{
    label: 'CPM',
    value: '$18.42',
    invert: true
  }, {
    label: 'CPA',
    value: '$59.40',
    change: 6,
    invert: true
  }, {
    label: 'Cost per Click',
    value: '$1.31',
    invert: true
  }, {
    label: 'CTR',
    value: '1.41%'
  }, {
    label: 'Clicks',
    value: '54,592'
  }, {
    label: 'Impressions',
    value: '3,882,104'
  }, {
    label: 'Conv. Rate',
    value: '2.21%',
    change: 2
  }, {
    label: 'AOV',
    value: '$202.56',
    change: 5
  }];
  const creatives = [{
    name: 'ugc_hookA_offerfirst_v3',
    type: 'Video',
    spend: '$18,204',
    roas: 4.82,
    ctr: '1.92%',
    hook: '31%',
    status: 'Active'
  }, {
    name: 'static_banner_offer_v7',
    type: 'Image',
    spend: '$12,880',
    roas: 3.64,
    ctr: '1.51%',
    hook: '—',
    status: 'Active'
  }, {
    name: 'ugc_founder_story_v2',
    type: 'Video',
    spend: '$9,412',
    roas: 2.91,
    ctr: '1.34%',
    hook: '24%',
    status: 'Active'
  }, {
    name: 'carousel_compare_v1',
    type: 'Carousel',
    spend: '$6,770',
    roas: 2.18,
    ctr: '0.98%',
    hook: '—',
    status: 'Paused'
  }, {
    name: 'static_testimonial_v4',
    type: 'Image',
    spend: '$4,102',
    roas: 1.74,
    ctr: '0.81%',
    hook: '—',
    status: 'Rejected'
  }];
  const roasTone = v => v >= 3 ? 'var(--roas-good)' : v >= 2.5 ? 'var(--roas-watch)' : 'var(--roas-bad)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      maxWidth: 1400,
      margin: '0 auto',
      display: 'grid',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 16px',
      background: 'rgba(245,158,11,0.10)',
      border: '1px solid rgba(245,158,11,0.20)',
      borderRadius: 'var(--app-r-xl)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "database",
    size: 16,
    color: "var(--app-warning)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      lineHeight: '20px',
      color: 'rgba(253,230,138,0.85)'
    }
  }, /*#__PURE__*/React.createElement("b", null, "Showing TripleWhale data."), " Meta has no spend recorded for this date range yet, so these numbers come from TripleWhale (brand-level \u2014 not split by individual ad account).")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 28,
      lineHeight: '34px',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(to right,#fff,rgba(255,255,255,0.7))',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "Welcome back, Jordan"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 13,
      color: 'rgba(255,255,255,0.45)'
    }
  }, "Check in on your ad performance & metrics.")), /*#__PURE__*/React.createElement(PageToolbar, {
    onSync: sync,
    syncing: syncing
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12
    }
  }, hero.map(c => /*#__PURE__*/React.createElement(KpiCard, _extends({
    key: c.label
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12
    }
  }, secondary.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.label,
    style: {
      borderRadius: 'var(--app-r-xl)',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'var(--surface-2)',
      backgroundImage: 'radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.05), transparent 52%)',
      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#4B5563',
      marginBottom: 2
    }
  }, m.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums'
    }
  }, m.value), m.change != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: m.invert ? 'var(--roas-bad)' : 'var(--roas-good)'
    }
  }, "\u2191", m.change, "%"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    hint: "sourced from TripleWhale"
  }, "Channel breakdown"), /*#__PURE__*/React.createElement(KpiStrip, {
    columns: 4,
    cells: [{
      label: 'Facebook',
      value: '$52,104 · 3.62x',
      tone: 'good'
    }, {
      label: 'Google',
      value: '$12,980 · 2.71x',
      tone: 'watch'
    }, {
      label: 'TikTok',
      value: '$6,432 · 2.14x',
      tone: 'bad'
    }, {
      label: 'Blended',
      value: '$71,516 · 3.41x',
      tone: 'good'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Conversion funnel"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginTop: 12
    }
  }, [['Impressions', '3,882,104', 100], ['Link clicks', '54,592', 62], ['Landing views', '48,110', 51], ['Add to cart', '9,204', 28], ['Purchases', '1,204', 14]].map(([l, v, w]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: '#9CA3AF',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#EDEDED',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 3,
      background: 'rgba(255,255,255,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${w}%`,
      height: '100%',
      borderRadius: 3,
      background: 'linear-gradient(90deg,var(--primary),var(--primary-hover))'
    }
  })))))), /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    hint: "spend vs revenue, 14 days"
  }, "Metrics trend"), /*#__PURE__*/React.createElement(TrendChart, null))), /*#__PURE__*/React.createElement(Card, {
    variant: "app"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Creative performance"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, "5 of 2,867")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Creative', 'Type', 'Spend', 'ROAS', 'CTR', 'Hook rate', 'Status'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: i > 1 ? 'right' : 'left',
      padding: '10px 16px',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#4B5563',
      fontWeight: 600,
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, creatives.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.name,
    style: {
      borderBottom: '1px solid rgba(31,41,55,0.35)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 6,
      background: 'var(--surface-4)',
      display: 'grid',
      placeContent: 'center',
      color: '#6B7280'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.type === 'Video' ? 'play' : c.type === 'Carousel' ? 'gallery-horizontal' : 'image',
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 12,
      color: '#D1D5DB'
    }
  }, c.name))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      fontSize: 12,
      color: '#6B7280'
    }
  }, c.type), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'right',
      fontSize: 13,
      color: '#D1D5DB',
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.spend), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'right',
      fontSize: 13,
      fontWeight: 600,
      color: roasTone(c.roas),
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.roas.toFixed(2), "x"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'right',
      fontSize: 13,
      color: '#9CA3AF',
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.ctr), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'right',
      fontSize: 13,
      color: '#9CA3AF',
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.hook), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    tone: c.status === 'Active' ? 'ok' : c.status === 'Rejected' ? 'bad' : 'neutral'
  }, c.status.toUpperCase()))))))));
}
function TrendChart() {
  const spend = [9.2, 10.1, 9.8, 10.6, 10.2, 10.8, 10.9, 11.2, 10.4, 11.8, 12.1, 11.4, 12.6, 12.9];
  const rev = [28, 31, 29, 36, 34, 39, 41, 44, 38, 46, 49, 43, 51, 54];
  const W = 520,
    H = 150,
    P = 6;
  const path = (arr, max) => arr.map((v, i) => `${P + i / (arr.length - 1) * (W - P * 2)},${H - P - v / max * (H - P * 2)}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%',
      height: 150,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "revfill",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#6366F1",
    stopOpacity: "0.30"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#6366F1",
    stopOpacity: "0"
  }))), [0.25, 0.5, 0.75].map(f => /*#__PURE__*/React.createElement("line", {
    key: f,
    x1: 0,
    x2: W,
    y1: H * f,
    y2: H * f,
    stroke: "rgba(255,255,255,0.05)"
  })), /*#__PURE__*/React.createElement("polygon", {
    points: `${P},${H} ${path(rev, 60)} ${W - P},${H}`,
    fill: "url(#revfill)"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: path(rev, 60),
    fill: "none",
    stroke: "#6366F1",
    strokeWidth: "2",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: path(spend, 16),
    fill: "none",
    stroke: "#34D399",
    strokeWidth: "1.5",
    strokeDasharray: "3 3",
    strokeLinejoin: "round"
  }));
}
Object.assign(window, {
  AdPerformanceScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spectra-app/AdPerformanceScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spectra-app/AppShell.jsx
try { (() => {
/* Shared bits for the Spectra app kit: Lucide icons (the app's real icon
   set), the neutral page background, and the sidebar. */

/* Lucide is the app's real icon set. lucide's UMD build keys its icon nodes
   in PascalCase, so kebab names are converted before lookup. */
const pascal = s => s.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const node = window.lucide?.icons?.[pascal(name)];
    if (!node || !ref.current) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    Object.entries({
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      'stroke-width': strokeWidth,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }).forEach(([k, v]) => svg.setAttribute(k, v));
    /* lucide's vanilla build stores an icon as [tag, attrs, children]; the
       drawing instructions are the third slot. */
    const kids = Array.isArray(node) && typeof node[0] === 'string' && Array.isArray(node[2]) ? node[2] : node;
    (Array.isArray(kids) ? kids : []).forEach(([tag, attrs]) => {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
      svg.appendChild(el);
    });
    ref.current.replaceChildren(svg);
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }
  });
}

/* Deliberately colourless. Any colour in the product comes from data and the
   indigo accent, never from ambient wash — a tinted backdrop bleeds through
   every translucent card and reads as a purple UI. */
function SpectraBackground() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: 'var(--surface-0)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--page-lift)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--page-vignette)'
    }
  }));
}
const NAV = [{
  page: 'ad-performance',
  label: 'Ad Performance',
  icon: 'bar-chart-3'
}, {
  page: 'kratos',
  label: 'Kratos',
  icon: 'bot'
}, {
  page: 'campaign-ops',
  label: 'Campaign Ops',
  icon: 'activity'
}, {
  page: 'creative-analytics',
  label: 'Creative Analytics',
  icon: 'sparkles'
}, {
  page: 'creative-dashboard',
  label: 'Creative Dashboard',
  icon: 'layout-dashboard'
}, {
  page: 'growth-guide',
  label: 'Growth Guide',
  icon: 'lightbulb'
}, {
  page: 'learnings',
  label: 'Learnings',
  icon: 'brain'
}, {
  page: 'competitors',
  label: 'Competitors',
  icon: 'search'
}, {
  page: 'winner-scaler',
  label: 'Winner Scaler',
  icon: 'zap'
}, {
  page: 'ad-launcher',
  label: 'Ad Launcher',
  icon: 'rocket'
}, {
  page: 'decision-log',
  label: 'Decision Log',
  icon: 'scroll-text'
}, {
  page: 'rejections',
  label: 'Ad Rejections',
  icon: 'shield-alert'
}, {
  page: 'ad-factory',
  label: 'Ad Factory',
  icon: 'factory'
}, {
  page: 'billing',
  label: 'Billing',
  icon: 'credit-card'
}];
function Sidebar({
  page,
  onPage,
  collapsed,
  onToggle
}) {
  const {
    SidebarNavItem,
    UserProfileCard
  } = window.SpectraKit;
  const w = collapsed ? 68 : 280;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: w,
      background: 'var(--surface-0)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      transition: 'width .3s var(--ease)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: collapsed ? 16 : '24px 24px 8px',
      justifyContent: collapsed ? 'center' : 'space-between'
    }
  }, !collapsed && /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/spectra-app-logo.png",
    alt: "Spectra",
    style: {
      height: 24
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    title: collapsed ? 'Expand sidebar' : 'Collapse sidebar',
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 'var(--app-r-lg)',
      color: '#6B7280',
      background: 'transparent',
      border: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: collapsed ? 'panel-left' : 'panel-left-close',
    size: 20
  }))), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#4B5563',
      fontWeight: 600,
      marginBottom: 6,
      paddingLeft: 2
    }
  }, "Brand"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface-3)',
      borderRadius: 'var(--app-r)',
      padding: '8px 10px',
      fontSize: 13,
      color: '#D1D5DB'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 16,
    color: "#6B7280"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, "All Brands"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16,
    color: "#6B7280"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--surface-3)',
      borderRadius: 'var(--app-r-sm)',
      display: 'flex',
      alignItems: 'center',
      padding: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Search...",
    style: {
      background: 'transparent',
      border: 0,
      outline: 'none',
      flex: 1,
      paddingLeft: 8,
      color: '#D1D5DB',
      fontFamily: 'inherit',
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, ['⌘', 'F'].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      fontSize: 12,
      background: 'var(--surface-4)',
      padding: '4px 8px',
      borderRadius: 4,
      color: '#9CA3AF'
    }
  }, k))))), /*#__PURE__*/React.createElement("nav", {
    style: {
      marginTop: collapsed ? 8 : 24,
      flex: 1,
      overflowY: 'auto'
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement(SidebarNavItem, {
    key: n.page,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 20
    }),
    label: n.label,
    active: page === n.page,
    collapsed: collapsed,
    onClick: () => onPage(n.page)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: collapsed ? '0 8px 4px' : '0 16px 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      borderRadius: 'var(--app-r-lg)',
      padding: collapsed ? '8px 0' : '8px 12px',
      fontSize: 14,
      color: '#6B7280',
      justifyContent: collapsed ? 'center' : undefined,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "compass",
    size: 20
  }), !collapsed && /*#__PURE__*/React.createElement("span", null, "Product guide"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: collapsed ? '0 8px' : '0 16px'
    }
  }, /*#__PURE__*/React.createElement(UserProfileCard, {
    name: "Jordan Reyes",
    email: "jordan@agency.co",
    collapsed: collapsed
  })));
}

/* Page header used by every screen: account picker, date range, sync. */
function PageToolbar({
  account = 'All ad accounts (12)',
  range = 'Last 7 days',
  onSync,
  syncing
}) {
  const pill = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: 34,
    padding: '0 12px',
    borderRadius: 'var(--app-r)',
    background: 'var(--surface-2)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 13,
    color: '#D1D5DB',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: pill
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wallet",
    size: 16,
    color: "#6B7280"
  }), account, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14,
    color: "#6B7280"
  })), /*#__PURE__*/React.createElement("span", {
    style: pill
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 16,
    color: "#6B7280"
  }), range, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14,
    color: "#6B7280"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onSync,
    style: {
      ...pill,
      background: 'var(--primary)',
      border: 0,
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw",
    size: 15
  }), syncing ? 'Syncing…' : 'Sync now'));
}
function SectionTitle({
  children,
  hint
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#EDEDED'
    }
  }, children), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#6B7280'
    }
  }, hint));
}
Object.assign(window, {
  Icon,
  SpectraBackground,
  Sidebar,
  PageToolbar,
  SectionTitle,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spectra-app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spectra-app/CampaignOpsScreen.jsx
try { (() => {
/* Campaign Ops — every ad account on one page, with a live switch on every
   campaign. Rows expand into the campaign grid; Resurrect rebuilds a
   restricted account into a live one. */

function CampaignOpsScreen() {
  const {
    KpiStrip,
    Card,
    Toggle,
    Chip,
    Button,
    Badge
  } = window.SpectraKit;
  const [open, setOpen] = React.useState('acct-2');
  const [states, setStates] = React.useState({
    c1: true,
    c2: true,
    c3: false,
    c4: true,
    c5: true,
    c6: false
  });
  const [resurrect, setResurrect] = React.useState(false);
  const accounts = [{
    id: 'acct-1',
    name: 'Account 01 — Prospecting',
    meta: '1029384756',
    spend: '$21.4k',
    roas: 3.82,
    restricted: false,
    campaigns: [{
      id: 'c1',
      name: 'ABO_Broad_Winners_v4',
      spend: '$8,204',
      roas: 4.11
    }, {
      id: 'c2',
      name: 'ADV+_Catalog_Retarget',
      spend: '$6,120',
      roas: 3.42
    }, {
      id: 'c3',
      name: 'CBO_LAL2%_Test',
      spend: '$2,980',
      roas: 2.14
    }]
  }, {
    id: 'acct-2',
    name: 'Account 02 — Scaling',
    meta: '2048571936',
    spend: '$34.9k',
    roas: 3.14,
    restricted: false,
    campaigns: [{
      id: 'c4',
      name: 'CBO_Winners_Scale_v9',
      spend: '$18,410',
      roas: 3.66
    }, {
      id: 'c5',
      name: 'ABO_Hook_Test_Aug',
      spend: '$9,880',
      roas: 2.71
    }, {
      id: 'c6',
      name: 'ADV+_Cold_Broad',
      spend: '$6,610',
      roas: 2.28
    }]
  }, {
    id: 'acct-3',
    name: 'Account 03 — Backup',
    meta: '3910284756',
    spend: '—',
    roas: 0,
    restricted: true,
    campaigns: []
  }];
  const roasTone = v => v === 0 ? 'var(--roas-none)' : v >= 3 ? 'var(--roas-good)' : v >= 2.5 ? 'var(--roas-watch)' : 'var(--roas-bad)';
  const th = {
    textAlign: 'left',
    padding: '10px 16px',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#4B5563',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      maxWidth: 1400,
      margin: '0 auto',
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, "Campaign Ops"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 13,
      color: 'rgba(255,255,255,0.45)'
    }
  }, "Live state across every connected account. Changes fire to Meta and are re-read an hour later.")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "copy",
      size: 15
    })
  }, "Replicate"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "heart-pulse",
      size: 15
    }),
    onClick: () => setResurrect(true)
  }, "Resurrect account")), /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#6B7280',
      marginBottom: 4
    }
  }, "Total Spend (7D)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      lineHeight: 1,
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$56,310")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trending-up",
    size: 20,
    color: "var(--roas-good)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--roas-good)'
    }
  }, "3.41x"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#6B7280'
    }
  }, "ROAS")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), [['Accounts', '12'], ['Campaigns', '38'], ['Rejected', '4/612']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#4B5563'
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: '#D1D5DB'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 16,
    color: "var(--roas-bad)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#4B5563'
    }
  }, "Critical"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--roas-bad)'
    }
  }, "1"))))), /*#__PURE__*/React.createElement(KpiStrip, {
    cells: [{
      label: 'Total Spend',
      value: '$56,310'
    }, {
      label: 'Total Revenue',
      value: '$192,017'
    }, {
      label: 'Portfolio ROAS',
      value: '3.41x',
      tone: 'good'
    }, {
      label: 'Active Accounts',
      value: '12'
    }, {
      label: 'Active Campaigns',
      value: '38'
    }, {
      label: 'Healthy',
      value: '31',
      tone: 'good'
    }, {
      label: 'At Risk',
      value: '7',
      tone: 'watch'
    }]
  }), /*#__PURE__*/React.createElement(Card, {
    variant: "app"
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Account"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Spend"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "ROAS"))), /*#__PURE__*/React.createElement("tbody", null, accounts.map(a => /*#__PURE__*/React.createElement(React.Fragment, {
    key: a.id
  }, /*#__PURE__*/React.createElement("tr", {
    onClick: () => a.campaigns.length && setOpen(open === a.id ? null : a.id),
    style: {
      borderBottom: '1px solid rgba(31,41,55,0.35)',
      cursor: a.campaigns.length ? 'pointer' : 'default',
      background: open === a.id ? 'rgba(255,255,255,0.015)' : undefined
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "#4B5563",
    style: {
      transform: open === a.id ? 'rotate(90deg)' : 'none',
      transition: 'transform .15s var(--ease)',
      opacity: a.campaigns.length ? 1 : 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: a.restricted ? '#EF4444' : '#10B981',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: '#E5E7EB'
    }
  }, a.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 11,
      color: '#4B5563',
      marginTop: 2
    }
  }, a.meta)))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      fontSize: 12,
      fontWeight: 500,
      color: a.restricted ? 'var(--roas-bad)' : 'rgba(52,211,153,0.8)'
    }
  }, a.restricted ? 'Restricted' : 'Active'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'right',
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, a.spend), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'right',
      fontSize: 13,
      fontWeight: 600,
      color: roasTone(a.roas),
      fontVariantNumeric: 'tabular-nums'
    }
  }, a.roas ? `${a.roas.toFixed(2)}x` : '--')), open === a.id && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 4,
    style: {
      padding: 16,
      background: 'var(--surface-0)',
      borderBottom: '1px solid rgba(31,41,55,0.35)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12
    }
  }, a.campaigns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      borderRadius: 'var(--app-r-lg)',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'var(--surface-2)',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 11.5,
      color: '#9CA3AF',
      flex: 1,
      lineHeight: '16px'
    }
  }, c.name), /*#__PURE__*/React.createElement(Toggle, {
    on: states[c.id],
    label: c.name,
    onToggle: v => setStates(s => ({
      ...s,
      [c.id]: v
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.spend), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: roasTone(c.roas),
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.roas.toFixed(2), "x"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Chip, {
    tone: states[c.id] ? 'ok' : 'neutral'
  }, states[c.id] ? 'ACTIVE' : 'PAUSED')))))))))))), resurrect && /*#__PURE__*/React.createElement(ResurrectModal, {
    onClose: () => setResurrect(false)
  }));
}

/* Resurrect — the rebuild nobody plans for. Pick the dead account, pick the
   live one, every winning campaign is rebuilt 1:1. */
function ResurrectModal({
  onClose
}) {
  const {
    Card,
    Button,
    Chip
  } = window.SpectraKit;
  const [step, setStep] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(8px)',
      zIndex: 60,
      display: 'grid',
      placeItems: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 560
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    topHighlight: true,
    style: {
      boxShadow: 'var(--shadow-pop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart-pulse",
    size: 18,
    color: "var(--primary)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600
    }
  }, "Resurrect account"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Chip, {
    tone: "accent"
  }, "1:1 REBUILD")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 20px',
      fontSize: 13,
      lineHeight: '20px',
      color: '#9CA3AF'
    }
  }, "Every winning campaign from the dead account is rebuilt into the live one \u2014 structure, budgets, creative and naming intact."), [['Dead account', 'Account 03 — Backup · restricted 2h ago'], ['Rebuild into', 'Account 02 — Scaling']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#6B7280',
      marginBottom: 6
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface-4)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 'var(--app-r)',
      padding: '10px 12px',
      fontSize: 13,
      color: '#D1D5DB'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, v), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 15,
    color: "#6B7280"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'grid',
      gap: 8
    }
  }, ['Pick the dead account', 'Pick the live one', 'Every winner rebuilt, 1:1'].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13,
      color: i <= step ? '#E5E7EB' : '#4B5563'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      display: 'grid',
      placeContent: 'center',
      fontSize: 10,
      background: i <= step ? 'var(--accent-dim)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${i <= step ? 'var(--accent-line)' : 'rgba(255,255,255,0.08)'}`,
      color: i <= step ? 'var(--primary)' : '#4B5563'
    }
  }, i + 1), s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 22,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "sm",
    onClick: () => setStep(s => Math.min(2, s + 1))
  }, step < 2 ? 'Continue' : 'Rebuild 6 campaigns'))))));
}
Object.assign(window, {
  CampaignOpsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spectra-app/CampaignOpsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spectra-app/CreativeAnalyticsScreen.jsx
try { (() => {
/* Creative Analytics — performance sliced by creative attribute rather than
   by campaign, plus the learning loop that credits a win back to the idea
   that caused it. Creative thumbnails are neutral placeholders: no tenant's
   brand may appear in a shared UI. */

function CreativeAnalyticsScreen() {
  const {
    Card,
    Chip,
    Badge,
    Button,
    EmptyState,
    StatCard
  } = window.SpectraKit;
  const [filter, setFilter] = React.useState('All');
  const [selected, setSelected] = React.useState(0);
  const creatives = [{
    id: 0,
    name: 'ugc_hookA_offerfirst_v3',
    hook: 'Offer-first',
    fmt: 'Video',
    roas: 4.82,
    spend: '$18,204',
    hold: '31%',
    tone: 220
  }, {
    id: 1,
    name: 'static_banner_offer_v7',
    hook: 'Offer-first',
    fmt: 'Image',
    roas: 3.64,
    spend: '$12,880',
    hold: '—',
    tone: 258
  }, {
    id: 2,
    name: 'ugc_founder_story_v2',
    hook: 'Founder story',
    fmt: 'Video',
    roas: 2.91,
    spend: '$9,412',
    hold: '24%',
    tone: 160
  }, {
    id: 3,
    name: 'carousel_compare_v1',
    hook: 'Comparison',
    fmt: 'Carousel',
    roas: 2.18,
    spend: '$6,770',
    hold: '—',
    tone: 34
  }, {
    id: 4,
    name: 'ugc_problem_solution',
    hook: 'Problem/solution',
    fmt: 'Video',
    roas: 3.12,
    spend: '$5,940',
    hold: '28%',
    tone: 288
  }, {
    id: 5,
    name: 'static_testimonial_v4',
    hook: 'Testimonial',
    fmt: 'Image',
    roas: 1.74,
    spend: '$4,102',
    hold: '—',
    tone: 8
  }];
  const shown = filter === 'All' ? creatives : creatives.filter(c => c.fmt === filter);
  const sel = creatives[selected];
  const roasTone = v => v >= 3 ? 'var(--roas-good)' : v >= 2.5 ? 'var(--roas-watch)' : 'var(--roas-bad)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      maxWidth: 1400,
      margin: '0 auto',
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, "Creative Analytics"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 13,
      color: 'rgba(255,255,255,0.45)'
    }
  }, "\u201CIt did 4.2x\u201D is not a learning. This is which part of the ad did the work.")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['All', 'Video', 'Image', 'Carousel'].map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFilter(f),
    style: {
      padding: '5px 14px',
      borderRadius: 'var(--app-r-sm)',
      border: `1px solid ${filter === f ? 'rgba(75,85,99,1)' : 'transparent'}`,
      background: filter === f ? 'var(--surface-4)' : 'transparent',
      color: filter === f ? '#fff' : '#6B7280',
      fontFamily: 'inherit',
      fontSize: 12,
      fontWeight: 500,
      cursor: 'pointer'
    }
  }, f)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    title: "Creatives classified",
    value: "3,444",
    subtitle: "of 4,769 with spend",
    trend: {
      value: '+218',
      isPositive: true
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    title: "Hook tactics tracked",
    value: "12",
    subtitle: "rolled up per creator",
    trend: {
      value: '+2',
      isPositive: true
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    title: "Briefs produced",
    value: "456",
    subtitle: "50 carry full ontology tags",
    trend: {
      value: '+31',
      isPositive: true
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    title: "Concepts processed",
    value: "912",
    subtitle: "from the Ad Factory",
    trend: {
      value: '+64',
      isPositive: true
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    hint: `${shown.length} shown`
  }, "Creative gallery"), shown.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "image-off",
      size: 18
    }),
    title: "No creatives in this format yet",
    hint: "Classification runs nightly on every ad that has spent \u2014 new formats appear here the morning after they launch."
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12,
      marginTop: 6
    }
  }, shown.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setSelected(c.id),
    style: {
      textAlign: 'left',
      padding: 0,
      border: `1px solid ${selected === c.id ? 'var(--primary)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 'var(--app-r-lg)',
      overflow: 'hidden',
      background: 'var(--surface-2)',
      cursor: 'pointer',
      boxShadow: selected === c.id ? '0 0 0 1px var(--primary), 0 0 20px rgba(99,102,241,0.06)' : 'none',
      transition: 'border-color .2s var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4/5',
      background: `linear-gradient(150deg, hsl(${c.tone} 34% 16%), hsl(${c.tone + 24} 28% 9%))`,
      display: 'grid',
      placeContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.fmt === 'Video' ? 'play' : c.fmt === 'Carousel' ? 'gallery-horizontal' : 'image',
    size: 22,
    color: "rgba(255,255,255,0.28)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 8,
      top: 8
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    tone: c.roas >= 3 ? 'ok' : c.roas >= 2.5 ? 'warn' : 'bad'
  }, c.roas.toFixed(2), "X"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 11,
      color: '#9CA3AF',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 6,
      fontSize: 11,
      color: '#4B5563'
    }
  }, /*#__PURE__*/React.createElement("span", null, c.hook), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontVariantNumeric: 'tabular-nums'
    }
  }, c.spend))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Breakdown"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 12,
      color: '#D1D5DB',
      marginTop: 4
    }
  }, sel.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 10,
      marginTop: 14
    }
  }, [['ROAS', `${sel.roas.toFixed(2)}x`, roasTone(sel.roas)], ['Spend', sel.spend, '#fff'], ['Hold rate', sel.hold, '#fff']].map(([l, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#6B7280'
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: c,
      marginTop: 3,
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#6B7280',
      marginBottom: 8
    }
  }, "Attributes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, [sel.hook, sel.fmt, 'Awareness: problem-aware', 'UGC'].map(t => /*#__PURE__*/React.createElement(Chip, {
    key: t
  }, t.toUpperCase())))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#6B7280',
      marginBottom: 8
    }
  }, "First 6 seconds"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 3,
      alignItems: 'flex-end',
      height: 44
    }
  }, [100, 96, 88, 71, 62, 58, 55, 53, 51, 50, 49, 48].map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: `${v}%`,
      borderRadius: 2,
      background: v > 70 ? 'var(--primary)' : 'rgba(99,102,241,0.30)'
    }
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 12,
      color: '#6B7280'
    }
  }, "Biggest drop at 00:02\u201300:03 \u2014 17% of viewers leave before the offer lands."))), /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    hint: "credited back to the brief"
  }, "Learning loop"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10,
      marginTop: 6
    }
  }, [['Offer-first banners', '6.38x', '223 ads', 'good'], ['Founder story opens', '2.94x', '86 ads', 'watch'], ['Comparison carousels', '2.11x', '41 ads', 'bad']].map(([p, r, n, t]) => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 'var(--app-r-lg)',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      color: '#E5E7EB'
    }
  }, p), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#4B5563'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      color: t === 'good' ? 'var(--roas-good)' : t === 'watch' ? 'var(--roas-watch)' : 'var(--roas-bad)'
    }
  }, r)))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      marginTop: 14,
      width: '100%',
      justifyContent: 'center'
    },
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "file-pen-line",
      size: 15
    })
  }, "Write the next brief from this")))));
}
Object.assign(window, {
  CreativeAnalyticsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spectra-app/CreativeAnalyticsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spectra-app/KratosScreen.jsx
try { (() => {
/* Kratos — the AI media buyer. Chat against one ad account, a thinking
   panel that shows the tools it called, an action queue, and the run history
   where every write is re-read from Meta afterwards. */

function KratosScreen() {
  const {
    Card,
    Chip,
    Button,
    VerifyBadge,
    TerminalLog,
    Badge
  } = window.SpectraKit;
  const [tab, setTab] = React.useState('Overview');
  const [msgs, setMsgs] = React.useState([{
    role: 'user',
    text: 'Which ad sets should I scale this week?'
  }, {
    role: 'agent',
    text: 'Three ad sets cleared 3.0x on 7-day spend over $2k. I can raise budgets 20% on all three — that adds roughly $1,940/day. Want me to queue it?'
  }]);
  const [draft, setDraft] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, {
      role: 'user',
      text: draft
    }]);
    setDraft('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsgs(m => [...m, {
        role: 'agent',
        text: 'Queued. I will re-read campaign state from Meta an hour after the write and grade the change at 24 hours.'
      }]);
    }, 1600);
  };
  const tabs = ['Overview', 'Queue', 'History', 'Memory'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      maxWidth: 1400,
      margin: '0 auto',
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    topHighlight: true,
    style: {
      padding: 24,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/kratos-avatar.jpeg",
    alt: "",
    style: {
      width: 56,
      height: 56,
      borderRadius: 'var(--app-r-xl)',
      objectFit: 'cover',
      border: '1px solid rgba(255,255,255,0.08)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, "Kratos"), /*#__PURE__*/React.createElement(Chip, {
    tone: "ok"
  }, "RUNNING"), /*#__PURE__*/React.createElement(Chip, {
    tone: "neutral"
  }, "EVERY 5 MIN")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 13,
      color: 'rgba(255,255,255,0.45)'
    }
  }, "Reads account state, proposes scaling decisions, fires them on approval \u2014 then re-reads Meta to confirm the change actually landed.")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "settings-2",
      size: 15
    })
  }, "Runbook"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 15
    })
  }, "Run now")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      marginTop: 20,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingTop: 14
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      padding: '6px 14px',
      borderRadius: 'var(--app-r-sm)',
      border: `1px solid ${tab === t ? 'rgba(75,85,99,1)' : 'transparent'}`,
      background: tab === t ? 'var(--surface-4)' : 'transparent',
      color: tab === t ? '#fff' : '#6B7280',
      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: tab === t ? 600 : 500,
      cursor: 'pointer',
      transition: 'all .15s var(--ease)'
    }
  }, t)))), tab === 'Overview' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square",
    size: 15,
    color: "#6B7280"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, "Account 02 \u2014 Scaling"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 11,
      color: '#4B5563'
    }
  }, "act_2048571936")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 20,
      display: 'grid',
      gap: 14,
      alignContent: 'start'
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
    }
  }, m.role === 'agent' && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      background: 'var(--accent-dim)',
      border: '1px solid var(--accent-line)',
      display: 'grid',
      placeContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bot",
    size: 14,
    color: "var(--primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '76%',
      borderRadius: 'var(--app-r-lg)',
      padding: '10px 14px',
      fontSize: 13,
      lineHeight: '20px',
      background: m.role === 'user' ? 'var(--surface-4)' : 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)',
      color: '#E5E7EB'
    }
  }, m.text))), thinking && /*#__PURE__*/React.createElement(ThinkingPanel, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === 'Enter' && send(),
    placeholder: "Ask about this account\u2026",
    style: {
      flex: 1,
      background: 'var(--surface-4)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 'var(--app-r)',
      padding: '10px 14px',
      color: '#E5E7EB',
      fontFamily: 'inherit',
      fontSize: 13,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "md",
    onClick: send,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up",
      size: 15
    })
  }, "Send"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    hint: "awaiting approval"
  }, "Action queue"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10,
      marginTop: 6
    }
  }, [['Raise budget +20%', 'CBO_Winners_Scale_v9', '$820 → $984/day'], ['Raise budget +20%', 'ABO_Hook_Test_Aug', '$540 → $648/day'], ['Lower budget -15%', 'ADV+_Cold_Broad', '$400 → $340/day']].map(([a, c, d]) => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 'var(--app-r-lg)',
      padding: 12,
      background: 'rgba(255,255,255,0.015)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: '#E5E7EB'
    }
  }, a), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 11,
      color: '#6B7280',
      marginTop: 3
    }
  }, c), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#9CA3AF',
      fontVariantNumeric: 'tabular-nums'
    }
  }, d), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Skip"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "sm"
  }, "Approve")))))), /*#__PURE__*/React.createElement(Card, {
    variant: "app",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    hint: "write access is deliberately narrow"
  }, "Capabilities"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginTop: 6
    }
  }, [['Read account health', true], ['Read creative detail + rejections', true], ['Increase / decrease budget by %', true], ['Create campaigns', false], ['Rewrite targeting', false]].map(([c, on]) => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      color: on ? '#D1D5DB' : '#4B5563'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: on ? 'check' : 'minus',
    size: 14,
    color: on ? 'var(--roas-good)' : '#4B5563'
  }), c)))))), tab !== 'Overview' && /*#__PURE__*/React.createElement(Card, {
    variant: "app"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, tab === 'Queue' ? 'Run queue' : tab === 'History' ? 'Run history' : 'Persistent memory'), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, "194 changes logged")), /*#__PURE__*/React.createElement(TerminalLog, {
    lines: [{
      time: '02:14',
      who: 'KRATOS',
      message: 'Raised budget +20% on 3 ad sets — 7d ROAS 3.4x over $2k spend'
    }, {
      time: '02:14',
      who: 'META',
      message: '200 OK · campaign 23851029384756',
      dim: true
    }, {
      time: '03:14',
      who: 'GROUND TRUTH',
      message: 'Re-read campaign + ad set state from Meta',
      badge: 'verified'
    }, {
      time: '09:02',
      who: 'KRATOS',
      message: 'Lowered budget -15% on ADV+_Cold_Broad'
    }, {
      time: '09:02',
      who: 'META',
      message: '200 OK',
      dim: true
    }, {
      time: '10:02',
      who: 'GROUND TRUTH',
      message: 'Budget reverted by campaign-level optimisation',
      badge: 'reverted'
    }, {
      time: '10:03',
      who: 'KRATOS',
      message: 'Re-queued as an ad-set-level pause instead',
      badge: 'pending'
    }]
  })));
}
function ThinkingPanel() {
  const steps = ['Reading account health (4 periods + 14d trend)', 'Pulling pre-classified candidate buckets', 'Checking change log for recent writes'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--accent-line)',
      background: 'var(--accent-dim)',
      borderRadius: 'var(--app-r-lg)',
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      border: '2px solid var(--primary)',
      borderTopColor: 'transparent',
      animation: 'spin .6s linear infinite',
      display: 'inline-block'
    }
  }), "Thinking"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 5,
      marginTop: 8
    }
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      fontFamily: 'var(--font-mono-app)',
      fontSize: 11,
      color: '#9CA3AF'
    }
  }, "\u2192 ", s))));
}
Object.assign(window, {
  KratosScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spectra-app/KratosScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spectra-site/SiteChapters.jsx
try { (() => {
/* Spectra marketing site — the product chapters, the paper chapter, the
   comparison table, pricing and the closing bookend. */

function LearningLoop() {
  const {
    SectionHeader,
    Card,
    TerminalLog,
    Chip
  } = window.SpectraKit;
  return /*#__PURE__*/React.createElement("section", {
    className: "section band band-1 glow-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: "glow glow-a",
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("i", {
    className: "glow glow-b",
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    split: true,
    label: "KRATOS",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "It acts. ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "Then it checks its own work.")),
    lede: "Meta returning 200 OK is not authoritative: budgets silently revert and status toggles fail inside budget-optimised campaigns. Every write is re-read from Meta afterwards, and the result goes on the record either way."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 16,
      marginTop: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "site",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono t-micro"
  }, "RUN 4,182 \xB7 ACCOUNT 02"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Chip, {
    tone: "ok"
  }, "LIVE")), /*#__PURE__*/React.createElement(TerminalLog, {
    lines: [{
      time: '02:14',
      who: 'KRATOS',
      message: 'Raised budget +20% on 3 ad sets'
    }, {
      time: '02:14',
      who: 'META',
      message: '200 OK',
      dim: true
    }, {
      time: '03:14',
      who: 'GROUND TRUTH',
      message: 'Re-read campaign + ad set state',
      badge: 'verified'
    }, {
      time: '09:02',
      who: 'KRATOS',
      message: 'Lowered budget -15% on one ad set'
    }, {
      time: '10:02',
      who: 'GROUND TRUTH',
      message: 'Reverted by campaign-level optimisation',
      badge: 'reverted'
    }, {
      time: '10:03',
      who: 'KRATOS',
      message: 'Re-queued as an ad-set pause instead',
      badge: 'pending'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, [['Write access is narrow on purpose', 'Increase or decrease budget by a percentage. It expands as it earns it.'], ['Every action is on the record', 'The Decision Log answers who changed what, when, and why — and what happened next.'], ['Reversible', 'Nothing the agent does is a one-way door.']].map(([h, p]) => /*#__PURE__*/React.createElement(Card, {
    key: h,
    variant: "site",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "t-h3",
    style: {
      fontSize: 16
    }
  }, h), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      margin: '6px 0 0',
      lineHeight: '21px'
    }
  }, p)))))));
}

/* The one paper chapter. Colour is spent once per page. */
function GroundTruth() {
  const {
    SectionHeader,
    MetricTile
  } = window.SpectraKit;
  return /*#__PURE__*/React.createElement("section", {
    className: "section-d band band-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    split: true,
    label: "GROUND TRUTH",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Every change gets graded ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "24 hours later.")),
    lede: "What changed, who changed it, why \u2014 then spend and ROAS before versus after. The decisions that worked are on the record. So are the ones that didn't."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12,
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(MetricTile, {
    label: "ACCOUNT CHANGES LOGGED",
    value: "194"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "AD ACCOUNTS CONNECTED",
    value: "130"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "CAMPAIGNS MANAGED",
    value: "305"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "COMPETITOR ADS CAPTURED",
    value: "3,099"
  })), /*#__PURE__*/React.createElement("p", {
    className: "mono t-micro",
    style: {
      marginTop: 18
    }
  }, "QUERIED AGAINST PRODUCTION 2026-07-28")));
}
function CampaignOps() {
  const {
    SectionHeader,
    Card,
    Chip,
    BrowserFrame
  } = window.SpectraKit;
  return /*#__PURE__*/React.createElement("section", {
    className: "section band band-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    split: true,
    label: "CAMPAIGN OPS \xB7 RESURRECT",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Your account went down at 2am. ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "Your campaigns were live again before you woke up.")),
    lede: "A restriction used to cost you the campaigns, the learnings, and three days of somebody rebuilding by hand. Now it costs you a click."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16,
      marginTop: 48
    }
  }, [['Pick the dead account', '01'], ['Pick the live one', '02'], ['Every winner rebuilt, 1:1', '03']].map(([s, n]) => /*#__PURE__*/React.createElement(Card, {
    key: n,
    variant: "site",
    style: {
      padding: 22,
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono t-micro",
    style: {
      color: 'var(--accent)'
    }
  }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t-h3",
    style: {
      fontSize: 17
    }
  }, s), n === '03' && /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      margin: '6px 0 0'
    }
  }, "Structure, budgets, creative and naming intact.")))))));
}
function Compare() {
  const {
    SectionHeader
  } = window.SpectraKit;
  const rows = [['Reads every ad across every account', true, true], ['Tells you which part of the creative worked', false, true], ['Generates the replacement creative', false, true], ['Launches into every account at once', false, true], ['Moves budget on its own', false, true], ['Re-reads the platform to confirm the change landed', false, true], ['Rebuilds a restricted account 1:1', false, true]];
  return /*#__PURE__*/React.createElement("section", {
    className: "section-d band band-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    split: true,
    label: "COMPARISON",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Reporting tools watch. ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "Spectra does the work.")),
    lede: "Everything in this category reports and leaves. The spreadsheet between the tools is the part you are actually paying a person to run."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      border: '1px solid var(--line-2)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: '14px 20px',
      borderBottom: '1px solid var(--line-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono t-micro"
  }, "CAPABILITY")), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 180,
      padding: '14px 20px',
      borderBottom: '1px solid var(--line-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono t-micro"
  }, "REPORTING TOOLS")), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 180,
      padding: '14px 20px',
      borderBottom: '1px solid var(--line-2)',
      background: 'rgba(110,86,248,.06)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono t-micro",
    style: {
      color: 'var(--accent)'
    }
  }, "SPECTRA")))), /*#__PURE__*/React.createElement("tbody", null, rows.map(([label, a, b], i) => /*#__PURE__*/React.createElement("tr", {
    key: label
  }, /*#__PURE__*/React.createElement("td", {
    className: "t-body",
    style: {
      padding: '13px 20px',
      borderTop: i ? '1px solid var(--line)' : 'none'
    }
  }, label), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'center',
      padding: '13px 20px',
      borderTop: i ? '1px solid var(--line)' : 'none',
      color: a ? 'var(--text-2)' : 'var(--text-4)'
    }
  }, a ? '✓' : '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'center',
      padding: '13px 20px',
      borderTop: i ? '1px solid var(--line)' : 'none',
      background: 'rgba(110,86,248,.06)',
      color: 'var(--accent)'
    }
  }, b ? '✓' : '—'))))))));
}
function Integrations() {
  const {
    SectionHeader,
    IntegrationChip
  } = window.SpectraKit;
  const list = [['Meta Ads', 'M', 'live'], ['Google Gemini', 'G', 'live'], ['TripleWhale', 'TW', 'live'], ['Whop billing', 'W', 'live'], ['TikTok content', 'TT', 'beta'], ['TikTok Marketing API', 'TT', 'soon'], ['Shopify', 'S', 'soon'], ['Spectra MCP', 'MCP', 'live']];
  return /*#__PURE__*/React.createElement("section", {
    className: "section-d band band-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    split: true,
    label: "INTEGRATIONS",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Connect Meta. ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "The rest fills itself in.")),
    lede: "OAuth, then a sync pulls history and the dashboards populate. No implementation project."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      marginTop: 40
    }
  }, list.map(([n, m, s]) => /*#__PURE__*/React.createElement(IntegrationChip, {
    key: n + s,
    name: n,
    mark: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontFamily: 'var(--font-mono)'
      }
    }, m),
    status: s
  })))));
}
function Pricing() {
  const {
    SectionHeader,
    PlanCard
  } = window.SpectraKit;
  const included = ['Ad Performance + Creative Analytics', 'Ad Factory renders, four aspect ratios', 'Growth Guide briefs', 'Ad Launcher, multi-account', 'Campaign Ops + Resurrect', 'Decision Log + shareable reports', 'Competitor intelligence', 'Seven role-scoped workspaces'];
  return /*#__PURE__*/React.createElement("section", {
    className: "section band band-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    center: true,
    label: "PRICING",
    title: "Every plan is the whole product.",
    lede: "What changes is how many accounts it runs and how much compute it gets."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 14,
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(PlanCard, {
    name: "OPERATOR",
    price: "$490",
    blurb: "One brand, up to five ad accounts.",
    points: ['5 ad accounts', '2 seats', 'Kratos read-only'],
    cta: "Start"
  }), /*#__PURE__*/React.createElement(PlanCard, {
    featured: true,
    name: "SCALE",
    price: "$1,490",
    blurb: "For operators running 5\u201320 ad accounts.",
    points: ['Unlimited ad accounts', '10 seats', 'Kratos writes on 3 accounts', 'Resurrect'],
    cta: "Start"
  }), /*#__PURE__*/React.createElement(PlanCard, {
    name: "AGENCY",
    price: "Talk to us",
    cadence: "",
    blurb: "Client logins, creator links, your own org tree.",
    points: ['Unlimited orgs', 'Client + creator portals', 'Priority sync windows'],
    cta: "Book a walkthrough"
  })), /*#__PURE__*/React.createElement("div", {
    className: "plan-includes",
    style: {
      marginTop: 16,
      display: 'grid',
      gridTemplateColumns: 'minmax(0,.9fr) minmax(0,1.6fr)',
      gap: 32,
      padding: '26px 24px',
      borderRadius: 12,
      border: '1px solid var(--line-2)',
      background: 'linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.008))'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono t-micro"
  }, "EVERY PLAN INCLUDES"), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      marginTop: 10
    }
  }, "The whole system, on every tier. Nothing here is an upsell.")), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
      gap: '11px 26px',
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, included.map(i => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 16,
      height: 16,
      marginTop: 2,
      borderRadius: 5,
      display: 'grid',
      placeContent: 'center',
      color: 'var(--accent)',
      background: 'var(--accent-dim)',
      border: '1px solid var(--accent-line)',
      fontSize: 10
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    className: "t-sm",
    style: {
      color: 'var(--text-2)'
    }
  }, i)))))));
}
function CTA() {
  const {
    Button
  } = window.SpectraKit;
  return /*#__PURE__*/React.createElement("section", {
    className: "edge-band edge-rule cta-band section-d",
    style: {
      borderTop: '1px solid var(--accent-line)',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "t-h2",
    style: {
      margin: '0 auto',
      maxWidth: '20ch'
    }
  }, "Connect one account.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, "See which creatives actually made you money.")), /*#__PURE__*/React.createElement("p", {
    className: "t-lede",
    style: {
      margin: '20px auto 0',
      maxWidth: '58ch'
    }
  }, "Read-only to start. Spectra reads the account, classifies every creative that has spent, and shows you the breakdown before it is allowed to change anything."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'center',
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "lg"
  }, "Connect one account"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg"
  }, "Book a walkthrough"))));
}
function Footer() {
  const cols = [['PRODUCT', ['Ad Performance', 'Creative Analytics', 'Kratos', 'Ad Factory', 'Ad Launcher', 'Campaign Ops']], ['COMPANY', ['About', 'Careers', 'Contact']], ['LEGAL', ['Privacy policy', 'Terms of service', 'Data deletion']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      paddingBlock: 56,
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(3,1fr)',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/spectra-wordmark-white.png",
    alt: "Spectra",
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      marginTop: 14,
      maxWidth: '34ch'
    }
  }, "Creative intelligence for operators running more than one ad account.")), cols.map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono t-micro"
  }, h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 9,
      marginTop: 14
    }
  }, items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    className: "t-sm",
    href: "#",
    style: {
      display: 'block'
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      marginTop: 40,
      paddingTop: 20,
      borderTop: '1px solid var(--line)',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono t-micro"
  }, "\xA9 2026 SPECTRA MARKETING"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono t-micro"
  }, "MULTI-TENANT \xB7 ISOLATION ENFORCED IN POSTGRES")));
}
Object.assign(window, {
  LearningLoop,
  GroundTruth,
  CampaignOps,
  Compare,
  Integrations,
  Pricing,
  CTA,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spectra-site/SiteChapters.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spectra-site/SiteTop.jsx
try { (() => {
/* Spectra marketing site — the top of the page: floating nav, the hero
   bookend, the problem section, and the loop the whole product is named for.
   Copy is the current direction from the site's copy audit: name the fear,
   then the mechanism. */

function SiteNav() {
  const {
    NavPill,
    Button
  } = window.SpectraKit;
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById('site-scroll');
    if (!el) return;
    const on = () => setScrolled(el.scrollTop > 12);
    el.addEventListener('scroll', on);
    return () => el.removeEventListener('scroll', on);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(NavPill, {
    scrolled: scrolled,
    logo: /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logos/spectra-wordmark-white.png",
      alt: "Spectra",
      style: {
        height: 18
      }
    }),
    links: [{
      label: 'Product'
    }, {
      label: 'Kratos'
    }, {
      label: 'Pricing'
    }, {
      label: 'Docs'
    }],
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "quiet",
      size: "sm"
    }, "Log in"), /*#__PURE__*/React.createElement(Button, {
      variant: "solid",
      size: "sm"
    }, "Get started"))
  }));
}

/* The typed loop line. Types a phrase, holds, deletes, moves on — reduced
   motion shows the first phrase, still. */
function TypeCycle({
  phrases
}) {
  const [text, setText] = React.useState(phrases[0]);
  const [rest, setRest] = React.useState(true);
  React.useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let alive = true,
      t;
    const wait = ms => new Promise(r => {
      t = setTimeout(r, ms);
    });
    (async () => {
      let i = 0;
      while (alive) {
        const p = phrases[i % phrases.length];
        setRest(false);
        for (let c = 1; c <= p.length && alive; c++) {
          setText(p.slice(0, c));
          await wait(46 + Math.random() * 34);
        }
        setRest(true);
        await wait(1900);
        setRest(false);
        for (let c = p.length - 1; c >= 0 && alive; c--) {
          setText(p.slice(0, c));
          await wait(24);
        }
        await wait(260);
        i++;
      }
    })();
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);
  return /*#__PURE__*/React.createElement("span", null, text, /*#__PURE__*/React.createElement("i", {
    className: `tc-caret${rest ? ' tc-rest' : ''}`,
    "aria-hidden": true
  }));
}
function Hero() {
  const {
    Button,
    BrowserFrame,
    MetricTile,
    Chip
  } = window.SpectraKit;
  return /*#__PURE__*/React.createElement("section", {
    className: "edge-band edge-rule hero-band",
    style: {
      paddingTop: 96,
      paddingBottom: 88
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "linegrid",
    style: {
      position: 'absolute',
      inset: 0,
      WebkitMaskImage: 'radial-gradient(900px 560px at 50% 64px,#000,transparent 78%)',
      maskImage: 'radial-gradient(900px 560px at 50% 64px,#000,transparent 78%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 880
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow-chip",
    style: {
      marginBottom: 26,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono t-label",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--accent)'
    }
  }), "BUILT FOR OPERATORS RUNNING 5\u201320 AD ACCOUNTS")), /*#__PURE__*/React.createElement("h1", {
    className: "t-display grad-display",
    style: {
      margin: 0,
      fontSize: 72,
      letterSpacing: '-2.6px'
    }
  }, "Know why your ads win."), /*#__PURE__*/React.createElement("h1", {
    className: "t-display",
    style: {
      margin: 0,
      fontSize: 72,
      letterSpacing: '-2.6px',
      color: 'var(--text-3)'
    }
  }, /*#__PURE__*/React.createElement(TypeCycle, {
    phrases: ['Rebuild when your accounts don\u2019t.', 'Brief from evidence, not a hunch.', 'Launch once, land in all twelve.']
  })), /*#__PURE__*/React.createElement("p", {
    className: "t-lede",
    style: {
      marginTop: 26,
      maxWidth: '58ch'
    }
  }, "Spectra reads every ad in every account you run, tells you which part of the creative made the money, and writes the next brief from it. When an account gets restricted, your campaigns are live again somewhere else in minutes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "lg"
  }, "Connect one account"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg"
  }, "See the loop"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12,
      marginTop: 64
    }
  }, /*#__PURE__*/React.createElement(MetricTile, {
    label: "AD SPEND ANALYSED",
    prefix: "$",
    value: "568,296",
    caption: "META, TRACKED"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "IMPRESSIONS",
    value: "14,339,457",
    caption: "OF PERFORMANCE DATA"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "ADS ANALYSED",
    value: "4,769",
    caption: "3,444 AI-CATEGORISED"
  }), /*#__PURE__*/React.createElement(MetricTile, {
    label: "AUTOMATIONS",
    value: "23",
    caption: "RUNNING AROUND THE CLOCK"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, /*#__PURE__*/React.createElement(BrowserFrame, {
    url: "app.spectra.marketing/ad-performance",
    glow: true
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/spectra-dashboard.png",
    alt: "Spectra dashboard",
    style: {
      display: 'block',
      width: '100%'
    }
  })))));
}

/* The problem section — the page's job before it explains a mechanism. */
function Pain() {
  const {
    SectionHeader,
    Card
  } = window.SpectraKit;
  const wounds = [{
    k: 'FRAGILITY',
    h: 'An account dies without warning.',
    p: 'You lose the campaigns, the learning phase, the social proof baked into the ad objects — and two to five days of revenue while somebody rebuilds it by hand in Ads Manager.'
  }, {
    k: 'BLINDNESS',
    h: '“It did 4.2x” is not a learning.',
    p: 'Reporting tells you an ad set spent $126k. It does not tell you whether the hook, the offer, the creator or the first three seconds did the work.'
  }, {
    k: 'THE TREADMILL',
    h: 'Month 13 guesses like month 1.',
    p: 'Eighty creatives last quarter, and the next brief still starts from a hunch — because nothing credits a win back to the idea that caused it.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "section band band-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    split: true,
    label: "THE STATUS QUO",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Ads Manager in one tab. ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "A spreadsheet in the other.")),
    lede: "The villain is not a competitor. It is the spreadsheet between the tools \u2014 and the fact that every tool in the stack reports and leaves."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16,
      marginTop: 56
    }
  }, wounds.map(w => /*#__PURE__*/React.createElement(Card, {
    key: w.k,
    variant: "site",
    interactive: true,
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono t-micro"
  }, w.k), /*#__PURE__*/React.createElement("h3", {
    className: "t-h3",
    style: {
      marginTop: 14,
      marginBottom: 10
    }
  }, w.h), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      margin: 0,
      lineHeight: '22px'
    }
  }, w.p))))));
}

/* The loop, as a diagram. Every stage writes to the next — competing
   products make you the integration layer. */
function Flywheel() {
  const {
    SectionHeader
  } = window.SpectraKit;
  const stages = [['BRIEF', 'Hypothesis, awareness level, mechanism'], ['CREATE', 'Brand kit in, rendered ads out, four ratios'], ['LAUNCH', 'One build, every account, tagged at birth'], ['MEASURE', 'Spend, ROAS, hook rate, hold rate'], ['ACT', 'Budgets move on evidence, not on a feeling'], ['VERIFY', 'Meta is re-read — 200 OK is not proof']];
  return /*#__PURE__*/React.createElement("section", {
    className: "section-d band band-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    split: true,
    label: "THE LOOP",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Six stages. ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "Each one writes to the next.")),
    lede: "Most tools do one stage and hand you a CSV. Spectra runs brief \u2192 create \u2192 launch \u2192 measure \u2192 act \u2192 verify, and the output of each stage is the input of the one after it."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6,1fr)',
      gap: 0,
      marginTop: 56,
      border: '1px solid var(--line-2)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden'
    }
  }, stages.map(([k, d], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: '22px 18px',
      borderLeft: i ? '1px solid var(--line)' : 'none',
      background: i === 5 ? 'rgba(52,211,153,.04)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono t-micro",
    style: {
      color: i === 5 ? 'var(--ok)' : 'var(--text-4)'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 12,
      letterSpacing: '1.4px',
      marginTop: 10,
      color: i === 5 ? 'var(--ok)' : 'var(--text)'
    }
  }, k), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      marginTop: 10,
      marginBottom: 0,
      fontSize: 12.5,
      lineHeight: '19px'
    }
  }, d)))), /*#__PURE__*/React.createElement("p", {
    className: "mono t-micro",
    style: {
      marginTop: 16
    }
  }, "FIG 0.1 \u2014 THE ONLY STAGE NOBODY ELSE RUNS IS THE LAST ONE")));
}
Object.assign(window, {
  SiteNav,
  Hero,
  Pain,
  Flywheel,
  TypeCycle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spectra-site/SiteTop.jsx", error: String((e && e.message) || e) }); }

__ds_ns.KpiCard = __ds_scope.KpiCard;

__ds_ns.ChangeTag = __ds_scope.ChangeTag;

__ds_ns.KpiStrip = __ds_scope.KpiStrip;

__ds_ns.MetricTile = __ds_scope.MetricTile;

__ds_ns.Sparkline = __ds_scope.Sparkline;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.VerifyBadge = __ds_scope.VerifyBadge;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.TerminalLog = __ds_scope.TerminalLog;

__ds_ns.NavPill = __ds_scope.NavPill;

__ds_ns.SidebarNavItem = __ds_scope.SidebarNavItem;

__ds_ns.UserProfileCard = __ds_scope.UserProfileCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.BrowserFrame = __ds_scope.BrowserFrame;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.IntegrationChip = __ds_scope.IntegrationChip;

__ds_ns.PlanCard = __ds_scope.PlanCard;

})();
