# Environment & Configuration

## Application

Required baseline configuration:

``` env
APP_NAME=
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://digital.insani.id
```

## Database

``` env
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

## Xendit

Use environment variables for: - API secret/key; - webhook verification
secret/token if applicable; - API/base configuration if required.

Never expose these to React/Vite client variables.

## Google Drive

Use environment variables or secure file configuration for: - Google
project/service-account configuration; - service account credentials; -
Drive root/folder identifiers.

Do not commit service-account JSON credentials.

## Mail

Configure SMTP or selected transactional provider through environment
variables.

## Analytics

Public measurement IDs may be exposed where required, but sensitive
credentials must not be bundled into client assets.

## Environment separation

Maintain separate: - local; - staging/test; - production

credentials and endpoints.

## Production safety

Before production: - ensure test Xendit credentials are not active; -
verify Google Drive target folders; - verify email sender; - verify
analytics property; - verify Cloudflare domain; - verify webhook
endpoint.
