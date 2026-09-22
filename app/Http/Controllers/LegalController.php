<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function refundPolicy(): Response
    {
        $meta = [
            'title' => 'Kebijakan Pengembalian Dana - '.config('app.name'),
            'description' => 'Kebijakan pengembalian dana untuk produk digital di '.config('app.name'),
        ];

        return Inertia::render('Legal/RefundPolicy')
            ->withViewData(['meta' => $meta]);
    }

    public function terms(): Response
    {
        $meta = [
            'title' => 'Syarat & Ketentuan - '.config('app.name'),
            'description' => 'Syarat dan ketentuan pembelian serta lisensi produk digital di '.config('app.name'),
        ];

        return Inertia::render('Legal/Terms')
            ->withViewData(['meta' => $meta]);
    }

    public function privacyPolicy(): Response
    {
        $meta = [
            'title' => 'Kebijakan Privasi - '.config('app.name'),
            'description' => 'Kebijakan privasi dan perlindungan data pelanggan di '.config('app.name'),
        ];

        return Inertia::render('Legal/PrivacyPolicy')
            ->withViewData(['meta' => $meta]);
    }
}
