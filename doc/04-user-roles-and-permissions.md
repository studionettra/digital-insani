# User Roles & Permissions

## Roles

### Guest

Dapat: - melihat home; - melihat katalog; - melihat detail produk; -
membaca artikel; - membaca legal pages; - memulai checkout.

Tidak dapat: - mengakses member area; - mengunduh produk.

### Member

Dapat: - login/logout; - melihat profil; - melihat produk yang telah
dibeli; - mengakses download yang valid; - melihat update produk yang
dimiliki.

Member tidak boleh mengakses admin.

### Admin

Dapat: - mengakses `/admin`; - mengelola produk; - kategori; - versi
produk; - artikel; - user/member; - order; - site settings.

## Authorization rules

Gunakan Laravel authorization/policies untuk resource yang membutuhkan
pembatasan.

Member hanya boleh: - melihat entitlement miliknya sendiri; - mengakses
produk berdasarkan entitlement valid; - melihat update untuk produk yang
dimiliki.

Admin panel harus mempunyai guard/permission policy yang jelas. Jangan
mengandalkan hidden UI sebagai security mechanism.

## Account creation after checkout

Behavior detail untuk guest checkout → account/member masih perlu
diputuskan.

Recommended implementation decision candidate: - customer email menjadi
identity; - setelah payment sukses, sistem membuat/menautkan member; -
akses diberikan berdasarkan order paid.

Namun AI Agent tidak boleh menganggap detail ini final tanpa keputusan
proyek.
