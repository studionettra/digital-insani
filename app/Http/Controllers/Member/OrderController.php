<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the member's orders.
     */
    public function index()
    {
        $orders = Auth::user()->orders()
            ->with('items.product')
            ->latest()
            ->get();

        return Inertia::render('Member/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $order = Auth::user()->orders()
            ->with(['items.product', 'user'])
            ->findOrFail($id);

        return Inertia::render('Member/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Download the invoice for the specified order.
     */
    public function downloadInvoice($id)
    {
        $order = Auth::user()->orders()
            ->with(['items.product', 'user'])
            ->where('status', 'paid')
            ->findOrFail($id);

        $pdf = Pdf::loadView('emails.orders.invoice', [
            'order' => $order,
            'user' => Auth::user(),
        ]);

        return $pdf->download("Invoice-{$order->order_number}.pdf");
    }
}
