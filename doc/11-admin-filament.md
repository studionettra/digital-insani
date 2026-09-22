# Admin Panel — Filament

## Panel

Admin panel lives at:

`/admin`

## Resources

### Products

CRUD: - name; - slug; - description; - price; - category; - status; -
featured flag; - preview/screenshot.

### Categories

CRUD: - name; - slug; - description; - active status.

### Product Versions

Manage: - version; - changelog; - Drive file ID; - publication status; -
current version.

### Orders

Read/monitor: - order ID; - customer; - amount; - status; - external
ID; - payment reference; - timestamps.

Manual payment status modification should be restricted and audited.

### Users

Manage: - member profile; - account state; - roles/permissions.

### Articles

CRUD: - title; - slug; - content; - meta title; - meta description; -
publication state.

### Site Settings

Manage: - site name; - logo; - contact information; - approved social
links; - other global configuration.

## Dashboard

Useful MVP widgets: - total orders; - paid orders; - revenue; -
products; - recent orders; - recent product updates.

Avoid unnecessary dashboards before operational requirements are known.

## Design

Use Insani blue as Filament primary color.

Do not over-customize admin UI. Storefront design is the higher
priority.

## Safety

Admin actions that affect: - price; - product publication; - payment
state; - file mapping; - user permissions

should be explicit and preferably auditable.
