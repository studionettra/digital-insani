<x-mail::message>
# Halo {{ $user->name }},

{!! nl2br(e($update->email_message)) !!}

<x-mail::panel>
**Produk:** {{ $update->product->title }}  
@if($update->version)
**Versi Terbaru:** {{ $update->version }}
@endif
</x-mail::panel>

### Changelog / Apa yang baru?
{!! \Illuminate\Support\Str::markdown($update->changelog) !!}

<x-mail::button :url="route('member.products.show', $update->product->slug)">
Akses Produk di Member Area
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
