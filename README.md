# ZZP Compliance

## Productie deployment-flow

De deployment-flow is zo ingericht dat database-migraties **altijd vóór de app-build** draaien:

1. `npm run migrate:deploy`
2. `npm run build` (via `npm run build:production` / `npm run vercel-build`)
3. Runtime start (`npm run start` of `npm run start:production`)

### Scripts

- `npm run migrate:deploy`: voert Prisma deploy-migraties uit met logging en env-checks.
- `npm run build:production`: draait eerst migraties, daarna `next build`.
- `npm run vercel-build`: entrypoint voor Vercel build; gebruikt `build:production`.
- `npm run start:production`: optionele runtime-flow die opnieuw migraties draait vóór `next start`.

## Vercel environment variables

Stel in Vercel Project Settings → Environment Variables minimaal in:

- `DATABASE_URL` (**verplicht**)

Afhankelijk van je Prisma setup mogelijk ook:

- `DIRECT_URL`
- `SHADOW_DATABASE_URL`
- `PRISMA_SCHEMA_PATH`
- `PRISMA_QUERY_ENGINE_LIBRARY`

De migratiescript-logging laat in Vercel zien:

- of verplichte vars ontbreken;
- welke optionele Prisma-vars gevonden zijn;
- of `prisma migrate deploy` slaagt of faalt.

## Releasevolgorde

Voor iedere release:

1. **Migratie**: deploy start met `npm run migrate:deploy`.
2. **Deploy app**: build/start wordt uitgevoerd na succesvolle migratie.
3. **Smoke test**: controleer na livegang direct `/dashboard`.
