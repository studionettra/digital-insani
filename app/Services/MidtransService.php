<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    /**
     * Create a Midtrans Snap Transaction for an Order.
     *
     * @return array{snap_token: string, payment_url: string, payment_id: string}|null
     */
    public function createTransaction(Order $order, string $customerName, string $customerEmail): ?array
    {
        $externalId = 'DIGIPROD-'.$order->id.'-'.time();
        $order->update(['external_id' => $externalId]);

        $order->load(['items.product', 'items.productVariation']);

        $itemDetails = [];
        foreach ($order->items as $item) {
            $itemDetails[] = [
                'id' => $item->product_id.'-'.$item->product_variation_id,
                'price' => (int) $item->price,
                'quantity' => (int) $item->quantity,
                'name' => substr($item->product->title.' - '.$item->productVariation->name, 0, 50),
            ];
        }

        if ($order->discount_amount > 0) {
            $itemDetails[] = [
                'id' => 'DISCOUNT',
                'price' => -((int) $order->discount_amount),
                'quantity' => 1,
                'name' => 'Discount',
            ];
        }

        $params = [
            'item_details' => $itemDetails,
            'transaction_details' => [
                'order_id' => $externalId,
                'gross_amount' => (int) $order->total_amount,
            ],
            'customer_details' => [
                'first_name' => $customerName,
                'email' => $customerEmail,
            ],
            'callbacks' => [
                'finish' => route('checkout.status', ['order' => $order->id, 'token' => $order->access_token]),
            ],
        ];

        try {
            // Single API call — createTransaction returns both token and redirect URL
            $transaction = Snap::createTransaction($params);

            return [
                'snap_token' => $transaction->token,
                'payment_url' => $transaction->redirect_url,
                'payment_id' => $externalId,
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans Create Transaction Failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Proactively sync the transaction status from Midtrans API to our database.
     * Useful for local development when webhooks don't reach localhost.
     */
    public function syncStatus(Order $order): void
    {
        if (! $order->external_id) {
            return;
        }

        try {
            $statusResponse = Transaction::status($order->external_id);
            $transactionStatus = $statusResponse->transaction_status ?? null;
            $fraudStatus = $statusResponse->fraud_status ?? null;

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $order->update(['status' => 'pending']);
                } elseif ($fraudStatus == 'accept') {
                    $order->update(['status' => 'paid', 'paid_at' => now()]);
                    app(\App\Services\EntitlementService::class)->grantForOrder($order);
                }
            } elseif ($transactionStatus == 'settlement') {
                $order->update(['status' => 'paid', 'paid_at' => now()]);
                app(\App\Services\EntitlementService::class)->grantForOrder($order);
            } elseif ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                $order->update(['status' => 'failed']);
            } elseif ($transactionStatus == 'pending') {
                $order->update(['status' => 'pending']);
            }
        } catch (\Exception $e) {
            Log::error('Midtrans Sync Status Failed', [
                'order_id' => $order->id,
                'external_id' => $order->external_id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
