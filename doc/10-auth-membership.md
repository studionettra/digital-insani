# Authentication & Membership

## Purpose

Member accounts provide persistent access to products purchased by a
customer.

## Core concepts

Authentication identifies a user.

Entitlement authorizes access to a purchased product.

These are intentionally separate concepts.

## Member dashboard

Member can see: - purchased products; - current version; - available
updates; - download action; - profile/account information.

## Entitlement rules

A user may access a product only when: - entitlement belongs to the
authenticated user; - entitlement is active; - source order is
successfully paid; - product/version is available.

A product being public does not grant download access.

## Guest checkout

The business decision for guest checkout and automatic account creation
remains open.

The implementation must avoid creating an unusable account state.

Recommended design candidate: - collect customer email during
checkout; - after trusted payment confirmation, associate order to a
member; - send account setup/login instructions if needed.

Treat this as a proposal, not a final requirement.

## Email verification

Use standard Laravel email verification if member accounts require it.
Exact requirement is TBD.

## Password reset

Provide secure password reset flow.

## Authorization

Use middleware plus policies. Never authorize downloads merely because a
URL contains a product ID.

## Admin/member separation

Member accounts must not automatically gain admin access.

Admin authorization must be explicit.
