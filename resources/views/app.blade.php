<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/asset/logo-digital-insani.png?v=2" type="image/png">
        <link rel="apple-touch-icon" href="/asset/logo-digital-insani.png?v=2">

        {{-- SEO Meta Tags & Open Graph --}}
        @isset($meta)
            <meta property="og:title" content="{{ $meta['title'] ?? config('app.name') }}">
            <meta property="og:description" content="{{ $meta['description'] ?? '' }}">
            <meta property="og:image" content="{{ isset($meta['image']) ? asset($meta['image']) : asset('/images/og-default.png') }}">
            <meta property="og:type" content="{{ $meta['type'] ?? 'website' }}">
            <meta property="og:url" content="{{ url()->current() }}">
            <meta name="twitter:card" content="summary_large_image">
        @endisset

        {{-- Google Tag Manager --}}
        @if(config('services.gtm.id'))
        <script>
            // Define dataLayer and the gtag function.
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent to 'denied'.
            gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied'
            });

            // Update consent if previously granted.
            if(localStorage.getItem('cookie_consent') === 'accepted') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted'
                });
            }
        </script>
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','{{ config('services.gtm.id') }}');</script>
        @endif
        {{-- End Google Tag Manager --}}

        @fonts

        {{-- Midtrans Snap --}}
        @if(config('services.midtrans.client_key'))
        <script src="{{ config('services.midtrans.is_production') ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js' }}" data-client-key="{{ config('services.midtrans.client_key') }}"></script>
        @endif

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Digital Insani') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        {{-- Google Tag Manager (noscript) --}}
        @if(config('services.gtm.id'))
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ config('services.gtm.id') }}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        @endif
        {{-- End Google Tag Manager (noscript) --}}
        
        <x-inertia::app />
    </body>
</html>
