# Klicmelding.nl V2 — Build handoff

Doel: de statische mockups in deze map omzetten naar een werkende site.
Bedoeld als startdocument voor Claude Code (open deze map als project).

## 1. Stack

| Laag | Keuze |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS (tokens uit `klicmelding.css`) |
| Database | PostgreSQL (self-hosted op VPS) |
| ORM / migraties | Drizzle ORM + drizzle-kit |
| Auth | NextAuth / Auth.js (Credentials, Drizzle-adapter) |
| Transactionele mail | Mailjet (`node-mailjet`) |
| Betalen (iDEAL) | Rabobank OmniKassa 2.0 |
| Hosting | Eigen server / VPS (Docker aanbevolen) |

Architectuurkeuze (bevestigd): de klic-melding wordt **handmatig** door de
back-office bij het Kadaster ingediend. De app is dus **intake + betaling +
account + admin-dashboard**, géén directe Kadaster/KLIC-API-koppeling.

## 2. Designsysteem (uit klicmelding.css → Tailwind)

Font: **Plus Jakarta Sans** (400–800), via `next/font/google`.

Kleuren (Tailwind `theme.extend.colors`):
```
primary: { 50:#EEF4FF, 100:#DBE7FE, 500:#3B82F6, 600:#2563EB, 700:#1D4ED8, 900:#1E3A8A }
ink:     { 50:#F8FAFC, 100:#F1F5F9, 200:#E2E8F0, 300:#CBD5E1, 500:#64748B, 700:#334155, 900:#0F172A }
success:#10B981 / 50:#ECFDF5   warning:#F59E0B / 50:#FFFBEB
error:#EF4444 / 50:#FEF2F2     info:#0EA5E9 / 50:#EFF9FD
brand = primary-600
```
Spacing-schaal (px): 1=4, 2=8, 3=12, 4=16, 5=24, 6=32, 7=48, 8=64, 9=96.
Radii: sm 4, md 8, lg 12, pill 9999. Schaduwen sm/md/lg zoals in `:root`.
Breakpoints in de mockups: nav/desktop ≥1024px; logo-tekst verborgen 768–1023px;
mobiele tweaks ≤767px.

Tip: neem de bestaande componenten 1-op-1 over als React-componenten:
`Header/Nav`, `MobileMenu`, `Footer` (met sitemap-link + Links), `Button`
(varianten primary/secondary/ghost/on-dark, maten sm/md/lg), `PageHead`,
`Alert`, `Accordion` (FAQ), `Stepper` (aanvraagflow).

## 3. Paginakaart (mockup → route)

| Mockup-bestand | Route | Type |
|---|---|---|
| index.html | `/` | publiek |
| klicmelding-mockup-over.html | `/over` | publiek |
| klicmelding-mockup-onze-dienst.html | `/onze-dienst` | publiek (incl. tarief €58,80) |
| klicmelding-mockup-faq.html | `/faq` | publiek |
| klicmelding-mockup-downloads.html | `/downloads` | publiek |
| klicmelding-mockup-links.html | `/links` | publiek (footer-only) |
| klicmelding-mockup-contact.html | `/contact` | publiek (form → Mailjet) |
| klicmelding-mockup-zoeken.html | `/zoeken` | publiek (site-search) |
| klicmelding-mockup-disclaimer.html | `/disclaimer` | publiek |
| klicmelding-mockup-voorwaarden.html | `/algemene-voorwaarden` | publiek |
| klicmelding-mockup-privacy.html | `/privacy` | publiek |
| klicmelding-mockup-sitemap.html | `/sitemap` | publiek |
| klicmelding-mockup-login.html | `/inloggen` | auth |
| klicmelding-mockup-wachtwoord-vergeten.html | `/wachtwoord-vergeten` | auth |
| klicmelding-mockup-account.html | `/account` | beschermd (zakelijk) |
| klicmelding-mockup-form-stap1..5.html | `/aanvragen` (wizard, 5 stappen) | publiek + optioneel ingelogd |
| klicmelding-mockup-bevestigd.html | `/aanvragen/bevestiging` | na betaling |

Footer is overal gelijk; "Links" en "Sitemap" staan alleen in de footer (niet in de hoofdnav). Het zoek-vergrootglas staat in de nav na "Downloads".

## 4. Datamodel (Drizzle — voorstel)

Afgeleid uit de formulierstappen.

- **companies** — `id, naam, kvk, email, telefoon, default_betaalwijze (ideal|factuur), created_at`
- **users** (Auth.js) — `id, email (uniek), password_hash, name, company_id (fk, nullable), role (klant|admin), created_at`
- Auth.js-adaptertabellen: **accounts, sessions, verification_tokens** (Drizzle adapter).
- **password_reset_tokens** — `id, user_id, token_hash, expires_at` (voor wachtwoord-vergeten).
- **aanvragen** (klicmeldingen) — kernobject:
  - `id, referentie (KM-YYYY-#####), type (particulier|zakelijk), status, user_id (nullable; particulier = gast)`
  - contact-snapshot: `bedrijfsnaam, naam, postcode, huisnummer, toevoeging, straat, plaats, telefoon, fax, email`
  - graaflocatie: `graaf_postcode, graaf_huisnummer, graaf_straat, graaf_plaats, polygoon (jsonb/GeoJSON, ≤500×500m)`
  - planning: `aanvangsdatum, einddatum_geschat`
  - `extra_info (text), voorwaarden_akkoord_at`
  - prijs: `bedrag_excl, btw, kadasterkosten, bedrag_incl` (default €58,80)
  - `created_at, updated_at`
- **aanvraag_werkzaamheden** — `aanvraag_id, werkzaamheid` (of `werkzaamheden text[]/jsonb` op aanvragen). Lijst staat in stap 3 (≈50 opties).
- **payments** — `id, aanvraag_id, provider ('omnikassa'), methode (ideal|factuur), status (open|betaald|mislukt|verlopen), bedrag, omnikassa_order_id, merchant_order_id, created_at, paid_at`
- **rapporten** — `id, aanvraag_id, bestand_url, verzonden_at` (pdf die back-office uploadt en mailt).

Aanvraag-statussen (voorstel): `concept → ontvangen (betaald of factuur) → in_behandeling → ingediend_kadaster → afgerond` (+ `geannuleerd`).

## 5. Auth (NextAuth / Auth.js)

- **Credentials provider** met `password_hash` (argon2/bcrypt) — alleen voor **zakelijke** klanten (komt overeen met "Aanmelden bedrijven").
- Particulieren loggen niet in: de aanvraagflow werkt als **gast-checkout**.
- Rollen: `klant` en `admin`. `/account` en `/admin/*` met middleware beschermen.
- Account ontstaat na 1e zakelijke aanvraag → activatiemail (wachtwoord instellen).
- Wachtwoord-vergeten: token → mail → reset-pagina (sluit aan op `/wachtwoord-vergeten`).
- Zet `AUTH_SECRET`, en bij Credentials een JWT-sessiestrategie.

## 6. Aanvraagflow (5 stappen)

Eén wizard-route met serverside opslag van een **concept-aanvraag** per stap
(of client-state + 1 submit). Stappen:

1. Klantgegevens — soort klant, (bedrijfsnaam), naam, adres, telefoon, fax, e-mail.
   **Adres-autofill via PDOK Locatieserver** (postcode+huisnummer → straat+plaats),
   bestaande logica zit al in `klicmelding-mockup-form-stap1.html` (inclusief
   toevoeging-matching). Werkt out-of-the-box over https.
2. Graafmelding — aanvangs-/einddatum, graaflocatie, polygoon (≤500×500m; oriëntatieverzoek ≤2500×2500m).
3. Werkzaamheden — multiselect uit de vaste lijst (zoekbaar).
4. Extra info — vrije tekst + akkoord algemene voorwaarden (verplicht).
5. Overzicht & betalen — prijsopbouw (€39,50 + €11,00 Kadaster = €50,50 excl., +21% btw over €39,50 = €58,80 incl.), keuze iDEAL of (alleen zakelijk) factuur.

Na succesvolle betaling → `/aanvragen/bevestiging` (referentienummer + "wat gebeurt er nu").

## 7. Betalen — Rabobank OmniKassa 2.0

- Server-to-server REST API; gebruik de **sandbox** tijdens ontwikkeling.
- Flow: aanvraag opslaan → `payments`-record (`open`) → OmniKassa **order
  aanmaken** (merchantOrderId = referentie, bedrag incl. btw, redirect-URL) →
  klant naar betaalpagina → terug op `/aanvragen/bevestiging`.
- Status **niet** alleen op de return vertrouwen: OmniKassa stuurt een
  webhook/notificatie; haal daarop de resultaten op en update `payments.status`
  + `aanvragen.status`. Verstuur pas daarna de bevestigingsmail.
- Verzoeken en notificaties zijn **HMAC-gesigneerd** (signing key) — valideer altijd.
- Voor **zakelijk + factuur**: sla op als `methode=factuur`, status `ontvangen`,
  en handel facturatie buiten OmniKassa af.
- Env: `OMNIKASSA_BASE_URL`, `OMNIKASSA_REFRESH_TOKEN`, `OMNIKASSA_SIGNING_KEY`.
- Status: sandbox-API-keys zijn beschikbaar — kan direct gekoppeld worden.

## 8. Mailjet (transactionele mail)

`node-mailjet` met API-key + secret. Gebruik templates of inline HTML in de huisstijl.
Triggers:
- **Aanvraagbevestiging** — na betaling/ontvangst (referentienummer + samenvatting).
- **Betaal-/factuurbevestiging** — zakelijk op factuur.
- **Account-activatie** — wachtwoord instellen na 1e zakelijke aanvraag.
- **Wachtwoord vergeten** — herstellink.
- **Rapport klaar** — back-office markeert `afgerond` en mailt de pdf/link.
- **Contactformulier** — bericht van `/contact` naar info@klicmelding.nl.

Let op (uit de mockups): de organisatie is **online-only, telefonisch niet
bereikbaar** — houd mailteksten consistent daarmee.

## 9. Back-office / admin (Kadaster handmatig)

Beschermde `/admin`-omgeving (role=admin):
- Lijst + detail van aanvragen, filter op status.
- Statusovergangen: ontvangen → in_behandeling → ingediend_kadaster → afgerond.
- Rapport-pdf uploaden per aanvraag (opgeslagen in **MinIO/S3**; DB bewaart de objectsleutel) → triggert "rapport klaar"-mail.
- Klant-/bedrijfsbeheer.

Het ingelogde-klant-dashboard (`/account`) toont recente aanvragen + status
(zie `klicmelding-mockup-account.html`).

## 10. Omgevingsvariabelen (.env)

```
DATABASE_URL=postgres://user:pass@host:5432/klicmelding
AUTH_SECRET=...
AUTH_URL=https://www.klicmelding.nl
MAILJET_API_KEY=...
MAILJET_API_SECRET=...
MAIL_FROM="Klicmelding.nl <info@klicmelding.nl>"
OMNIKASSA_BASE_URL=https://betalen.rabobank.nl/omnikassa-api/   # sandbox-URL tijdens dev
OMNIKASSA_REFRESH_TOKEN=...
OMNIKASSA_SIGNING_KEY=...
PDOK_BASE_URL=https://api.pdok.nl/bzk/locatieserver/search/v3_1
# Object-storage (rapporten) — MinIO / S3-compatible
S3_ENDPOINT=http://minio:9000
S3_REGION=eu-west-1
S3_BUCKET=klic-rapporten
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
# Optioneel: AI-assistent Klickie
ANTHROPIC_API_KEY=...
```
Geen secrets in de repo — `.env` lokaal/op de server, `.env.example` wel committen.

## 11. Deployment (Docker op eigen VPS)

De site draait in een container. Klaarstaande bestanden in de repo:
`Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`.

- **Next.js standalone**: zet `output: 'standalone'` in `next.config` (de Dockerfile kopieert `.next/standalone`).
- **Image**: multi-stage (`deps` → `builder` → `runner`) op `node:20-alpine`, draait als non-root user, exposeert poort 3000.
- **Compose**: service `web` (build) + service `db` (`postgres:16-alpine`, healthcheck, volume `pgdata`). `DATABASE_URL` wijst binnen het netwerk naar host `db`.
- **Migraties**: `docker compose run --rm web npm run db:migrate` na het opstarten (of via een entrypoint/init-container).
- **Reverse proxy**: Nginx/Caddy met TLS (Let's Encrypt) vóór de container.
- **Back-ups**: plan dumps van het `pgdata`-volume in.

```bash
cp .env.example .env
docker compose up -d --build
docker compose run --rm web npm run db:migrate
```

## 12. Suggested bouwvolgorde

1. Next.js + Tailwind + tokens; Header/Footer/Button-componenten; statische
   publieke pagina's overzetten (home, over, onze-dienst, faq, downloads, links,
   contact, juridisch, sitemap, zoeken).
2. Postgres + Drizzle-schema + migraties; `.env.example`.
3. Auth.js (credentials) + `/inloggen`, `/wachtwoord-vergeten`, beschermd `/account`.
4. Aanvraagwizard (stap 1–5) met concept-opslag; PDOK-autofill overnemen.
5. OmniKassa-koppeling + webhook + bevestigingspagina.
6. Mailjet-mails (bevestiging, reset, activatie, rapport, contact).
7. Admin/back-office.
8. Tests (Vitest + Playwright) en de CI/CD-pipeline opzetten (zie §13); hardening: validatie (zod), rate-limiting op formulieren, logging, back-ups.

## 13. Testen & CI/CD pipeline

Deployen verloopt via een pipeline (GitHub Actions). **Geautomatiseerde tests zijn
een harde poort: zonder groene tests geen productie-deploy.** Daarnaast staat
productie achter een handmatige goedkeuring.

Workflows in de repo:
- `.github/workflows/ci.yml` — op elke pull request: lint, typecheck, unit tests, **end-to-end tests (Playwright)** en een Docker-build-check.
- `.github/workflows/deploy.yml` — op `main`: dezelfde tests → image bouwen/pushen naar GHCR → **deploy naar productie**. De `deploy`-job heeft `needs: [build-push]` (die op zijn beurt `needs: [quality, e2e]`) en `environment: production`.

Productie-gate eenmalig instellen op GitHub:
- Repo → **Settings → Environments → `production`** → **Required reviewers** aanzetten. De deploy-stap pauzeert dan tot iemand goedkeurt.
- Branch protection op `main`: "Require status checks to pass" met de CI-checks.

Benodigde secrets (Settings → Secrets and variables → Actions):
`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` (SSH naar de VPS). `GITHUB_TOKEN` is standaard aanwezig (voor GHCR).

Tooling & scripts:
- **Vitest** (unit/integratie) en **Playwright** (E2E, desktop + mobiel).
- package.json: `lint`, `typecheck` (`tsc --noEmit`), `test` (vitest), `test:e2e` (playwright test), `db:migrate`.
- Config `playwright.config.ts` (start de app via `npm start`, baseURL :3000), voorbeeld `e2e/smoke.spec.ts`.

**Testmatrix — alle formulieren & knoppen moeten groen zijn vóór deploy:**

Formulieren:
- **Contact** — verplichte velden (naam, e-mail, bericht) + succesmelding.
- **Inloggen** — e-mail+wachtwoord, foutmelding bij leeg, doorverwijzing naar `/account`; link "wachtwoord vergeten".
- **Wachtwoord vergeten** — e-mail + verzenden.
- **Aanvraag stap 1** — verplichte velden, "Soort klant" toont/verbergt bedrijfsnaam, PDOK-autofill (postcode+huisnummer → straat/plaats).
- **Aanvraag stap 2** — datums (niet in het verleden), graaflocatie; Verder/Terug.
- **Aanvraag stap 3** — werkzaamheden zoeken + minstens één verplicht.
- **Aanvraag stap 4** — extra info + verplicht akkoord algemene voorwaarden.
- **Aanvraag stap 5** — betaalkeuze (iDEAL/factuur), "Betalen" → OmniKassa (sandbox) → `/aanvragen/bevestiging`.

Knoppen & navigatie:
- Hoofdnav-links + zoek-icoon (→ `/zoeken`); footer-links (Sitemap, Links, juridisch).
- Mobiel menu: hamburger open/dicht, "Klicmelding aanvragen" en "Inloggen".
- Alle "Klicmelding aanvragen"-CTA's → `/aanvragen`.
- Stepper: Verder/Terug door alle 5 stappen.
- Account: "Nieuwe aanvraag" en rij-acties (bekijken/rapport).

Dek beide Playwright-projects (desktop + mobiel) zodat ook het mobiele menu wordt getest. Gebruik toegankelijke selectors (labels/roles).

## 14. Beslist & open punten

Beslist:
- **Betalen**: Rabobank OmniKassa — sandbox-API-keys beschikbaar.
- **Rapport-opslag**: MinIO (S3-compatible); de DB bewaart alleen de objectsleutel/URL.
- **Site-search** (`/zoeken`): **Postgres full-text search** (`tsvector` + `websearch_to_tsquery`) over FAQ + paginacontent — geen extra dienst nodig. Alternatief voor puur statische content: FlexSearch of Pagefind (client-side).
- **Cookie-consent**: banner aanwezig in de mockups; laad analytische cookies (Google Analytics) pas ná toestemming.
- **Telefoontekst** in stap 1 verwijderd (past bij de online-only positionering).

Nog open:
- Velden **KvK/btw verplicht voor zakelijk?** — navragen bij de klant (de voorwaarden noemen KvK).

## 15. Optioneel: AI-assistent "Klickie"

Een chat-widget die vragen over klicmeldingen en de werkwijze beantwoordt. Goed
haalbaar als **RAG** (retrieval-augmented generation):

1. **Kennisbron**: de eigen content (FAQ, Over, Onze dienst, werkwijze, voorwaarden).
2. **Index**: embeddings in **pgvector** (extensie op de bestaande Postgres) — geen extra database nodig.
3. **Chat-endpoint**: Next.js-route die de vraag embedt, relevante stukken ophaalt en aan een LLM (bijv. Claude) geeft met die context; antwoord streamen.
4. **Widget**: klein chatvenster ("Klickie") rechtsonder op de site.

Aandachtspunten: guardrails (alleen antwoorden op basis van eigen content, nette
doorverwijzing naar e-mail bij twijfel, niet gokken over juridische/Kadaster-zaken),
kosten per vraag (LLM-tokens) en AVG (vermeld de AI-verwerking in het privacybeleid).
Env: `ANTHROPIC_API_KEY`. Effort: middel.
