<?php

namespace App\Http\Controllers;

use App\Mail\PaymentSuccessMail;
use App\Models\Order;
use App\Models\PaymentWebhookEvent;
use App\Services\EntitlementService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Midtrans\Config;

class MidtransWebhookController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
    }

    public function handle(Request $request, EntitlementService $entitlementService)
    {
        $payload = $request->all();

        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;
        $transaction = $payload['transaction_status'] ?? null;
        $type = $payload['payment_type'] ?? null;
        $fraud = $payload['fraud_status'] ?? null;

        // Validate required fields
        if (! $orderId || ! $statusCode || ! $grossAmount) {
            return response()->json(['message' => 'Missing required fields'], 400);
        }

        // Verify prefix — only process DIGIPROD orders
        if (! str_starts_with($orderId, 'DIGIPROD-')) {
            return response()->json(['message' => 'Ignored: not a DIGIPROD order'], 200);
        }

        // Verify Midtrans signature (SHA-512)
        $serverKey = config('services.midtrans.server_key');
        $expectedSignature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        if ($signatureKey !== $expectedSignature) {
            Log::warning('Invalid Midtrans Webhook Signature', [
                'order_id' => $orderId,
                'expected' => $expectedSignature,
                'received' => $signatureKey,
            ]);

            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Audit: log the webhook event
        PaymentWebhookEvent::create([
            'provider' => 'midtrans',
            'event_type' => $transaction ?? 'unknown',
            'external_id' => $orderId,
            'payload' => $payload,
            'status' => 'processed',
        ]);

        try {
            $order = Order::where('external_id', $orderId)->first();

            if (! $order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            // Idempotency: skip if order is already in a final state
            if ($order->status === 'paid') {
                return response()->json(['status' => 'success', 'message' => 'Already paid']);
            }

            if ($transaction === 'capture') {
                if ($type === 'credit_card') {
                    if ($fraud === 'accept') {
                        $this->markAsPaid($order, $entitlementService);
                    } elseif ($fraud === 'challenge') {
                        $order->update(['status' => 'pending']);
                    }
                }
            } elseif ($transaction === 'settlement') {
                $this->markAsPaid($order, $entitlementService);
            } elseif ($transaction === 'pending') {
                $order->update(['status' => 'pending']);
            } elseif (in_array($transaction, ['deny', 'expire'])) {
                $order->update(['status' => 'failed']);
            } elseif ($transaction === 'cancel') {
                $order->update(['status' => 'cancelled']);
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: '.$e->getMessage());

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark an order as paid, grant entitlements, and send confirmation email.
     */
    private function markAsPaid(Order $order, EntitlementService $entitlementService): void
    {
        $order->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Grant entitlements for all products in the order
        $entitlementService->grantForOrder($order);

        // Send payment success email with invoice PDF
        try {
            $user = $order->user ?: (object) [
                'name' => $order->customer_name,
                'email' => $order->customer_email,
                'is_guest' => true,
            ];

            if ($user) {
                $pdf = Pdf::loadView('emails.orders.invoice', [
                    'order' => $order,
                    'user' => $user,
                ]);

                Mail::to($user->email)
                    ->send(new PaymentSuccessMail($order, $user, $pdf->output()));
            }
        } catch (\Throwable $e) {
            Log::error('Failed to send success email/invoice: '.$e->getMessage());
        }
    }
}
