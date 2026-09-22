<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->with('user');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load([
            'user',
            'items.product',
            'items.productVariation',
            'webhookEvents' => function ($query) {
                $query->latest();
            },
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }
}
