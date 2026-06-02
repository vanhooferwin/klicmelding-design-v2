# Klicmelding.nl V2

Redesign van klicmelding.nl. Deze repo bevat op dit moment de **statische
mockups** (HTML/CSS) en een **build-handoff** (`BUILD.md`) om ze om te zetten
naar een werkende site.

Live preview van de mockups: https://vanhooferwin.github.io/klicmelding-design-v2/

## Status

- ✅ Volledige set mockups (21 pagina's) in de huisstijl, onderling gelinkt.
- ✅ Gedeelde stijl/tokens in `klicmelding.css`.
- ⏳ Nog te bouwen: de echte applicatie (zie `BUILD.md`).

## Doelstack (de te bouwen app)

Next.js (App Router, TypeScript) · Tailwind CSS · PostgreSQL · Drizzle ORM ·
NextAuth/Auth.js · Mailjet (mail) · Rabobank OmniKassa (iDEAL). Hosting op een
eigen VPS. De klic-melding wordt handmatig door de back-office bij het Kadaster
ingediend — de app verzorgt intake, betaling, account en admin.

Volledige uitwerking (datamodel, routes, flows, env, deploy): zie **`BUILD.md`**.

## Mockups bekijken

Statische bestanden — geen build nodig. Open `index.html` rechtstreeks, of
serveer de map lokaal (aanrader, dan werkt o.a. de PDOK-postcodelookup):

```bash
# Python
python3 -m http.server 8000
# of Node
npx serve .
```
Daarna: http://localhost:8000

## De app bootstrappen (samenvatting uit BUILD.md)

> De onderstaande commando's gelden zodra het Next.js-project is opgezet.
> Aanbevolen om dit in Claude Code te doen met `BUILD.md` als uitgangspunt.

```bash
# 1. Next.js + Tailwind opzetten in deze map
npx create-next-app@latest . --ts --app --tailwind

# 2. Dependencies voor data/auth/mail/betalen
npm i drizzle-orm pg next-auth node-mailjet zod
npm i -D drizzle-kit @types/pg

# 3. Omgevingsvariabelen
cp .env.example .env   # vul je eigen waarden in (zie BUILD.md §10)

# 4. Database-migraties
npx drizzle-kit generate
npx drizzle-kit migrate

# 5. Lokaal draaien
npm run dev            # http://localhost:3000
```

## Scripts (verwacht, na opzet)

| Script | Doel |
|---|---|
| `npm run dev` | Development-server |
| `npm run build` / `npm start` | Productiebuild en -server |
| `npm run lint` | Linten |
| `npm run typecheck` | Types checken (`tsc --noEmit`) |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run db:generate` | Drizzle-migratie genereren (`drizzle-kit generate`) |
| `npm run db:migrate` | Migraties uitvoeren (`drizzle-kit migrate`) |

## Omgevingsvariabelen

Secrets staan **niet** in de repo. Maak lokaal/op de server een `.env` op basis
van `.env.example`. Benodigd: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`,
`MAILJET_API_KEY`/`MAILJET_API_SECRET`/`MAIL_FROM`,
`OMNIKASSA_BASE_URL`/`OMNIKASSA_REFRESH_TOKEN`/`OMNIKASSA_SIGNING_KEY`,
`PDOK_BASE_URL`. Toelichting per variabele in `BUILD.md` §10.

## Mappenstructuur (nu)

```
.
├── index.html                       # homepage (mockup)
├── klicmelding-mockup-*.html        # overige paginamockups
├── klicmelding.css                  # gedeelde stijl / design-tokens
├── BUILD.md                         # build-handoff (lees dit eerst)
└── README.md
```

## Deployment (Docker)

De site draait in een container. In de repo staan `Dockerfile` (Next.js
standalone, multi-stage, non-root) en `docker-compose.yml` (web + Postgres).

Vereiste: zet in `next.config`:
```js
const nextConfig = { output: 'standalone' };
```

Starten op de server:
```bash
cp .env.example .env            # vul AUTH_SECRET, POSTGRES_PASSWORD, Mailjet, OmniKassa in
docker compose up -d --build    # bouwt en start web + db
docker compose run --rm web npm run db:migrate   # migraties uitvoeren
docker compose logs -f web      # logs
```
Deployen gaat in productie via de **CI/CD-pipeline** (GitHub Actions): tests
(lint, types, unit en Playwright-E2E van alle formulieren/knoppen) moeten groen
zijn én een reviewer moet de `production`-omgeving goedkeuren vóór release. Zie
`BUILD.md` §13.

De app draait op poort 3000. Zet er een reverse proxy (Nginx/Caddy) met TLS
(Let's Encrypt) voor. Postgres-data staat in het named volume `pgdata` — plan
back-ups in. Details in `BUILD.md` §11.

## Licentie / eigendom

Klicmelding.nl en Graafmelding.nl zijn handelsnamen van Graafmelding.nl B.V.
(KvK Brabant 53.11.20.16). Intern project — niet voor herdistributie.
