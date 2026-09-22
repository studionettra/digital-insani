# Product File Delivery — Google Drive

## Storage decision

Product files are stored in Google Drive using an existing Google One
200GB capacity.

Google Drive is a storage backend, not the customer-facing download URL.

## Security rule

Never give customers permanent public Google Drive share links.

Do not use:

`drive.google.com/file/d/.../view`

as the fulfillment mechanism.

## Service account

Use a dedicated Google service account for Drive API integration.

Do not embed personal Google account credentials in the application.

## Recommended structure

``` text
/Products/{product-slug}/v1.0/file.zip
/Products/{product-slug}/v1.1/file.zip
```

The database stores the relevant Drive file identifier against
`product_versions`.

## Download flow

1.  User requests download.
2.  Laravel authenticates user.
3.  Laravel checks entitlement.
4.  Laravel selects authorized product/version.
5.  Laravel accesses Drive through service account/API.
6.  Laravel streams/proxies the file or generates a controlled access
    mechanism.
7.  Record download event.

The exact streaming implementation must consider Hostinger PHP
memory/time limits.

## Versioning

Every downloadable product version should have: - product relation; -
semantic/version label or agreed version string; - changelog; - Drive
file ID; - publication state; - publication timestamp.

## Future migration

If downloads/storage grow significantly, Cloudflare R2 may be considered
for selected high-volume products. This is not MVP scope.

## Failure handling

If Drive API fails: - do not expose internal credentials; - show a
user-friendly error; - log the failure; - allow retry; - optionally
alert admin.

## Credentials

Google service-account credentials must: - live outside public web root
where possible; - be loaded from environment/secure secret storage; -
never be committed to Git.
