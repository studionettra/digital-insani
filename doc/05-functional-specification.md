# Functional Specification

## Product lifecycle

`draft → published → archived`

Produk draft tidak tampil di storefront.

Produk published dapat dibeli.

Produk archived tidak boleh menerima pembelian baru, tetapi entitlement
pembeli lama tetap dipertahankan kecuali kebijakan bisnis menentukan
lain.

## Product catalog

Catalog: - pagination; - category filter; - search bila dibutuhkan; -
sorting yang deterministic; - hanya menampilkan published products.

## Product detail

Menampilkan: - name; - price; - category; - description; -
preview/screenshot; - version information bila relevan; - CTA
pembelian; - informasi fulfillment digital; - informasi refund/legal
sebelum checkout.

## Checkout

Alur: 1. Customer memilih produk. 2. Backend membuat order pending. 3.
Backend membuat Invoice/Payment Link Xendit. 4. External ID memakai
prefix `DIGIPROD-`. 5. Customer diarahkan ke hosted Xendit. 6. Xendit
mengirim webhook. 7. Backend memvalidasi webhook. 8. Order berubah
menjadi paid. 9. Entitlement dibuat/diaktifkan. 10. Customer menerima
akses melalui member area dan mekanisme email yang telah disetujui.

## Payment status

Minimal internal state: - pending; - paid; - failed/expired; -
cancelled; - refunded bila kebutuhan refund diimplementasikan.

Status final harus mengikuti response/webhook Xendit yang digunakan.

## Download

Download request: 1. user harus authenticated bila member area
mewajibkan login; 2. server memeriksa entitlement; 3. server mencari
file/version yang terkait; 4. server mengambil/menyalurkan file melalui
mekanisme backend; 5. jangan expose permanent public Drive share link.

## Product updates

Ketika versi baru dipublish: - sistem mencatat version; - member yang
memiliki produk dapat melihat update; - email notification behavior
masih TBD.

## Legal

Refund Policy, Terms of Service, dan Privacy Policy harus terlihat
sebelum checkout, bukan hanya di footer.

## Tracking

GTM menjadi wrapper untuk Google Analytics dan Facebook Pixel.

Consent harus dipertimbangkan sebelum tracking non-essential dijalankan.
