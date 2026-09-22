# Testing & Acceptance Criteria

## Automated tests

Minimum backend coverage should include:

### Product

- published product visible;
- draft product hidden;
- category filtering;
- slug resolution.

### Orders

- order created with correct total;
- product price snapshot preserved;
- duplicate checkout does not corrupt existing order.

### Payment

- valid webhook marks order paid;
- unrelated `DONASI-` event is ignored;
- invalid webhook is rejected;
- repeated webhook is idempotent;
- paid order cannot regress to pending.

### Entitlement

- entitlement created once;
- only entitled user can access product;
- non-entitled user gets forbidden/not found behavior.

### Downloads

- authorized download succeeds;
- unauthorized download fails;
- download event recorded;
- Drive API failure handled gracefully.

### Versioning

- new version visible to entitled member;
- current version correctly identified;
- changelog shown.

### Admin

- non-admin cannot access admin;
- product CRUD works;
- version mapping works.

## Manual acceptance tests

### Checkout

1.  Open product.
2.  Click buy.
3.  Confirm order details.
4.  Proceed to Xendit.
5.  Complete test payment.
6.  Confirm webhook.
7.  Confirm order becomes paid.
8.  Confirm member access.
9.  Confirm download.

### Social sharing

Share a product URL and verify: - title; - description; - image; - URL.

### Mobile

Test storefront on: - mobile viewport; - tablet; - desktop.

## Production acceptance

Before go-live: - Xendit approval received; - production credentials
configured; - webhook URL configured correctly; - Cloudflare DNS/SSL
active; - Drive service account tested; - email sending tested; -
backups verified; - debug disabled; - legal pages published; -
consent/tracking tested.

## Definition of Done

A feature is not done when it only works visually.

It is done when: - backend authorization exists; - validation exists; -
failure state exists; - relevant tests exist; - mobile behavior is
acceptable; - security constraints are respected; - deployment behavior
is verified.
