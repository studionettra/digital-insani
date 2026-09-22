# Database & ERD

## Core entities

### users

Laravel authentication user.

Suggested fields: - id - name - email - password - role or authorization
relation - email_verified_at - timestamps

### categories

- id
- name
- slug
- description
- is_active
- timestamps

### products

- id
- category_id
- name
- slug
- short_description
- description
- price
- status
- is_featured
- thumbnail/preview reference
- timestamps

### product_versions

- id
- product_id
- version
- changelog
- drive_file_id
- drive_file_name
- is_current
- published_at
- timestamps

### orders

- id
- user_id nullable for guest flow
- customer_name
- customer_email
- subtotal
- total
- currency
- status
- external_id
- xendit_invoice_id nullable
- payment metadata fields as appropriate
- paid_at
- timestamps

### order_items

- id
- order_id
- product_id
- product_name_snapshot
- unit_price
- quantity
- subtotal
- timestamps

For digital products MVP, quantity will normally be `1`, but the schema
can preserve extensibility.

### entitlements

Represents purchased access: - id - user_id - product_id - order_id -
granted_at - revoked_at nullable - timestamps

Unique constraint should prevent duplicate entitlement for the same
user/product unless business rules require multiple licenses.

### downloads

Audit log: - id - entitlement_id - product_version_id - user_id -
downloaded_at - metadata as needed

### articles

- id
- title
- slug
- excerpt
- content
- meta_title
- meta_description
- status
- published_at
- timestamps

### site_settings

Key/value or structured settings: - site name; - logo; - contact; -
social links; - other approved settings.

### payment_webhook_events

Recommended for idempotency/audit: - id - provider - event/reference
identifier - external_id - payload JSON - processed_at - status -
timestamps

## Relationships

``` text
Category 1 ─── N Product
Product 1 ─── N ProductVersion
User 1 ─── N Order
Order 1 ─── N OrderItem
Product 1 ─── N OrderItem
User 1 ─── N Entitlement
Product 1 ─── N Entitlement
Order 1 ─── N Entitlement
Entitlement 1 ─── N Download
ProductVersion 1 ─── N Download
```

## Database rules

- Money must use integer minor units or a consistent decimal strategy.
- Add indexes for slug, status, external_id, email, and foreign keys.
- Add unique constraints where business identity requires uniqueness.
- Never store plaintext API secrets.
- Payment webhook payload can be stored securely for audit, subject to
  privacy/data-retention policy.

## Important

This is a baseline logical model, not a final migration specification.
Any field not required by current business requirements should remain
minimal.
