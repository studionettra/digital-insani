<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsAppOrderNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    public function __construct(
        public int $orderId
    ) {}

    public function handle(WhatsAppService $whatsAppService): void
    {
        $order = Order::with(['items.product', 'items.productVariation'])->find($this->orderId);

        if (! $order) {
            Log::warning("SendWhatsAppOrderNotification: Order ID {$this->orderId} tidak ditemukan.");

            return;
        }

        if (empty($order->customer_phone)) {
            Log::info("SendWhatsAppOrderNotification: Pesanan #{$order->order_number} tidak memiliki nomor telepon. Dilewati.");

            return;
        }

        $result = $whatsAppService->sendOrderNotification($order);

        if (! $result['success'] && empty($result['skipped'])) {
            Log::warning("SendWhatsAppOrderNotification gagal untuk pesanan #{$order->order_number}: {$result['message']}");
        }
    }
}
