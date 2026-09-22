# Pages & Routes

Route final dapat berubah mengikuti implementasi Laravel, tetapi
struktur berikut menjadi baseline.

## Public

| Route               | Page            |
|---------------------|-----------------|
| `/`                 | Home            |
| `/products`         | Catalog         |
| `/products/{slug}`  | Product detail  |
| `/checkout/{order}` | Checkout/status |
| `/articles`         | Article index   |
| `/articles/{slug}`  | Article detail  |
| `/refund-policy`    | Refund Policy   |
| `/terms`            | Terms           |
| `/privacy-policy`   | Privacy Policy  |

## Auth

| Route              | Page           |
|--------------------|----------------|
| `/login`           | Login          |
| `/register`        | Register       |
| `/forgot-password` | Password reset |

Exact auth implementation is subject to Laravel/Inertia auth choice.

## Member

| Route                                 | Page               |
|---------------------------------------|--------------------|
| `/member`                             | Dashboard          |
| `/member/products`                    | Purchased products |
| `/member/products/{product}`          | Product access     |
| `/member/products/{product}/download` | Secure download    |
| `/member/updates`                     | Product updates    |
| `/member/profile`                     | Profile            |

## Admin

Filament panel: - `/admin`

Resources should cover: - Products; - Categories; - Product Versions; -
Orders; - Users; - Articles; - Site Settings.

## Integration endpoint

A dedicated webhook endpoint must exist for Xendit. Exact URL and HTTP
method should follow the selected Xendit integration implementation.

## Route principles

- Use named routes.
- Use slugs for public content.
- Use policies/middleware for protected resources.
- Never expose sensitive storage identifiers unnecessarily.
