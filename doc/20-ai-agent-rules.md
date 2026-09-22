# AI Agent Rules — digital.insani.id

## Mission

Build a production-ready digital product store while respecting the
documented business decisions and Hostinger shared-hosting constraints.

## Rule 1 — Read before coding

Read: - project brief; - architecture; - requirements; - Xendit; -
Google Drive; - design system; before changing architecture.

## Rule 2 — Do not invent business decisions

If a requirement is marked TBD, stop and ask the human when the decision
affects: - payment; - legal; - pricing; - refund; - customer identity; -
fulfillment; - data retention.

## Rule 3 — Backend is authoritative

Never trust: - frontend price; - frontend payment status; - frontend
entitlement; - hidden form fields for authorization.

## Rule 4 — Payment safety

Always: - use `DIGIPROD-` prefix; - validate webhook; - implement
idempotency; - match payment to order; - avoid duplicate fulfillment.

Never: - mark paid from browser redirect; - process `DONASI-`
transactions as digital-store orders.

## Rule 5 — File safety

Never give customers public Google Drive share links.

Downloads must pass through backend authorization.

## Rule 6 — Shared hosting

Never introduce a mandatory: - persistent Node server; - SSR server; -
queue worker; - websocket process

unless the hosting architecture is explicitly changed.

## Rule 7 — Build assets

Vite build happens locally/CI.

Production must receive built assets.

## Rule 8 — Security

Secrets remain server-side.

Use Laravel: - validation; - authorization; - CSRF; - policies; - secure
sessions; - rate limiting.

## Rule 9 — Design

Follow `06-design-system.md`.

Avoid: - generic AI-generated SaaS layouts; - excessive cards; -
unnecessary animation; - decorative patterns that reduce product
clarity.

Storefront should feel like a functional digital marketplace.

## Rule 10 — Change management

Before changing architecture: 1. identify the constraint; 2. explain why
the current architecture fails; 3. propose alternatives; 4. ask for
approval if the change affects core decisions.

## Rule 11 — Documentation

Every significant architectural or integration change must update the
relevant `.md` document.

## Rule 12 — Testing

Do not call a feature complete without testing: - happy path; -
unauthorized path; - failure path; - duplicate/retry path where
relevant.

## Rule 13 — Production gate

Real Xendit transactions must not be enabled until the account-sharing
review is approved.

## Rule 14 — Keep MVP focused

Do not add: - unnecessary packages; - speculative abstractions; -
unnecessary microservices; - unnecessary external infrastructure.

Prefer the simplest implementation compatible with the requirements.
