# Klicmelding.nl — Design Spec

**Version:** 1.0
**Date:** 2026-04-24
**Scope:** Full redesign — homepage, service/info pages, multi-step form, FAQ, confirmation/thank-you
**Direction:** Clean, professional, trustworthy. Keeps the existing logo and core blue; everything else is modernised.

---

## 1. Design principles

These four principles guide every decision in this spec. When in doubt, apply them in order.

**Clarity over decoration.** The primary job of the site is to get users through a 4-step form and collect payment. Every visual element must support that job. No decorative stock photos, no filler illustrations.

**Calm, trustworthy tone.** Klicmelding.nl handles a legal obligation (WION / graafmelding) for customers. The design should feel like a reliable service provider — closer to a bank or a utility portal than a consumer marketing site. Plenty of whitespace, restrained colour, a professional sans-serif.

**One clear next action per screen.** The current site has a sidebar "Direct aanvragen" CTA plus inline CTAs plus login — three competing actions. The redesign collapses this into a single primary CTA per screen, with secondary actions visually demoted.

**Responsive from day one.** The current site is locked to a desktop width. The new design is mobile-first: contractors on a construction site need to submit a klicmelding from a phone.

---

## 2. Brand foundations

### 2.1 Logo

Keep the existing mark: blue speech bubble with white checkmark + "Klicmelding.nl" wordmark.

| Rule | Value |
|---|---|
| Minimum width | 120 px |
| Clear space on all sides | Equal to the height of the checkmark glyph |
| On light backgrounds | Use standard full-colour version |
| On dark backgrounds (footer) | Use a white/reversed version — commission from the logo designer if not available |
| Favicon | Just the speech-bubble mark, no wordmark |

**Do not** re-colour the logo, re-draw it, or place it on a photograph. If we need a dark-background logo, reverse it (white wordmark) — don't recolour the bubble.

### 2.2 Tagline

"Graafschade voorkomen." Drop the trailing ellipsis ("...") — it reads as hesitant. Treat the tagline as secondary; it can sit under the logo on the homepage hero and in email signatures, but not in the global header on every page.

### 2.3 Voice & tone

Dutch. Directly address the user with "u" (formal), matching the current site. Short sentences. Prefer active voice.

Avoid:
- ALL CAPS body copy (the current payment page shouts "ATTENTIE: KLIK NA UW BETALING..." — rewrite as a normal-case informational banner)
- Fully justified text (causes uneven word spacing); use left-aligned throughout
- Exclamation marks in headings
- Jargon without a one-line explanation ("klicmelding", "WION", "grondroerdersregeling" all need a first-use gloss for consumer visitors)

---

## 3. Design tokens

All tokens should be implemented as CSS custom properties (`--token-name`) and reused everywhere. No hard-coded colours or pixel values in components.

### 3.1 Colour

**Primary / brand blue.** Retains the existing cyan-blue identity but slightly deepened for AA contrast on white.

| Token | Hex | Role |
|---|---|---|
| `--color-primary-50` | `#EFF9FD` | Lightest background wash (hero background, info callout) |
| `--color-primary-100` | `#D6F0FA` | Subtle card background, focused form field fill |
| `--color-primary-500` | `#0EA5E9` | Brand blue — used for the logo bubble, link text on white |
| `--color-primary-600` | `#0284C7` | **Primary action colour** — buttons, active nav, focus rings |
| `--color-primary-700` | `#0369A1` | Hover state for primary buttons |
| `--color-primary-900` | `#0C4A6E` | Text on primary-50, headline accent |

**Neutrals.** Slightly warm gray rather than the current cool gray; reads friendlier while remaining professional.

| Token | Hex | Role |
|---|---|---|
| `--color-ink-900` | `#0F172A` | Body text default |
| `--color-ink-700` | `#334155` | Secondary text (labels, metadata) |
| `--color-ink-500` | `#64748B` | Muted text, placeholders |
| `--color-ink-300` | `#CBD5E1` | Border, divider default |
| `--color-ink-200` | `#E2E8F0` | Subtle border, disabled surface |
| `--color-ink-100` | `#F1F5F9` | Page-section background |
| `--color-ink-50`  | `#F8FAFC` | Page background |
| `--color-white`   | `#FFFFFF` | Card surface, form field background |

**Semantic.**

| Token | Hex | Role |
|---|---|---|
| `--color-success-500` | `#10B981` | Success toast, confirmed state, step-complete check |
| `--color-success-50`  | `#ECFDF5` | Success banner background |
| `--color-warning-500` | `#F59E0B` | Warning toast, "klic-melding is 20 dagen geldig" notice |
| `--color-warning-50`  | `#FFFBEB` | Warning banner background |
| `--color-error-500`   | `#EF4444` | Validation error text/icon |
| `--color-error-50`    | `#FEF2F2` | Validation error field background |

**Contrast.** Every text/background pair in this spec meets WCAG 2.1 AA (4.5:1 for body, 3:1 for large text). Notably: do **not** use `--color-primary-500` for body text on white — use `--color-primary-600` or darker.

### 3.2 Typography

**Typeface.** Inter (variable font, served via Google Fonts or self-hosted). Falls back to system sans-serif. Rationale: Inter is legible at small sizes, has excellent number glyphs (important for postcodes, dates, reference numbers), and feels contemporary without being trendy.

```
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Type scale.** Mobile-first base is 16 px / 1 rem. Desktop bumps hero headings only.

| Token | Size (rem / px) | Weight | Line-height | Use |
|---|---|---|---|---|
| `--font-display` | 2.5 / 40 — 3.5 / 56 (desktop) | 700 | 1.1 | Homepage hero H1 only |
| `--font-h1` | 2 / 32 | 700 | 1.2 | Page titles |
| `--font-h2` | 1.5 / 24 | 600 | 1.3 | Section headers |
| `--font-h3` | 1.25 / 20 | 600 | 1.35 | Card titles, form step titles |
| `--font-h4` | 1.125 / 18 | 600 | 1.4 | Form group labels |
| `--font-body` | 1 / 16 | 400 | 1.6 | Default paragraph |
| `--font-body-lg` | 1.125 / 18 | 400 | 1.6 | Lede paragraph after H1 |
| `--font-small` | 0.875 / 14 | 400 | 1.5 | Field helper text, captions |
| `--font-micro` | 0.75 / 12 | 500 | 1.4 | Legal fine print, footer meta |
| `--font-label` | 0.875 / 14 | 600 | 1.4 | Form labels, button text |

**Alignment:** left-aligned body text everywhere. No justify.

**Line length:** body copy max 65–75 characters per line (≈ 640 px container at this type size).

### 3.3 Spacing

8-point grid. Use these tokens — don't invent intermediate values.

| Token | Value |
|---|---|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-5` | 24 px |
| `--space-6` | 32 px |
| `--space-7` | 48 px |
| `--space-8` | 64 px |
| `--space-9` | 96 px |

**Typical use:**
- Space between label and input: `--space-2`
- Space between form fields in a stack: `--space-5`
- Space between form sections: `--space-7`
- Section padding top/bottom (desktop): `--space-9`
- Section padding top/bottom (mobile): `--space-7`

### 3.4 Layout & breakpoints

| Breakpoint | Min width | Notes |
|---|---|---|
| `sm` | 640 px | Large phones / small tablets |
| `md` | 768 px | Tablets |
| `lg` | 1024 px | Small laptops — show full nav |
| `xl` | 1280 px | Desktop — max container width |

**Content container:** `max-width: 1200px`, horizontal padding `--space-5` mobile / `--space-7` desktop, centred.

**Narrow container** (for forms, legal text): `max-width: 720px` centred.

### 3.5 Radii

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4 px | Form inputs |
| `--radius-md` | 8 px | Buttons, small cards |
| `--radius-lg` | 12 px | Cards, modals |
| `--radius-pill` | 9999 px | Step indicator bubbles, badges |

### 3.6 Shadow / elevation

Restrained — this is not a product-design-team portfolio site.

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.08)` | Raised cards |
| `--shadow-md` | `0 4px 6px -1px rgba(15,23,42,0.08), 0 2px 4px -2px rgba(15,23,42,0.06)` | Dropdowns, popovers |
| `--shadow-focus` | `0 0 0 3px rgba(2,132,199,0.35)` | Keyboard focus ring |

### 3.7 Motion

Short, functional. No attention-seeking animations.

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120 ms | Button hover colour change, checkbox tick |
| `--duration-base` | 200 ms | Input border on focus, card hover |
| `--duration-slow` | 320 ms | Page-section reveals, step transitions |
| `--ease-standard` | `cubic-bezier(0.2, 0.0, 0.2, 1)` | Default ease |

**Respect `prefers-reduced-motion: reduce`** — disable all non-essential transitions.

---

## 4. Core components

### 4.1 Button

Three variants, three sizes. Keep the component strict — no one-off button styles per page.

**Variants:**

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| `primary` | `--color-primary-600` | `white` | none | Main CTA on screen (max one per screen) |
| `secondary` | `white` | `--color-primary-700` | 1 px `--color-primary-600` | Back / alternative action |
| `ghost` | transparent | `--color-ink-700` | none | Tertiary action, card footer links |

**Sizes:**

| Size | Height | Padding | Font |
|---|---|---|---|
| `sm` | 36 px | 0 `--space-4` | `--font-label` |
| `md` (default) | 44 px | 0 `--space-5` | `--font-label` |
| `lg` | 52 px | 0 `--space-6` | 1rem / 600 |

**States:** default → hover (bg shifts to `--color-primary-700` for primary) → focus (adds `--shadow-focus`) → active (bg shifts to `--color-primary-900`, translateY 1px) → disabled (opacity 0.5, not-allowed cursor).

**Labels:** Sentence case (`Klicmelding aanvragen`), **not** ALL CAPS. The current site's `KLICMELDING AANVRAGEN` in uppercase reads as shouty.

**Min touch target:** 44×44 px on mobile (Apple/WCAG guidance).

### 4.2 Form field — text input

Clean, quiet default. Colour only appears on focus and error states — not on "valid".

```
┌─────────────────────────────────────┐
│ Postcode                            │  ← label, --font-label, --color-ink-700
├─────────────────────────────────────┤
│                                     │  ← input, 44 px tall, white bg,
│  1234 AB                            │    1 px --color-ink-300 border,
│                                     │    --radius-sm, 12 px horizontal pad
└─────────────────────────────────────┘
  Format: 1234 AB                        ← helper text, --font-small, --color-ink-500
```

**States:**

| State | Border | Background | Notes |
|---|---|---|---|
| Default | 1 px `--color-ink-300` | `white` | — |
| Hover | 1 px `--color-ink-500` | `white` | Cursor is over the field |
| Focus | 2 px `--color-primary-600` + `--shadow-focus` | `white` | Keyboard or click |
| Filled / valid | 1 px `--color-ink-300` | `white` | **Identical to default — do not highlight.** The current site's green border on filled fields is unnecessary visual noise |
| Error | 2 px `--color-error-500` | `--color-error-50` | Error message below, with `!` icon |
| Disabled | 1 px `--color-ink-200` | `--color-ink-100` | Text `--color-ink-500` |

**Label placement:** above the field, left-aligned, 4 px above.

**Required indicator:** small red asterisk after the label. Show a legend "* = verplicht" once per form near the top, not once per form section like the current site.

**Errors:** inline, below the field, with a short helpful message ("Voer een geldige postcode in, bijvoorbeeld 1234 AB"), not just "verplicht veld".

### 4.3 Form field — select (dropdown)

Same dimensions as text input. Use the native `<select>` for mobile compatibility, but style it with a custom chevron icon (`--color-ink-500`) 12 px from the right edge. Do not replace it with a custom JS dropdown unless we need a searchable list — the current "Aard van werkzaamheden" list has ~40 options, which **does** warrant a searchable combobox with type-ahead.

### 4.4 Form field — checkbox / radio

- Custom-styled box: 20×20 px, `--radius-sm`, 1 px `--color-ink-300`.
- Checked: background `--color-primary-600`, white check icon.
- Focus: `--shadow-focus`.
- Label to the right, click target covers the full label.

### 4.5 Card

Default card: `white` background, `--radius-lg`, `--shadow-sm`, padding `--space-6`.

Use for: homepage service tiles, FAQ items, summary blocks.

Do **not** nest cards in cards — creates visual weight.

### 4.6 Navigation — global header

**Structure (desktop ≥ 1024 px):**

```
┌────────────────────────────────────────────────────────────────────┐
│  [LOGO]    Home  Over  Aanvragen  FAQ  Producten  [Inloggen] [CTA] │
└────────────────────────────────────────────────────────────────────┘
```

- Height: 72 px.
- Background: `white`, bottom border 1 px `--color-ink-200`.
- Logo aligned left, 40 px tall.
- Nav links: `--font-label`, `--color-ink-700`, 32 px horizontal gap. Active link has `--color-primary-600` text + a 2 px underline 6 px below the text baseline. **No full-width blue bar, no tabs** — the current double-header wastes vertical space.
- Right side: "Inloggen" as a `ghost` button + "Klicmelding aanvragen" as a `primary` button. This replaces the current separate login box on the homepage.

**Mobile (< 1024 px):** logo left, hamburger icon right. Hamburger opens a full-screen overlay with nav links stacked, CTA button at the bottom, close (×) top-right.

The tagline "Graafschade voorkomen" does **not** appear in the global header. It belongs on the hero only.

### 4.7 Navigation — footer

Dark footer: background `--color-ink-900`, text `--color-ink-300`. Padding `--space-8` top/bottom.

Four columns on desktop, stacked on mobile:

1. **Logo (reversed) + one-sentence description** of what Klicmelding.nl does
2. **Diensten:** Klicmelding aanvragen, Oriëntatieverzoek, Producten
3. **Informatie:** Over klicmelding, Vraag & antwoord, Downloads
4. **Juridisch:** Disclaimer, Algemene voorwaarden, Privacy- en cookiebeleid, Contact

Below the columns, a divider and a single line of micro-copy: "Klicmelding.nl en Graafmelding.nl zijn handelsnamen van Graafmelding.nl BV — KvK Brabant 53.11.20.16".

The grey "Graafmelding.nl BV is een zelfstandige organisatie..." disclaimer is **removed from every page** and relocated to the footer (single location) and the "Over klicmelding" page.

### 4.8 Step indicator (for multi-step form)

Horizontal strip at the top of every form step:

```
 ┌───┐      ┌───┐      ┌───┐      ┌───┐
 │ 1 │──────│ 2 │──────│ 3 │──────│ 4 │
 └───┘      └───┘      └───┘      └───┘
Klant    Graafmeld.  Werkzh.    Extra
```

- Four circles (36 px), connected by a 2 px line.
- Completed step: filled `--color-primary-600`, white checkmark icon.
- Current step: filled `--color-primary-600`, white number, 3 px `--color-primary-100` ring.
- Upcoming step: `white` fill, 1 px `--color-ink-300` border, grey number.
- Line: `--color-primary-600` up to current step, `--color-ink-200` after.
- Label under each circle, `--font-small`, `--color-ink-700`; current label `--color-ink-900` + 600 weight.

On mobile, show only the current step (large): "Stap 2 van 4 — Graafmelding gegevens" with a progress bar below.

### 4.9 Alert / notice banner

Full-width within its container, padding `--space-4` `--space-5`, `--radius-md`, left-side 4 px coloured bar.

| Type | Bar | Bg | Icon | Use |
|---|---|---|---|---|
| info | `--color-primary-600` | `--color-primary-50` | ℹ | General information ("gebied max 500×500 m") |
| success | `--color-success-500` | `--color-success-50` | ✓ | After submit / payment |
| warning | `--color-warning-500` | `--color-warning-50` | ⚠ | "klic-melding is 20 dagen geldig" |
| error | `--color-error-500` | `--color-error-50` | ! | Form-level validation error summary |

Replaces: the current grey disclaimer box, the current bold italic "Bij 1 op de 10..." pullquote, the current ALL-CAPS attentie block on the payment page.

### 4.10 Accordion (FAQ)

Replaces the heavy solid-blue pill bars currently used for FAQs.

- Each item is a full-width row with a thin bottom divider (1 px `--color-ink-200`).
- Closed: question in `--font-h4`, `--color-ink-900` left, chevron-down icon `--color-ink-500` right, 20 px vertical padding, white background.
- Hover: subtle `--color-ink-50` background.
- Open: chevron rotates to up, answer revealed below the question in `--font-body`, `--color-ink-700`, bottom padding `--space-5`.
- Category headings (Alles over Klicmelding / De regelgeving / Kosten / Contact) use `--font-h2`, 48 px space-above.
- No background colour on the question bar. Only typography and chevron signal affordance.

---

## 5. Page layouts

### 5.1 Homepage

**Hero (above the fold):**

Desktop layout, single column centred, `max-width: 900px`:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   [Small eyebrow label: Online dienst — WION]    │
│                                                  │
│   Uw klicmelding.                                │  ← --font-display, --color-ink-900
│   Onze zorg.                                     │
│                                                  │
│   Klicmelding.nl regelt de wettelijk verplichte  │  ← --font-body-lg, --color-ink-700
│   klicmelding voor u. Snel, digitaal en         │    max ~2 lines, short
│   compleet.                                      │
│                                                  │
│   [ Klicmelding aanvragen ]   [ Hoe werkt het? ] │  ← primary lg + secondary lg
│                                                  │
│     ✓ Rapport per e-mail      ✓ Vanaf €xx       │  ← mini trust row, --font-small
│     ✓ Volledig volgens WION                     │
└──────────────────────────────────────────────────┘
```

- Hero background: `--color-primary-50` (very subtle blue wash) or plain white with a thin bottom border.
- **No hero photograph** in v1. The current excavator stock photo adds visual weight but no information. If we want imagery later, commission a custom illustration (abstract cables + checkmark) rather than stock.
- CTA stack: primary "Klicmelding aanvragen" goes to the form; secondary "Hoe werkt het?" scrolls to the explanation section.

**Section 2 — "Hoe werkt het?" (explainer for first-timers):**

Three cards side-by-side, equal width:

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  [icon: 1]  │   │  [icon: 2]  │   │  [icon: 3]  │
│             │   │             │   │             │
│ Vul het     │   │ Wij         │   │ Rapport     │
│ formulier   │   │ verzorgen   │   │ per e-mail  │
│             │   │ uw aanvraag │   │             │
│             │   │             │   │             │
│ 4 stappen,  │   │ Binnen X    │   │ PDF + A3    │
│ ~5 minuten  │   │ werkdagen   │   │ tekening    │
└─────────────┘   └─────────────┘   └─────────────┘
```

- Icons: simple line icons (Lucide, Heroicons, or similar), stroke `--color-primary-600`, 32 px. Never use multi-colour 3D icons like the current question-mark graphic on the FAQ page.
- Card title `--font-h3`; body `--font-body`, 3 lines max.

**Section 3 — Who it's for (two-audience split):**

```
┌───────────────────────┬───────────────────────┐
│                       │                       │
│  Voor particulieren   │    Voor bedrijven     │
│                       │                       │
│  Eenmalige aanvraag,  │  Herhaalde aanvragen, │
│  betalen via iDEAL.   │  factuurbetaling,     │
│                       │  gratis account.      │
│                       │                       │
│  [Aanvraag starten →] │  [Account + aanvraag] │
└───────────────────────┴───────────────────────┘
```

- Two cards, `--color-ink-100` background.
- Replaces the current three-column bottom strip (particulieren / bedrijven / inloggen). Login moves to the global header.

**Section 4 — Trust / proof:**

A single line of statistics or a short testimonial block (max 2 testimonials). Keep it optional for v1 — launch without it if we don't have content.

**Section 5 — Secondary CTA:**

Full-width band, `--color-primary-600` background, white text, centred.

> Klaar om uw klicmelding aan te vragen?  
> [ Klicmelding aanvragen → ]

---

### 5.2 Service / info pages (Over Klicmelding, Producten, Downloads)

Shared template: narrow text container (720 px).

```
┌────────── Global header ──────────┐
├────────────────────────────────────┤
│                                    │
│  Over klicmelding                  │  ← --font-h1
│                                    │
│  Korte lede over wat klicmelding   │  ← --font-body-lg, 1–2 lines
│  is en waarom dit relevant is.     │
│                                    │
│  ─── 1 px divider ────────────     │
│                                    │
│  ## Sinds 2008: de wet WION        │  ← --font-h2
│                                    │
│  Sinds 1 juli 2008 geldt...        │  ← --font-body, left-aligned
│                                    │
│  > Bij 1 op de 10 graafwerk-       │  ← blockquote — left border 3 px
│  > zaamheden ontstaat graafschade  │    primary-600, italic, padded left
│                                    │
│  ## Wist u dat                     │  ← --font-h2
│  - Een klicmelding is verplicht... │  ← real bullet list, no justify
│  - Bij 1 op de 10 graaf...        │
│  ...                               │
│                                    │
│  ─── 1 px divider ────────────     │
│                                    │
│  [ CTA card: Klicmelding aanvragen ]│
│                                    │
├────────── Footer ──────────────────┤
```

**Downloads page** uses the same template; the three PDFs render as a list of cards, each with a PDF icon, the document title, and a small "PDF · [size]" metadata line.

**Producten page** lists each product as a card: icon + title + one-paragraph description + price (if shown) + inline CTA. Remove the redundant "Direct aanvragen" sidebar.

**Vraag & Antwoord** uses the accordion component (§ 4.10). Add a search input at the top ("Zoek in veelgestelde vragen...") — with 40+ FAQs, search is the fastest path.

---

### 5.3 Form pages — `Klicmelding aanvragen`

The centrepiece of the site. Single-column, narrow container (720 px), no sidebar.

**Fixed top:** step indicator (§ 4.8).

**Page structure per step:**

```
┌────────── Global header ──────────┐
├────────────────────────────────────┤
│  Step indicator                    │
│  ○───○───●───○                     │
├────────────────────────────────────┤
│                                    │
│  Stap 2 — Graafmelding gegevens    │  ← --font-h1
│                                    │
│  Korte instructie van 1 regel.     │  ← --font-body, --color-ink-700
│                                    │
│  [ Info alert, only if needed ]    │  ← e.g. max 500×500 m notice
│                                    │
│  ─── form fields stacked ────────  │
│                                    │
│  Aanvangsdatum *                   │
│  [ 01-05-2026                  ]   │
│                                    │
│  Geschatte einddatum *             │
│  [ 07-05-2026                  ]   │
│  Uw klicmelding is wettelijk       │  ← helper text below the field
│  20 dagen geldig.                  │
│                                    │
│  Straat + huisnummer *             │
│  [                             ]   │
│                                    │
│  Postcode *             Plaats *   │
│  [ 1234 AB ]            [ Amster ] │  ← side-by-side on desktop,
│                                    │    stacked on mobile
│                                    │
│  Huisaansluiting *                 │
│  ○ Ja                              │  ← radios instead of dropdown
│  ○ Nee                             │    where there are 2–3 options
│                                    │
│  ─── * = verplicht ──────────────  │
│                                    │
│  [ ← Terug ]         [ Verder → ]  │  ← secondary + primary, spread
│                                    │
├────────── Footer ──────────────────┤
```

**Removals from the current form:**

- **Fax field.** Delete. It's 2026.
- **Stock photo (hand on keyboard).** Delete from every step.
- **Repeated paragraph** ("Vul hier snel en eenvoudig...") on every step. Show once on step 1 only.
- **Repeated "max 500×500 m polygon" paragraph.** Move into an info alert shown only on the step where polygon area matters.
- **Coloured (green/red) field borders.** Use quiet default borders; apply colour only on focus and error.

**Additions:**

- **Save & resume:** add a "Tussentijds opslaan" button that emails the user a link to resume the form (eliminates the current behaviour where abandoned aanvragen are thrown away — hostile to users).
- **Searchable combobox for "Aard van werkzaamheden"** (~40 options). Type-ahead filter; arrow keys to navigate; Enter to select; chip-list shows selected items, each with an × to remove.
- **Inline validation** on blur (not on keystroke); full-form validation on submit.
- **Autocomplete attributes:** `autocomplete="postal-code"`, `"street-address"`, `"tel"`, `"email"`, etc. This lets password managers and browser autofill do their job.
- **Sticky bottom action bar on mobile** with Back and Verder buttons, so users don't have to scroll through a long form to find them.

**Step 4 overview / overzicht:**

Before payment, show a read-only summary of everything the user entered, grouped by step, with an "Wijzigen" link per section that deep-links back. Replaces the current bare `label: value` dump styled like a form.

---

### 5.4 Payment / confirmation pages

**Payment redirect page** (replaces current "Aanvraag betalen" screen):

```
┌────────────────────────────────────┐
│                                    │
│  Uw aanvraag is opgeslagen         │  ← h1
│                                    │
│  Aanvraagnummer: KM-2026-04823     │  ← in a bordered card, monospace
│                                    │
│  Rond uw aanvraag af door de       │
│  betaling te voltooien.            │
│                                    │
│  ┌───────────────────────────────┐ │
│  │ Totaal te betalen    € 45,00  │ │
│  │ BTW inbegrepen                │ │
│  └───────────────────────────────┘ │
│                                    │
│  [ Betalen met iDEAL / Wero →  ]   │  ← full-width primary button
│                                    │
│  U wordt doorgestuurd naar de      │  ← --font-small, --color-ink-500
│  beveiligde betaalpagina van onze  │
│  payment-provider.                 │
│                                    │
└────────────────────────────────────┘
```

- **No ALL-CAPS attentie block.** The "terug naar winkel" instruction is handled automatically by the payment provider's redirect; if we genuinely need manual navigation back, put it in an info alert (§ 4.9).
- iDEAL + Wero logos shown **inside** the pay button or as small icons beside it, not as a standalone yellow banner.

**Success / thank-you page:**

```
┌────────────────────────────────────┐
│                                    │
│          [ ✓ icon, 64 px ]         │  ← success-500 circle, white check
│                                    │
│  Bedankt — uw aanvraag is          │  ← h1
│  ontvangen                         │
│                                    │
│  Aanvraagnummer: KM-2026-04823     │
│                                    │
│  U ontvangt binnen [X werkdagen]   │
│  het rapport per e-mail op         │
│  test@example.com                  │
│                                    │
│  ─── wat nu? ─────────────────     │
│  1. Wij controleren uw aanvraag    │
│  2. We verzamelen de tekeningen    │
│  3. U ontvangt het PDF-rapport     │
│                                    │
│  [ Nog een aanvraag indienen ]     │
│  [ Terug naar home ]               │
│                                    │
└────────────────────────────────────┘
```

- Centred content, narrow container.
- Clear statement of *what happens next* and *when* — the current site provides neither.

---

## 6. Responsive behaviour summary

| Element | Mobile (<768) | Tablet (768–1024) | Desktop (≥1024) |
|---|---|---|---|
| Global nav | Hamburger | Hamburger | Full horizontal |
| Homepage hero | Single column, stacked CTAs | Single column | Single column, larger type |
| Service cards | Stacked, 1 col | 2 col | 3 col |
| Form | Single column, sticky bottom actions | Single column | Single column, 720 px container |
| Step indicator | Current step only + progress bar | Full horizontal | Full horizontal |
| Footer | Accordion sections | 2 col | 4 col |

**Touch:** minimum 44×44 px tap targets everywhere. Form field height 44 px on mobile, 48 px is acceptable on desktop but we can keep 44 for consistency.

---

## 7. Accessibility (WCAG 2.1 AA)

Mandatory for a service site used by contractors (who may have dirty hands + sunlight on screen) and by consumers of all ages.

- **Colour contrast:** every text/bg pair in this spec meets 4.5:1 (body) / 3:1 (large text and UI components). Never use `--color-primary-500` for body text on white.
- **Focus visible:** every interactive element gets `--shadow-focus` on keyboard focus; never remove outlines without replacement.
- **Form labels:** every input has a `<label>` associated via `for`/`id`. Placeholders are not a replacement for labels.
- **Error announcement:** validation errors use `aria-invalid` and are linked via `aria-describedby` to an error message with `role="alert"` (or via a live region that updates on submit).
- **Step indicator:** implement as `<ol>` with visually hidden text like "Stap 2 van 4, huidige stap: Graafmelding gegevens".
- **Skip link:** "Overslaan naar inhoud" at the top of the DOM, visible on focus.
- **Heading order:** one `<h1>` per page; no skipping from h1 to h3.
- **Language:** `<html lang="nl">`.
- **Motion:** honour `prefers-reduced-motion: reduce`.

---

## 8. Migration checklist

What to remove / replace during the build:

1. Double header (grey + blue bars) → single 72 px white header with bottom border
2. Sidebar "Direct aanvragen" block on every page → single primary CTA in header + contextual CTAs on content pages
3. Grey disclaimer box ("Graafmelding.nl BV is een zelfstandige organisatie...") on every page → once in footer + once on "Over klicmelding"
4. Stock photos (excavator, hand on mouse, pencil, keyboard, cables coil) → remove entirely in v1; if imagery is desired later, commission custom illustrations
5. 3D question-mark graphic on FAQ → remove
6. Justified body text → left-aligned everywhere
7. ALL-CAPS body copy (payment attentie, button labels) → sentence case
8. Solid blue pill bars on FAQ → accordion (§ 4.10)
9. Coloured (green) field borders on valid inputs → default border only
10. Red X icons inside form fields → remove; rely on labels + helper text
11. Fax field in the form → delete
12. Repeated instructional paragraphs across form steps → show once
13. Separate login box on homepage → move to global header as "Inloggen" ghost button
14. Bold italic "Bij 1 op de 10..." pullquote → blockquote component on "Over klicmelding"
15. No mobile layout → full responsive implementation

---

## 9. Open questions for Erwin

Before the developer starts, please confirm:

1. **Pricing display.** Do we show the price publicly on the Producten page (and during the form), or keep "prijsinformatie tonen" behind a button? Recommendation: show openly — hiding prices hurts conversion and trust for a professional service.
2. **Account flow for bedrijven.** The current site hands out passwords to companies; is this still the model, or do we move to self-service signup with email verification?
3. **Save & resume for forms.** Confirm we can wire this up; if not, drop it from v1 and keep the current "abandoned = lost" behaviour with clearer warning.
4. **Imagery.** Agreed to launch with no photography? If we later want a custom illustration, we'll commission separately.
5. **Dark mode.** Not included in this spec. Add later if requested.
6. **Analytics / cookie banner.** Not covered here — handle in compliance workstream.

---

## 10. What's in this delivery

- `klicmelding-design-spec.md` — this document
- `klicmelding-styleguide.html` — visual rendering of the tokens and components (open in any browser)
- `klicmelding-mockup-home.html` — redesigned homepage mockup
- `klicmelding-mockup-form.html` — redesigned form page mockup (Stap 1)

Hand all four to the front-end developer. The .md is the source of truth for decisions; the .html files are visual references for "what does this feel like".
