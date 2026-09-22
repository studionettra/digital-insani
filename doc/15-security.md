# Security Requirements

## General

Security is a first-class requirement because the application handles: -
customer accounts; - purchase records; - payment references; - private
product files; - third-party API credentials.

## Secrets

Never commit: - Xendit secret/API key; - Google service account
credentials; - SMTP passwords; - analytics secrets; - application key.

Use environment variables/secure deployment configuration.

## Payment security

- Verify webhook authenticity.
- Check `external_id` prefix.
- Match payment to internal order.
- Verify amount/currency where applicable.
- Process webhook idempotently.
- Never trust client-side payment status.

## Download security

- Require authorization.
- Check entitlement on every download.
- Never expose permanent public Drive links.
- Avoid predictable download authorization URLs.
- Log downloads.

## Web security

Use Laravel defaults: - CSRF protection; - request validation; -
authorization policies; - escaped output; - secure session cookies; -
rate limiting for sensitive endpoints.

## Admin

- Strong authentication.
- Explicit admin authorization.
- Protect `/admin`.
- Avoid exposing debug information in production.

## File upload

If product previews/screenshots are uploaded: - validate MIME/type and
size; - use safe generated filenames; - avoid executable file types; -
store outside executable paths where appropriate.

## Logging

Log operational events without leaking secrets.

Never log: - API keys; - passwords; - raw authentication tokens.

Payment payload logging must be reviewed for personal-data exposure.

## Privacy

Minimize personal data collection and retain only what is required
for: - order fulfillment; - account access; - legal/accounting needs; -
security/audit.

## Rate limiting

Apply rate limits to: - login; - password reset; - checkout creation; -
webhook if appropriate; - download endpoint; - other abuse-prone
endpoints.
