# Architecture — digital.insani.id

## Stack

| Area            | Teknologi                                              |
|-----------------|--------------------------------------------------------|
| Storefront      | Laravel + Inertia.js + React + Tailwind CSS            |
| Admin           | Filament                                               |
| Database        | MySQL                                                  |
| Payment         | Xendit                                                 |
| Product storage | Google Drive via Drive API                             |
| CDN/DNS         | Cloudflare                                             |
| Analytics       | Google Tag Manager + Google Analytics + Facebook Pixel |
| Hosting         | Hostinger shared hosting                               |

## Application topology

Satu aplikasi Laravel:

- public storefront → route Inertia;
- member area → route Inertia + `auth`;
- admin → Filament pada `/admin`;
- semua area memakai model Eloquent/database yang sama.

## SPA behavior

Storefront menggunakan pola SPA melalui Inertia + React. Tidak berarti
seluruh aplikasi harus menjadi satu JavaScript bundle tanpa server
routes. Laravel tetap menjadi backend dan router utama, sedangkan
Inertia menghindari full page reload pada navigasi aplikasi.

## SSR

SSR tidak menjadi requirement karena traffic utama berasal dari social
media dan hosting tidak menyediakan Node.js persisten.

Open Graph tetap harus tersedia pada HTML awal melalui root Blade view
Inertia agar scraper social media menerima metadata produk yang benar.

## Hostinger constraints

- Tidak ada Node.js persistent process.
- Tidak menjalankan Inertia SSR.
- Vite build dilakukan lokal/CI.
- `public/build/` harus ikut deployment.
- Composer dapat dijalankan melalui Git deployment Hostinger.
- Laravel scheduler dijalankan melalui Cron Jobs.
- Jangan bergantung pada persistent queue worker.
- Webhook pembayaran diproses synchronous di controller/service.
- Email perlu memperhatikan limit SMTP Hostinger.

## Architectural rules

Backend tetap authoritative untuk: - harga; - status order; - status
pembayaran; - entitlement/member access; - validasi download; - file ID
Google Drive.

Frontend tidak boleh dipercaya untuk menentukan bahwa transaksi telah
dibayar.
