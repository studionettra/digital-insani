<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the member dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        $stats = [
            'total_orders' => $user->orders()->count(),
            'total_products' => $user->entitlements()->active()->count(),
            'latest_order' => $user->orders()->latest()->first(),
        ];

        $recentOrders = $user->orders()->with(['items.product', 'items.productVariation'])->latest()->take(5)->get();
        $recentEntitlements = $user->entitlements()->with(['product', 'productVariation'])->active()->latest()->take(5)->get();

        return Inertia::render('Member/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentEntitlements' => $recentEntitlements,
        ]);
    }
}
