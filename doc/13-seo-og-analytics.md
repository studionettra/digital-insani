# SEO, Open Graph & Analytics

## Social preview requirement

The primary traffic source is social media. Product links must produce
correct previews.

For product pages, HTML metadata should include dynamically generated: -
`og:title`; - `og:image`; - `og:description`.

Use product-specific values.

## No SSR

Do not introduce SSR solely for social preview.

Metadata is prepared in the root Blade view before Inertia renders.

## SEO articles

The article module is intended for long-term organic search.

Requirements: - SEO-friendly slug; - meta title; - meta description; -
sitemap; - indexable article pages; - appropriate canonical URL
strategy; - Open Graph metadata.

## Sitemap

Generate `sitemap.xml` for public indexable content.

Do not include: - admin; - member pages; - checkout/private URLs; -
draft articles/products.

## Analytics

Use Google Tag Manager as the wrapper.

GTM manages: - Google Analytics; - Facebook Pixel; - future tracking
channels.

Do not hardcode separate tracking scripts throughout React components.

## Consent

A simple cookie consent mechanism is required because tracking pixels
are used.

The implementation should ensure consent-sensitive tags do not fire
before required consent.

## Recommended ecommerce events

Track only events that can be implemented reliably: - product_view; -
begin_checkout; - purchase; - download.

The purchase event must be based on trusted backend payment state, not
merely a frontend redirect.

## Privacy

Analytics identifiers and tracking behavior must be documented in
Privacy Policy and aligned with applicable requirements.
