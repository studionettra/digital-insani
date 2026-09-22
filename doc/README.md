# digital.insani.id — AI Agent Documentation

Dokumentasi teknis dan produk untuk membangun website penjualan produk
digital di `digital.insani.id`.

## Cara membaca

AI Agent **wajib membaca** dokumen berikut sebelum coding:

1.  `01-project-brief.md`
2.  `02-architecture.md`
3.  `03-scope-and-requirements.md`
4.  `04-user-roles-and-permissions.md`
5.  `05-functional-specification.md`
6.  `06-pages-and-routes.md`
7.  `07-database-and-erd.md`
8.  `08-payment-xendit.md`
9.  `09-file-delivery-google-drive.md`
10. `10-auth-membership.md`
11. `11-admin-filament.md`
12. `12-frontend-react-inertia.md`
13. `13-seo-og-analytics.md`
14. `14-email-and-notifications.md`
15. `15-security.md`
16. `16-testing-and-acceptance.md`
17. `17-deployment-hostinger.md`
18. `18-environment-and-configuration.md`
19. `19-development-roadmap.md`
20. `20-ai-agent-rules.md`
21. `21-design-system.md`
22. `22-open-questions.md`
23. `23-remaining-implementation-plan.md`

## Source of truth

Dokumen 01–02 dan dokumen konteks yang sudah diberikan merupakan sumber
keputusan proyek. Dokumen tambahan memperinci kebutuhan implementasi
tanpa mengubah keputusan inti.

Jika terdapat konflik: - keputusan bisnis terbaru dari pemilik proyek
mengalahkan dokumen lama; - keputusan keamanan mengalahkan
convenience; - constraint Hostinger harus dihormati; - hal yang belum
diputuskan **tidak boleh ditebak AI Agent** dan harus ditandai `TBD`.

## Status

Xendit masih dalam proses review untuk penggunaan akun yang sama dengan
`insani.id`. Development/staging boleh dilanjutkan, tetapi transaksi
nyata menunggu persetujuan Xendit.

## Prinsip arsitektur

- Satu project Laravel.
- Storefront: Laravel + Inertia.js + React + Tailwind CSS.
- Admin: Filament.
- Database: MySQL.
- Payment: Xendit.
- File produk: Google Drive melalui backend.
- Hosting: Hostinger shared hosting.
- CDN/DNS: Cloudflare.
- Tracking: GTM yang mengelola Google Analytics dan Facebook Pixel.
