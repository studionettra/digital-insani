# Payment Integration — Midtrans

## Overview

`digital.insani.id` uses Midtrans as the payment gateway. The integration
supports both **Snap popup** and **redirect** payment modes.

## Configuration

Environment variables required:

```
MIDTRANS_MERCHANT_ID=your_merchant_id
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

Configuration is stored in `config/services.php` under the `midtrans` key.

## External ID strategy

Use a unique `external_id` prefix to identify orders:

- Digital store orders: `DIGIPROD-{order_id}-{timestamp}`

The webhook handler rejects events that do not have the `DIGIPROD-` prefix.

## Payment flow

1.  Customer selects product(s) and adds to cart.
2.  Customer clicks checkout.
3.  Laravel creates a pending order with order items.
4.  Laravel calls Midtrans Snap API via `MidtransService::createTransaction()`.
5.  Snap returns `snap_token` and `redirect_url`.
6.  Depending on `midtrans_ui_mode` site setting:
    - **redirect**: Customer is redirected to Midtrans hosted payment page.
    - **snap**: Customer stays on the status page where Snap popup is triggered.
7.  Customer completes payment on Midtrans.
8.  Midtrans sends webhook notification to `/webhook/midtrans`.
9.  `MidtransWebhookController` processes the notification:
    - Validates required fields.
    - Verifies `DIGIPROD-` prefix.
    - Verifies SHA-512 signature.
    - Logs event to `payment_webhook_events` table.
    - Updates order status based on `transaction_status`.
    - On `settlement` or `capture` with accepted fraud: marks order as paid.
    - Grants entitlements via `EntitlementService`.
    - Sends confirmation email with invoice PDF.
10. Customer sees payment status on the checkout status page.

## Idempotency

Webhook processing is safe when the same event is delivered more than once:

- Orders already in `paid` status are skipped.
- Entitlements use `updateOrCreate` to prevent duplicates.
- Email sending failures are caught and logged, not re-thrown.

## Security

- Midtrans credentials are stored in environment variables.
- Credentials are never exposed to the frontend (only `client_key` via Snap JS).
- Webhook authenticity is verified using SHA-512 signature:
  `hash('sha512', order_id + status_code + gross_amount + server_key)`
- Never trust frontend payment success — order status is only updated via webhook.
- CSRF is disabled for the webhook endpoint in `bootstrap/app.php`.

## Webhook endpoint

```
POST /webhook/midtrans
```

This route is excluded from CSRF verification in `bootstrap/app.php`.

## Pricing

Confirm current Midtrans rates and product category pricing before production
launch. Sandbox rates differ from production.

## Testing

- Use Midtrans Sandbox credentials for development and staging.
- Test all payment statuses: `settlement`, `pending`, `deny`, `expire`, `cancel`.
- Test credit card with `capture` + `fraud_status` scenarios.
- Verify entitlements are granted only once (idempotency).
- Verify email + invoice PDF is sent on successful payment.
