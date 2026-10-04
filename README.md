# Ledger — business expense & revenue tracker

Implementation of the Claude Design handoff in `project/Expense Tracker.dc.html`
(design history in `chats/`, original bundle notes in `HANDOFF.md`).

Log one-time charges, subscriptions, and recurring revenue in one line
("Design tool 24/mo", "+Retainer client 02 4500/mo"); see run rate, a 12-month
P&L, upcoming renewals, and a model-written monthly report.

## Run

```bash
npm install
cp .env.example .env        # add GEMINI_API_KEY
npm run dev                 # http://localhost:5173
```

Production:

```bash
npm run build
GEMINI_API_KEY=... npm start   # serves dist/ + /api/ai on $PORT (default 3000)
```

`npm test` runs the parser/metrics/proxy tests; `npm run typecheck` runs tsc.

## Gemini

- Model defaults to `gemini-3.1-flash-lite` (override with `GEMINI_MODEL`).
  The prototype used `gemini-2.0-flash-lite`, which Google shut down on 2026-06-01.
- Thinking is set explicitly (`minimal` for categorizing, `low` for the report).
  Gemini 3.x defaults to `high`, which costs more and is slower.
- The key lives on the server. The browser calls `/api/ai/classify` and
  `/api/ai/report` only, and the server builds the prompts, so the proxy can't
  be used as a general LLM endpoint. Categories are constrained by a JSON
  schema and checked again after the response comes back.
- The Model panel in the sidebar also accepts a key that stays in that browser only
  and overrides the server key there. That's handy for static hosting with no server.
- With no key, quick-add still works: the rules handle categories, and the model
  is only asked about lines the rules can't place.

## Data

Entries, custom categories, and sidebar state are kept in `localStorage`
(`ledger-entries-v1`, `ledger-cats-v1`). The first load seeds sample data.

## Layout

```
server/gemini.ts    REST call to Gemini (shared by server + browser-key path)
server/prompts.ts   the two prompts, input limits, output validation
server/handler.ts   /api/ai/* — mounted by vite.config.ts and server/index.ts
src/lib/ledger.ts   entry model, quick-add parser, metrics
src/components/     Spectra DS components (ported from project/_ds) + shared UI
src/views/          Overview, Expenses, Subscriptions, Revenue, modals
src/styles/spectra/ design tokens copied from the DS bundle
```
