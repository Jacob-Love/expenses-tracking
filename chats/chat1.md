# Business expense and revenue tracker

_Started 2026-10-03 07:27 UTC_

---

## User

create a business expense tracker that i can add subscriptions and one time charges to track every expense i make and then also my recurring revenue for the business. employees software, etc

## Assistant



## Assistant

_[tool: read_skill_prompt]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: ask_user]_

Waiting on your answers — revenue types, categories, screens, currency, and seed data.

## User

Answered — revenue: Both; categories: Payroll, Contractors, Software, Ad spend; views: Overview dashboard, Expense ledger, Subscriptions, Revenue, Upcoming renewals, Monthly P&L chart; currency: USD; seed: Sample data

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: grep]_

Template saved intact; now the quick-add bar (low-friction logging) and the logic class in smaller pieces.

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: read_skill_prompt]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the report button and panel in the template.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

## User

should be able to create categories as well

## Assistant

Adding custom categories: a "+ New category" option in the form's category select (prompts inline), persisted and available to filters and the quick-add parser.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

Cleaning up two stray lines I left in that block (an empty `sc-if` and an expression hole, which isn't allowed).

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

## User

what other features would make this better?

## Assistant

Ranked by payoff for the "log everything with no friction" goal:

1. **Bank/card CSV import** — paste or drop a statement export; the model categorizes each line in one batch, flags likely duplicates of existing subscriptions. Removes most manual logging.
2. **Auto-detect subscriptions** — when the same vendor and amount repeat monthly in one-off entries, suggest converting it to a subscription.
3. **Budgets per category** with a quiet "over pace" indicator on the Expenses page.
4. **Receipt/invoice attachment** — drop an image on an entry; the model reads vendor, amount, date and prefills it.
5. **Client/project tags on revenue** — so you can see margin per client, not just totals.
6. **Alerts** — annual renewals 14 days out, a paused subscription that charged anyway, net going negative on projected run rate.
7. **Export** — CSV for your accountant, and a one-click PDF of the monthly report.
8. **Multi-currency with conversion** if you pay any vendors outside USD.
9. **Cash-flow forecast** — 90-day projection from recurring entries plus known one-offs.
10. **Tax set-aside** — a percentage of revenue held back, shown as a line on net.

Which ones do you want? 1, 2 and 7 are the fastest to add.

## User

Save as standalone HTML: `Expense Tracker.dc.html`

## Assistant

One caveat before bundling: the Haiku-powered categorization and monthly report rely on this environment's built-in model helper, which won't exist in a standalone file. Everything else (quick-add with rule-based categorizing, ledger, subscriptions, revenue, chart, renewals, localStorage persistence) works offline. I'll bundle it now; the two AI features will simply fall back gracefully (categorization uses the rules; the report button reports it's unavailable).

_[tool: read_file]_

_[tool: run_script]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: present_fs_item_for_download]_

Standalone file is above — works offline, data saves in the browser. Only the model-driven categorization and monthly report need this environment; the rule-based quick-add still works in the file.

## User

i think we will use gemini for this low cost model

## Assistant

I'll add a Gemini path: a small settings step where you paste a Gemini API key (stored in your browser only), and the categorizer/report call `gemini-2.0-flash-lite` directly. In this environment it keeps using the built-in helper when no key is set.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the settings entry point in the sidebar and the key panel.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Re-bundling the standalone with Gemini support included.

_[tool: run_script]_

_[tool: super_inline_html]_

_[tool: ready_for_verification]_

_[tool: present_fs_item_for_download]_

