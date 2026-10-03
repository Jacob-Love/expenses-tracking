# Spectra Design System

Spectra is creative intelligence for people who run more than one ad account.
It reads every ad in every connected account, tells you which part of each
creative did the work, writes the next brief from what it learned, launches it
across every account at once — and, when an account gets restricted, rebuilds
the campaigns somewhere else.

This design system is assembled from Spectra's own production code, not from a
style guide. Every colour, size, radius and shadow below was lifted from a file
in one of the two repositories named under **Sources**.

---

## The products

| Surface | What it is | Where it lives here |
|---|---|---|
| **Spectra app** (agency dashboard) | The product itself: 30 application screens, 7 role-scoped workspaces, 23 scheduled automations. Dark, dense, metric-first. | `ui_kits/spectra-app/` |
| **Spectra Marketing site** | The SaaS lander. Big editorial type, one idea per viewport, one product visual per chapter. | `ui_kits/spectra-site/` |

The two surfaces share a palette, a mono voice and a discipline about colour,
but they are deliberately tuned differently: the site sits a hair bluer and
carries a violet ambient wash; the app is deliberately colourless so that any
colour on screen means something about the data.

### What the app actually does

- **Ad Performance** — spend, revenue, ROAS, CTR, CPM, CPC, hook rate, hold rate across every connected Meta account, with a TripleWhale-sourced channel split.
- **Kratos** — an AI media buyer that reads a live account, proposes changes, executes them, and then **re-reads Meta to confirm the change actually landed**. Write access is deliberately narrow: budget percentage moves only.
- **Ad Factory** — brand kit in, rendered ads out, four aspect ratios, three resolutions, references scoped per batch.
- **Growth Guide** — brand contexts, avatars, angle cards, structured briefs that flow into the launcher.
- **Ad Launcher** — build the launch once, fire it into every account, with duplicate detection before it spends money.
- **Campaign Ops + Resurrect** — live campaign state with a switch on every campaign, cross-account replication, and a 1:1 rebuild of a restricted account.
- **Creative Analytics + Learning Loop** — performance sliced by creative attribute, so a win gets credited back to the idea that caused it.
- **Competitor intelligence, TikTok research, Creator management, Decision Log, Billing, Admin.**

---

## Sources

Everything here was read from these repositories. If you have access, read them
before extending this system — they carry far more product detail than a design
system can:

- **https://github.com/Jacob-Love/spectra-agency-dashboard** — the application.
  Key files: `tailwind.config.js` (the token audit — surfaces, type scale, radii,
  borders, shadows), `src/index.css`, `src/layouts/MainLayout.tsx`,
  `src/components/sidebar/*`, `src/components/ui/*`,
  `src/components/ad-performance/*`, `src/components/campaign-ops/*`,
  `src/components/kratos/*`, `docs/PRODUCT-AND-POSITIONING.md`, `CLAUDE.md`.
- **https://github.com/Jacob-Love/spectra-flywheel-boost-b35ca477** — the
  marketing site. Key files: `src/index.css` (the whole visual language),
  `src/ui.tsx` (the site's primitives), `DESIGN-STANDARD.md`,
  `DESIGN-RESEARCH.md`, `COPY-AUDIT.md`, `src/sections.tsx`.

Two more Spectra repos exist and were **not** read (`spectra-site`,
`spectra-site1`, `spectra-crm`, `spectra-crm2`). If any of them is the current
marketing or CRM surface, say so and it can be folded in.

A verbatim copy of the marketing stylesheet and primitives is kept in
`reference/` (as `.txt`, so the compiler ignores them) for exact look-ups.

---

## CONTENT FUNDAMENTALS

Spectra's copy has a very particular voice, and it is the most copyable thing
about the brand. It comes from a written copy audit whose thesis is:
**the page sells the machine; the buyer is shopping for relief.**

**Say the sentence the buyer is already thinking.** The strongest lines in the
product are the buyer's own thoughts said out loud, not feature descriptions:

> "You can't repeat a winner you can't explain."
> "It did 4.2x" is not a learning.
> "You don't run twelve ad accounts because you want to."
> "Your account went down at 2am. Your campaigns were live again before you woke up."

**Name the mechanism second, never first.** Every headline earns the right to a
mechanism sentence underneath it. `A marketing brain that reads your ads /
writes briefs / launches them` was rejected as "four mechanisms, zero stakes".

**Second person, present tense, active voice.** "You" is the reader; "we" barely
appears; the product is "Spectra" or "it", and it *does* things — reads, tags,
launches, rebuilds, verifies. Never "users", never "customers can".

**Concrete numbers, never adjectives.** `offer-first banners returned 6.38×
across 223 ads`, `3 days — average hand-rebuild of a restricted account`,
`0 — winners you can reproduce on purpose`. Nothing is "powerful", "seamless",
"cutting-edge", "revolutionary", or "AI-powered".

**Publish the misses.** "The decisions that worked are on the record. So are the
ones that didn't." Confidence in this brand is shown by admitting limits, not by
hiding them.

**Casing.** Sentence case for headlines and buttons ("Connect one account",
"Book a walkthrough"). UPPERCASE + letterspacing only for mono micro-labels
(`GROUND TRUTH`, `FIG 0.1`, `BUILT FOR OPERATORS RUNNING 5–20 AD ACCOUNTS`).
Product names are capitalised: Kratos, Ad Factory, Growth Guide, Ad Launcher,
Campaign Ops, Resurrect, Decision Log, Winner Scaler.

**Punctuation.** Em-dashes and colons do the heavy lifting; sentences are short
and often fragments. British-ish spelling appears in engineering prose
("categorised", "optimised") and American spelling in product copy — either is
acceptable, but be consistent within one artifact.

**Emoji: never.** Not in the app, not on the site, not in the docs. The only
non-alphanumeric glyphs in the UI are `⌘`, `↑`, `↓`, `✓`, `—` and `·`.

**Empty states are onboarding.** Title says what *would* be here ("No winners
yet"), the hint says how it gets filled. Never "No data found."

**Numbers you may publish** (verified against production 2026-07-28):
$568,296 ad spend analysed · 14,339,457 impressions · 4,769 ads analysed ·
3,444 AI-categorised · 130 ad accounts · 305 campaigns · 932 ads generated ·
456 briefs · 3,099 competitor ads · 3,307 TikTok posts · 23 automations ·
194 account changes logged.

**Do not claim** (from the positioning doc): case studies, testimonials, partner
badges, statistical significance / p-values, an ontology, customer counts, or
that Kratos does anything beyond percentage budget moves. Shopify and the TikTok
Marketing API are built but not approved — "coming soon" is fine, a live logo
row is not.

**Multi-tenancy rule (hard).** No real client, brand or domain name may appear
in any UI string, placeholder, example or default. Use neutral examples —
"Account 02 — Scaling", `act_2048571936`, "All Brands". This is why the creative
thumbnails in the UI kit are abstract tiles rather than real ads.

---

## VISUAL FOUNDATIONS

### Colour

Near-black everywhere, one violet, three semantic colours, nothing else.

- **Site ground** `--bg #0B0C0E`, raised `#121316`, hover `#17181C`, inset `#08090A`.
- **App ground** a five-step neutral ramp, all R=G=B: `#0A0A0A` → `#121212` → `#171717` → `#1F1F1F` → `#272727`. Higher number = closer to the viewer. This replaced twelve ad-hoc greys.
- **Accent** violet `#6E56F8` on the site, indigo `#6366F1` in the app. Interaction only — buttons, focus, active nav, the eyebrow dot. Never a decorative fill.
- **Semantic** emerald `#34D399`, amber `#F5B544`/`#F59E0B`, red `#F35B5B`/`#F87171`, each with a 10%-alpha companion for chip backgrounds. These carry *data meaning*, never decoration.
- **ROAS colouring is a rule, not a choice**: ≥3.0x emerald, 2.5–3.0x amber, <2.5x red, 0 grey with `--`.
- **Colour is spent once per page.** Sections separate with space and a 1px hairline, never with a per-section tint. The marketing page has exactly one inverted chapter — Ground Truth, rendered on paper `#F4F3F0` with its own locally re-declared token set.

The app background is *deliberately colourless*. A previous version layered
violet/teal radials across the page; because ~68 components use translucent card
surfaces, that colour bled through every card and read as a purple UI. Depth now
comes from a white top-lift at 3.5% and a bottom vignette.

### Type

- **Inter** (variable) on the marketing site; **Inter Tight** in the app — tighter widths make large metrics read confident rather than wide. Weight **500** carries every headline; 700 is reserved for app metric values.
- **Geist Mono** (site) and **JetBrains Mono** (app) for micro-labels, ad names, account IDs, timestamps, and anything the eye scans character by character.
- Site scale: display 88/-3.2px → H2 56/-1.9 → H3 22/-0.46 → lede 18/28 → body 15.5/24 → small 14/21 → label 11/1.6px tracked → micro 10/1.4px tracked. Tablet and mobile steps are defined; nothing is fluid-clamped.
- App scale: seven steps, 11 → 36px, line-heights baked in. The audit that produced it found 22 sizes in use, 19 of them arbitrary.
- **Tabular figures everywhere a number appears.** Proportional digits make a live metric column wobble on every refresh.
- **Two-tone headlines** are the house device: white lead phrase, `--text-3` grey continuation, same size and weight.
- Section headers are **split** — H2 left across 6 columns, lede right in columns 8–12. Centring is reserved for the hero and the closing CTA.

### Space and layout

- One idea per viewport. Chapters are `--section-y` 160px (96px mobile); dense chapters 104px.
- Containers 1280px / 1440px wide with a 24px gutter; the app maxes out at 1400px with 24px page padding.
- The app sidebar is 375px at ≥1280px, 280px at md, and 68px collapsed (persisted in localStorage).
- Below 900px product frames go full-bleed: they break the gutter, drop their side borders and square their corners, becoming a band of product edge to edge.

### Surfaces, borders, radii

- Radii are small: 2 / 4 / 6 / 8 on the site (12 for plan cards, 18 for the floating nav pill); the app uses 6 / 8 / 10 and collapses everything above onto 14 so cards cannot drift apart.
- Two border weights only: `rgba(255,255,255,.07)` for default separation and `.14` for emphasis. Cards use `--line-2` at `.10`.
- **Cards get depth from light, never from a colour wash**: a 1px hairline, a soft top-down gradient (`rgba(255,255,255,.045)` → `.012`), one inset highlight along the top edge, and — on figure cards only — a faint violet radial cap from the top.
- The heavy recipe (backdrop-blur 22px, bright gradient ring, 32px drop shadow) belongs to the **floating nav pill only**. Used on an in-page card it reads as an overlay pasted on top.
- Shadows: `card` (1px hairline shadow), `raised` (16px), `pop` (40px, popovers/modals), `frame` (80px under a product screenshot).

### Background and texture

- Static, always. Backgrounds do not animate; the motion budget goes to the product art.
- Ambient violet blooms (`--glow-violet`, 90px blur, a 14s breathe) sit behind every second chapter so the page keeps a pulse below the fold.
- The hero and the closing CTA are the same "room": a lifted base, a violet wash off the top edge, and a 64px line grid masked to that wash, drifting one grid square every 92 seconds.
- Other textures: a 26px dot grid and an 80px line grid, both at 2.8–5% white. A mesh texture image ships in `assets/imagery/texture-mesh.jpg`.
- Imagery is cool and dark — product screenshots on near-black, no photography, no illustration. There is no illustration style, because the brand has none.

### Motion

- `--t-fast .12s` for tints, `--t .16s` for buttons and nav, `--t-slow .3s` for cards and frames, `--t-enter .6s` for scroll entrances.
- Easings: `--ease cubic-bezier(.4,0,.2,1)`, `--ease-out`, `--ease-enter cubic-bezier(.25,1,.5,1)` for anything arriving.
- Entrances: `fadeUp` (16px + opacity) on scroll intersection; headline lines wipe up from behind a mask; product frames tilt in from `perspective(1300px) rotateX(7deg)` and settle.
- Body copy fills word-by-word on a scroll-driven `view()` timeline — with a plain full-opacity fallback, because body text must never need an effect to be legible.
- Everything collapses to 0.01ms under `prefers-reduced-motion`.

### States

- **Hover**: cards lift 2px and warm their border; rows tint `rgba(255,255,255,.02)`; solid buttons *lighten* to `#7D67F9` rather than darkening; nav links go from `--text-3` to `--text` on a 5% white pill.
- **Press**: 2% scale-down. Nothing bounces.
- **Focus**: a 2px `#818CF8` outline at 2px offset with a 6px radius, on `:focus-visible` only — mouse clicks stay clean.
- **Disabled**: 40% opacity, `cursor: not-allowed`. Never remove the control.
- **Loading**: skeletons that match the real layout exactly, so nothing shifts when data lands. Spinners only for in-flight actions.
- **Touch**: every control gets a 44px hit area on a coarse pointer without changing how it looks.

---

## ICONOGRAPHY

- **Lucide** is the icon set, used at **size 20** in navigation and 14–16px inline. This is the app's real dependency (`lucide-react`), and the UI kits load it from CDN (`unpkg.com/lucide@0.474.0`) rather than re-drawing anything.
- The named icons the app actually uses: `BarChart3, Bot, Activity, Sparkles, LayoutDashboard, Lightbulb, Search, Zap, Users, Rocket, ScrollText, ShieldAlert, Factory, BookOpen, Package, Monitor, Pencil, Palette, CreditCard, Gauge, Brain, PanelLeft, PanelLeftClose, Compass, ChevronRight, ChevronUp, ChevronDown, Copy, Check, Loader2, TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Database, LogIn`.
- Strokes are Lucide's default 2px, `round` caps and joins, `currentColor`. Icons never carry their own colour except when they carry semantic meaning (an emerald trend arrow, a red alert triangle).
- **No emoji, anywhere.** Unicode is used sparingly and only where it is faster to read than an icon: `⌘` and `F` in the search shortcut chips, `↑ ↓` in change tags, `✓` in inclusion lists, `—` for "no data", `·` as a separator, `▲▼` in the profile chevron stack.
- **Brand marks are monochrome.** Integration chips render a letterform (`M`, `G`, `TW`, `TT`, `S`) on a neutral 24px tile rather than a colour logo — six brand palettes in one strip reads as a logo salad.
- **Logo.** Spectra ships one mark: a white, softly extruded **wordmark**. There is no icon-only lockup, no monogram, and none was invented here. Files: `assets/logos/spectra-wordmark-white.png` (site), `assets/logos/spectra-wordmark.webp`, `assets/logos/spectra-app-logo.png` (dashboard), `assets/logos/favicon.ico`. Render at 18–20px in a nav, 24px in the sidebar, 28px in a footer.

---

## Substitutions and gaps — please review

- **Fonts.** `GeistMono-Variable.woff2` is the real file, copied from the marketing repo. Inter, Inter Tight and JetBrains Mono are loaded from Google Fonts exactly as both products load them (the app links Google Fonts in `index.html`; the site asks for `'Inter Variable'` locally). If you have licensed binaries, drop them in `assets/fonts/` and I will swap the `@font-face` rules.
- The marketing `index.html` also loads **DM Sans** and **Instrument Serif** from Google Fonts, but no rule in `src/index.css` uses either. They are treated as dead links and are not in this system — tell me if they are meant to be live.
- **No photography or illustration** exists in either repo beyond product screenshots and client ad creatives. Client creatives were deliberately **not** copied (the multi-tenancy rule), so creative thumbnails in the UI kits are abstract tiles.
- `assets/imagery/spectra-dashboard.png`, `og-card.jpg`, `texture-mesh.jpg` and `kratos-avatar.jpeg` are the real shipped images.

---

## Index

```
styles.css                  the single entry point consumers link
tokens/                     fonts · colors · typography · spacing · elevation · motion · base · patterns
assets/logos/               wordmarks + favicon
assets/fonts/               GeistMono-Variable.woff2
assets/imagery/             dashboard shot, OG card, mesh texture, Kratos avatar, TikTok mark
guidelines/                 24 foundation specimen cards (Colors · Type · Spacing · Brand)
components/                 the reusable primitives (below)
ui_kits/spectra-app/        agency dashboard recreation — 4 screens, click-through
ui_kits/spectra-site/       marketing site recreation — 11 sections
reference/                  verbatim source CSS + primitives, as .txt
SKILL.md                    Agent Skills entry point
github.md                   upstream repo association + screen map
```

### Components

**Primitives** — `Button`, `Chip`, `Badge`, `Toggle`, `Eyebrow`
**Data** — `KpiCard` (+`ChangeTag`), `KpiStrip`, `StatCard`, `MetricTile`, `Sparkline`, `VerifyBadge`
**Surfaces** — `Card`, `BrowserFrame`, `PlanCard`, `EmptyState`, `IntegrationChip`
**Navigation** — `SidebarNavItem`, `NavPill`, `UserProfileCard`
**Marketing** — `SectionHeader`, `TerminalLog`

Each directory carries a `<Name>.d.ts` props contract and a `<Name>.prompt.md`
with a usage example, plus one `@dsCard` HTML showing the variants.

**Intentional additions.** Neither repo exports a formal component library — the
app has six files under `src/components/ui/` and the site has its primitives in
`src/ui.tsx` plus class recipes in `src/index.css`. The set above is those two
inventories merged and named; three names are ours rather than the source's:
`Button` and `Chip` (the site defines these as CSS classes `.btn*` / an inline
`Chip`, not as exported components), and `KpiStrip` (extracted from
`campaign-ops/KpiStrip.tsx`, which was a fixed seven-cell component). Nothing
here is a primitive the products do not actually use.

### UI kit screens

| Screen | Recreated from |
|---|---|
| Sign in | `src/components/auth/AuthModals.tsx` |
| Ad Performance | `src/pages/AdPerformancePage.tsx`, `ad-performance/KpiCards.tsx`, `DashboardHeader.tsx`, `CreativePerformanceTable.tsx`, `ChannelBreakdown.tsx`, `ConversionFunnel.tsx` |
| Campaign Ops | `campaign-ops/{SummaryCards,KpiStrip,AccountRow,CampaignRow,CampaignCard,ResurrectAccountModal}.tsx` |
| Kratos | `README.md`, `kratos/{KratosHero,ChatTab,ThinkingPanel,AgentInspectorTab}.tsx`, `docs/PRODUCT-AND-POSITIONING.md` §2 |
| Creative Analytics | `creative-analytics/{CreativeGallery,CreativeDetail,LearningLoopPanel}.tsx` |
| Marketing site | `src/{App,sections,learning,breakdown,kratos,adlauncher,pricing,pain,flywheel,ui}.tsx`, `src/index.css`, `COPY-AUDIT.md` |

Each kit also has a `_dev.html` that loads the component sources directly rather
than through the compiled bundle — useful if the bundle is stale.
