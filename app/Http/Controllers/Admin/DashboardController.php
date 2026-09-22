<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('status', 'paid')->sum('total_amount') ?? 0;
        $totalOrders = Order::where('status', 'paid')->count();
        $totalMembers = User::where('role', 'member')->count();

        // Recent orders
        $recentOrders = Order::with('user')->latest()->limit(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'revenue' => $totalRevenue,
                'orders' => $totalOrders,
                'members' => $totalMembers,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
