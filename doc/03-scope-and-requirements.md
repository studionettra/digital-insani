# Scope & Requirements

## MVP scope

### Storefront

- Home.
- Katalog produk.
- Filter kategori.
- Detail produk.
- Checkout.
- Halaman status pembayaran.
- Login/register.
- Member dashboard.
- Purchased products.
- Download.
- Product updates.
- Legal pages.

### Admin

- Product CRUD.
- Category management.
- Product version management.
- User/member management.
- Order/payment monitoring.
- Article SEO CRUD.
- Site settings.
- Basic dashboard.

### Integrations

- Xendit.
- Google Drive API.
- Cloudflare.
- Google Tag Manager.
- Google Analytics.
- Facebook Pixel.
- Transactional email.

## Out of scope MVP

- Physical product fulfillment.
- Multi-vendor marketplace.
- Partner/merchant settlement.
- xenPlatform/sub-account.
- Subscription billing, kecuali nanti ditambahkan sebagai requirement
  baru.
- Video-course delivery skala besar.
- Persistent queue worker.
- Full SSR.

## Functional requirements

### Product

Produk harus mempunyai identitas unik, slug, harga, deskripsi, kategori,
status publikasi, preview/screenshot, dan hubungan ke versi/file.

### Order

Order harus mempunyai customer, item, nominal, status, external ID
Xendit, payment metadata, timestamps, dan audit status.

### Entitlement

Akses produk hanya diberikan jika order yang relevan telah terverifikasi
paid.

### Versioning

Setiap produk dapat memiliki banyak versi. Versi memiliki nomor versi,
changelog, file Google Drive, dan status publikasi.

### Articles

Artikel memiliki slug SEO-friendly, content, meta title, meta
description, publication state, dan timestamps.

## Non-functional requirements

- Secure by default.
- Mobile responsive.
- Accessible basic UI.
- Idempotent payment webhook.
- No public permanent product download link.
- Centralized design tokens.
- Deployable to shared hosting.
