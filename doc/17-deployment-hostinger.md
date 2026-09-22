# Deployment — Hostinger Shared Hosting

## Target

Production domain:

`digital.insani.id`

## Deployment model

Use Git deployment through Hostinger/hPanel where practical.

Composer installation may be performed through the hosting deployment
mechanism.

## Build process

Because persistent Node.js is unavailable:

1.  Develop locally.
2.  Run frontend build locally or in CI.
3.  Ensure `public/build/` is included in deployment.
4.  Deploy PHP application and built assets.
5.  Configure environment.
6.  Run required Laravel deployment commands supported by hosting.

Do not require `npm run dev` on production.

## Laravel production checklist

- `APP_ENV=production`
- `APP_DEBUG=false`
- correct `APP_URL`
- secure `APP_KEY`
- production DB credentials
- cache/config optimization as appropriate
- storage permissions verified
- public asset path verified

## Cron

Configure Hostinger Cron Jobs to run Laravel scheduler:

``` text
php artisan schedule:run
```

Run every minute if the scheduler configuration requires it.

## Queue

Do not assume a persistent queue worker.

Any scheduled asynchronous work must be compatible with cron/shared
hosting.

## Webhook

The Xendit webhook must be reachable over HTTPS.

Do not protect the webhook with normal member authentication.

Use Xendit-specific webhook verification and application-level routing.

## Cloudflare

Verify: - DNS points to Hostinger; - SSL mode is appropriate; - HTTPS
works; - no caching rule breaks dynamic authenticated routes; - webhook
route is not incorrectly cached.

## Backup

Maintain: - database backup; - source code repository; - environment
secret backup in secure storage; - Google Drive remains the product-file
source.

## Rollback

Deployment should allow rollback of application code without deleting
customer/order data.

Database migrations must be backward-aware where practical.
