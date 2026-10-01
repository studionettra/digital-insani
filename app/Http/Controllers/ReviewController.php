<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request): RedirectResponse
    {
        $item = OrderItem::with('order')->findOrFail($request->order_item_id);
        $order = $item->order;

        if ($order->status !== 'paid') {
            return back()->with('error', 'Ulasan hanya dapat diberikan untuk pesanan yang telah lunas.');
        }

        $isOwner = auth()->check() && auth()->id() === $order->user_id;
        $isGuestWithToken = ($request->token && $request->token === $order->access_token);
        $isGuestWithSession = ! $order->user_id && session()->getId() === $order->session_id;

        if (! $isOwner && ! $isGuestWithToken && ! $isGuestWithSession) {
            abort(403, 'Anda tidak memiliki hak untuk mengulas pesanan ini.');
        }

        if (Review::where('order_item_id', $item->id)->exists()) {
            return back()->with('error', 'Anda sudah memberikan ulasan untuk produk pada pesanan ini.');
        }

        Review::create([
            'user_id' => auth()->id() ?: $order->user_id,
            'order_item_id' => $item->id,
            'product_id' => $item->product_id,
            'customer_name' => auth()->check() ? auth()->user()->name : $order->customer_name,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => true,
            'is_verified_buyer' => true,
        ]);

        return back()->with('success', 'Terima kasih! Ulasan dan rating Anda berhasil dikirim.');
    }
}
