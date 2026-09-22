<?php

namespace App\Http\Controllers;

use App\Mail\OrderPendingMail;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SiteSetting;
use App\Services\CouponService;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function store(Request $request, CouponService $couponService, MidtransService $midtransService)
    {
        if (! auth()->check()) {
            $request->validate([
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
                'customer_phone' => 'required|string|max:20',
            ]);
        }

        $cartItemsQuery = CartItem::with(['product', 'productVariation']);
        if (auth()->check()) {
            $cartItemsQuery->where('user_id', auth()->id());
        } else {
            $cartItemsQuery->where('session_id', session()->getId());
        }
        $cartItems = $cartItemsQuery->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index');
        }

        DB::beginTransaction();
        try {
            $subtotal = $cartItems->sum(function ($item) {
                return $item->productVariation->price * $item->quantity;
            });

            $discount = 0;
            $couponCode = $request->input('coupon_code');
            $couponModel = null;

            if ($couponCode) {
                $validation = $couponService->validate($couponCode, $subtotal);
                if ($validation) {
                    $couponModel = $validation['coupon'];
                    $discount = $validation['discount'];
                } else {
                    return back()->with('error', 'Kupon tidak valid atau sudah tidak aktif.');
                }
            }

            $total = max(0, $subtotal - $discount);

            $order = Order::create([
                'user_id' => auth()->id(),
                'session_id' => session()->getId(),
                'access_token' => Str::uuid()->toString(),
                'customer_name' => auth()->check() ? auth()->user()->name : $request->customer_name,
                'customer_email' => auth()->check() ? auth()->user()->email : $request->customer_email,
                'customer_phone' => auth()->check() ? auth()->user()->phone : $request->customer_phone,
                'order_number' => 'ORD-'.strtoupper(uniqid()),
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'coupon_code' => $couponModel ? $couponModel->code : null,
                'total_amount' => $total,
                'status' => 'pending',
                'payment_method' => 'midtrans',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variation_id' => $item->product_variation_id,
                    'price' => $item->productVariation->price,
                    'quantity' => $item->quantity,
                ]);
            }

            if ($couponModel && auth()->check()) {
                $couponService->recordUsage($couponModel, auth()->id(), $order->id);
            }

            if (auth()->check()) {
                CartItem::where('user_id', auth()->id())->delete();
            } else {
                CartItem::where('session_id', session()->getId())->delete();
            }

            // Create Midtrans Transaction
            $transactionData = $midtransService->createTransaction($order, $order->customer_name, $order->customer_email);

            if ($transactionData) {
                $order->update([
                    'payment_id' => $transactionData['payment_id'],
                    'payment_url' => $transactionData['payment_url'],
                    'snap_token' => $transactionData['snap_token'],
                ]);

                DB::commit();

                // Kirim Email Pending
                try {
                    $userForEmail = auth()->check() ? auth()->user() : (object) [
                        'name' => $order->customer_name,
                        'email' => $order->customer_email,
                    ];
                    Mail::to($order->customer_email)->send(new OrderPendingMail($order, $userForEmail));
                } catch (\Throwable $e) {
                    Log::error('Failed to send pending email: '.$e->getMessage());
                }

                $uiMode = SiteSetting::where('key', 'midtrans_ui_mode')->value('value') ?? 'redirect';

                if ($uiMode === 'snap') {
                    // Jika mode snap, kita redirect ke status page, di status page akan men-trigger popup
                    return redirect()->route('checkout.status', ['order' => $order->id, 'token' => $order->access_token]);
                } else {
                    // Mode redirect, lempar langsung ke halaman midtrans
                    return Inertia::location($transactionData['payment_url']);
                }
            } else {
                throw new \Exception('Gagal membuat transaksi di Midtrans.');
            }

        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Checkout Error: '.$th->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat checkout. Silakan coba lagi.');
        }
    }

    public function status(Request $request, Order $order, MidtransService $midtransService, ?string $token = null)
    {
        // Allow access if logged in user owns the order, OR if they are a guest but have the correct access_token (from path or query), OR session_id matches
        $isOwner = auth()->check() && auth()->id() === $order->user_id;
        $isGuestWithToken = ($token === $order->access_token) || ($request->has('token') && $request->token === $order->access_token);
        $isGuestWithSession = ! $order->user_id && session()->getId() === $order->session_id;

        if (! $isOwner && ! $isGuestWithToken && ! $isGuestWithSession) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        // Proactively sync status for local development where webhooks can't reach
        if ($order->status === 'pending') {
            $midtransService->syncStatus($order);
            $order->refresh();
        }

        $purchaseEvent = false;
        if ($order->status === 'paid' && ! session()->has('purchase_fired_'.$order->id)) {
            $purchaseEvent = true;
            session()->put('purchase_fired_'.$order->id, true);
        }

        return inertia('Checkout/Status', [
            'order' => $order->load('items.product', 'items.productVariation'),
            'purchaseEvent' => $purchaseEvent,
        ]);
    }
}
