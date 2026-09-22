# Email & Notifications

## Transactional emails

Potential emails: - order confirmation; - payment confirmation; -
download/access instructions; - product update notification; -
password/account setup.

## Hostinger constraint

Check the SMTP/email sending limits of the selected Hostinger plan
before production.

If volume becomes high, consider a transactional email provider such as
Resend, Mailgun, or SES.

## Payment email trigger

Payment-related email must be triggered from trusted backend state after
successful payment confirmation.

Do not send a “payment successful” email solely because a browser
reaches a success URL.

## Product update notification

Current decision is TBD:

Option A: - email all entitled members automatically.

Option B: - only show updates inside member area.

If automatic email is chosen, the implementation must consider
shared-hosting execution constraints.

## Queue constraint

No persistent queue worker is assumed.

If asynchronous delivery is needed, use a Hostinger-compatible strategy
such as scheduled processing/cron, or an external service.

Do not build a feature that silently depends on `queue:work` running
permanently.

## Email content

Keep transactional emails: - concise; - branded; - mobile friendly; -
explicit about the next action; - free from sensitive credentials.

## Delivery failure

Email failure should not roll back a confirmed payment or entitlement.

Record the notification status and allow retry.
