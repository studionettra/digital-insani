# Open Questions & Decisions Required

These points have intentionally been left open for now.

## Business

- What is the estimated monthly transaction volume for Xendit Merchant?
  **→ 10,000**
- What are the final product categories?
  **→ Customizable**
- What is the final refund policy?
  **→ Please draft this based on Xendit documentation**
- Will there be discounts/coupons?
  **→ Yes; a dedicated menu is needed to create coupon codes and set discount percentages**
- Will the product support multiple licenses?
  **→ The product is version-based, not license-based**

## Customer/account

- Will *guest checkout* be used, or is an account mandatory before payment?
  **→ Guest checkout is allowed, but phone number and email input are mandatory; if a customer registers using a registered email, their transaction history will automatically appear in their customer dashboard**
- Should an account be created automatically after successful payment?
  **→ Not necessarily**
- Is email verification mandatory?
  **→ Only during account registration**

## Fulfillment

- Will the download link be available immediately after *webhook* confirmation?
  **→ Yes**
- Will downloads be limited by the number of attempts?
  **→ Yes**
- Should the download link have an expiration time?
  **→ Yes, 24 hours**
- Can each version be downloaded separately?
  **→ Yes, separately**

## Updates

- Send emails to all buyers automatically?
- Only via the member area?
- Both?
  **→ Yes, both**

## Documents

- Generate PDF invoice/proof of payment?
  **→ Yes, and send via email**
- Can the order receipt be downloaded from the member area?
  **→ Yes**

## Content

- Final article taxonomy?
  **→ Author Contributions**
- Final product taxonomy?
  **→ Is this the same as product variations? If so, please include it**
- Who approves legal content?
  **→ Admin**

## Branding

- When will the specific `digital.insani.id` logo/brand be approved?
  **→ Create a management feature to change the logo and site title**
- Are there specific brand color values approved beyond the general guidelines?
  **→ None for now**

## Infrastructure

- Hostinger plan and confirmed SMTP sending limits?
  **→ Per Hostinger documentation**
- Confirmed Cloudflare configuration?
  **→ Per Hostinger documentation; to be set up later**
- Google Drive service account ownership and folder structure?
  **→ Yes, owned by the project owner**
- Data backup/retention policy?
  **→ Yes, backups included**

## Payments

- Final Xendit approval for the shared account?
  **→ No response from Xendit yet**
- Supported payment methods?
  **→ Per Xendit documentation**
- Current production costs/rates?
  **→ None yet**
- Confirmed webhook configuration approved by Xendit?
  **→ Not yet; still pending**

AI Agent must not silently answer these questions on behalf of the
business owner.
