# YAIdigitals Evolution API runbook

The website integration targets the official Evolution API stable release **2.3.7**, tag commit `cd800f2976e1e5b682fbf86a01ee4d85ae61f370`. It uses the v2.3.7 contract `POST /message/sendText/{instance}` with the `apikey` header and `{ "number", "text", "linkPreview" }` body. Evolution runs as a separate private service; it is not bundled into Next.js.

## Production architecture

Use the pinned [Compose example](./evolution-api-v2.3.7.compose.yml) on a dedicated host with PostgreSQL, Redis and persistent volumes. The API binds to loopback only. Put an HTTPS reverse proxy in front of the API, allow requests only from the YAIdigitals server/egress where practical, require a strong `AUTHENTICATION_API_KEY`, add upstream rate limiting, and do not publish Evolution Manager.

Create a separate `.env` beside the Compose file using Evolution's official v2.3.7 `env.example`. At minimum configure:

```env
SERVER_URL=https://evolution.example.com
AUTHENTICATION_API_KEY=<long-random-secret>
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://user:password@evolution-postgres:5432/evolution
CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://evolution-redis:6379/0
POSTGRES_DATABASE=evolution
POSTGRES_USERNAME=evolution
POSTGRES_PASSWORD=<long-random-secret>
```

Start and inspect without exposing secret values:

```bash
docker compose -f evolution-api-v2.3.7.compose.yml up -d
docker compose -f evolution-api-v2.3.7.compose.yml ps
docker logs --tail 100 evolution_api
```

Back up the PostgreSQL volume and the `evolution_instances` volume. Never commit the separate Evolution `.env`, database, Redis data, instance session or QR output.

## Create and connect the dedicated instance

Do this manually from a secured administrator workstation. The application never creates, rotates or deletes an instance.

```bash
curl --request POST 'https://evolution.example.com/instance/create' \
  --header 'Content-Type: application/json' \
  --header 'apikey: <EVOLUTION_GLOBAL_API_KEY>' \
  --data '{"instanceName":"yaidigitals","integration":"WHATSAPP-BAILEYS","qrcode":true}'
```

Treat the returned token and QR data as secrets. Display the QR only to the authorised operator and scan it from WhatsApp **Linked devices** on the correct account. Do not save the QR in tickets, source control or logs.

If a fresh QR is needed, call the v2.3.7 connection endpoint from the same secured workstation:

```bash
curl --header 'apikey: <EVOLUTION_API_KEY>' \
  'https://evolution.example.com/instance/connect/yaidigitals'
```

Check connection state:

```bash
curl --header 'apikey: <EVOLUTION_API_KEY>' \
  'https://evolution.example.com/instance/connectionState/yaidigitals'
```

The website's protected `GET /api/internal/evolution-health` endpoint performs the same state check and reports only configuration/reachability/connection booleans plus the last successful notification time. Call it with `Authorization: Bearer <CRON_SECRET>`.

## Website configuration

Set these server-side variables in the YAIdigitals deployment:

```env
EVOLUTION_API_URL=https://evolution.example.com
EVOLUTION_API_KEY=<instance-or-global-api-key>
EVOLUTION_INSTANCE_NAME=yaidigitals
YAIDIGITALS_NOTIFICATION_WHATSAPP=916006107923
RATE_LIMIT_SECRET=<independent-random-secret>
LEAD_DEDUPE_SECRET=<independent-random-secret>
CRON_SECRET=<independent-random-secret>
```

`EVOLUTION_API_KEY`, Supabase service role, and the three application secrets are server-only. Never prefix them with `NEXT_PUBLIC_`.

## Delivery, retries and authorised testing

A lead is validated, spam-checked and saved before delivery is attempted. Its database row is also the durable notification job. An atomic database claim keyed by lead ID prevents concurrent sends. Retryable provider/network failures are scheduled at 5, 30 and 120 minutes, up to four total attempts; permanent authentication/validation failures use `permanently_failed` for operator action. Vercel calls the protected retry route every 15 minutes.

Automated tests mock Evolution and never send a message. After the instance is connected, an operator may authorise one controlled test by creating a non-production lead against a staging database or by calling Evolution directly:

```bash
curl --request POST 'https://evolution.example.com/message/sendText/yaidigitals' \
  --header 'Content-Type: application/json' \
  --header 'apikey: <EVOLUTION_API_KEY>' \
  --data '{"number":"916006107923","text":"Authorised YAIdigitals Evolution API connection test","linkPreview":false}'
```

Do not run that command without explicit authorisation. If the WhatsApp session expires, check the instance state, request a new QR through `/instance/connect/yaidigitals`, scan it from Linked devices, and verify state again before re-enabling retries.
