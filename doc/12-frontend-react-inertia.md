# Frontend — React + Inertia + Tailwind

## Architecture

React is the storefront UI layer.

Inertia is the bridge between Laravel routes/controllers and React
pages.

Laravel remains responsible for: - routing; - authorization; -
validation; - business logic; - database; - integrations.

## Page structure

Recommended conceptual structure:

``` text
resources/js/
  Components/
  Layouts/
  Pages/
    Home/
    Products/
    Checkout/
    Articles/
    Auth/
    Member/
```

Exact folder naming may vary.

## Component principles

Prefer: - reusable primitives; - product card; - price display; -
category filter; - form fields; - alert/notice; - modal/dialog; -
pagination; - empty states.

Do not create abstraction solely for abstraction’s sake.

## State

Server-owned business state should remain on Laravel.

Client state is appropriate for: - UI toggles; - filters before
submit; - temporary form state; - presentation state.

Do not maintain a second authoritative copy of order/payment status in
React.

## Forms

Use Inertia form patterns or an equivalent consistent approach.

Validation errors should originate from Laravel and be displayed
clearly.

## UX

Important states: - loading; - validation error; - empty catalog; -
payment pending; - payment failed; - payment success; - download
unavailable; - Drive service error.

## SPA navigation

Avoid full-page navigation for normal internal storefront transitions
where Inertia can handle the visit.

External Xendit hosted payment navigation is expected.

## Responsive design

Mobile-first because social-media traffic commonly lands on mobile
devices.

## Accessibility

At minimum: - semantic HTML; - keyboard-accessible controls; - visible
focus; - meaningful labels; - alt text for product images; - adequate
contrast.
