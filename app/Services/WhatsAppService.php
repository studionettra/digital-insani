<?php

namespace App\Services;

use App\Models\Order;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Check if WhatsApp notification is enabled.
     */
    public function isEnabled(): bool
    {
        $settingValue = SiteSetting::get('whatsapp_notification_active');

        if ($settingValue !== null) {
            return filter_var($settingValue, FILTER_VALIDATE_BOOLEAN);
        }

        return (bool) config('services.whatsapp.enabled', false);
    }

    /**
     * Get the configured gateway provider (e.g. 'fonnte', 'wablas').
     */
    public function getProvider(): string
    {
        return (string) (SiteSetting::get('whatsapp_provider') ?: config('services.whatsapp.provider', 'fonnte'));
    }

    /**
     * Get the configured API Key/Token.
     */
    public function getApiKey(): ?string
    {
        $token = SiteSetting::get('whatsapp_api_token');

        if (! empty($token)) {
            return (string) $token;
        }

        return config('services.whatsapp.api_key');
    }

    /**
     * Normalize phone number to standard international format (e.g. 6281234567890).
     */
    public function normalizePhoneNumber(string $phone): string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $phone);

        if (empty($cleaned)) {
            return '';
        }

        if (str_starts_with($cleaned, '0')) {
            $cleaned = '62'.substr($cleaned, 1);
        } elseif (str_starts_with($cleaned, '8')) {
            $cleaned = '62'.$cleaned;
        }

        return $cleaned;
    }

    /**
     * Get the default WhatsApp message template.
     */
    public function getDefaultTemplate(): string
    {
        return "Halo kak *{customer_name}*, terima kasih telah berbelanja di *{site_name}*! 🙏\n\n"
            ."Pembayaran untuk pesanan *{order_number}* sebesar *Rp {total_amount}* telah kami terima dengan status *LUNAS*.\n\n"
            ."📦 *Produk yang Anda beli:*\n{product_names}\n\n"
            ."📥 *Akses & Unduh Berkas Anda Sekarang:*\n{download_url}\n\n"
            ."📄 *Unduh Invoice Pembayaran:*\n{invoice_url}\n\n"
            .'Jika membutuhkan bantuan instalasi atau ada pertanyaan, silakan balas pesan WhatsApp ini. Selamat berkarya! ✨';
    }

    /**
     * Render message template by substituting placeholder tokens.
     */
    public function renderTemplate(Order $order, ?string $customTemplate = null): string
    {
        $order->loadMissing(['items.product', 'items.productVariation']);

        $siteName = SiteSetting::get('site_name', config('app.name', 'Digital Insani'));
        $template = $customTemplate ?: SiteSetting::get('whatsapp_message_template') ?: $this->getDefaultTemplate();

        $productLines = [];
        foreach ($order->items as $item) {
            $productTitle = $item->product ? $item->product->title : 'Produk Digital';
            $variationName = $item->productVariation ? $item->productVariation->name : null;
            $productLines[] = '- '.$productTitle.($variationName ? " ({$variationName})" : '');
        }
        $productNames = count($productLines) > 0 ? implode("\n", $productLines) : '- Aset Digital';

        // Secure download link
        if ($order->access_token) {
            $downloadUrl = url("/checkout/status/{$order->id}?token={$order->access_token}");
            $invoiceUrl = url("/orders/{$order->id}/invoice?token={$order->access_token}");
        } else {
            $downloadUrl = url('/dashboard/downloads');
            $invoiceUrl = url("/checkout/status/{$order->id}");
        }

        $formattedTotal = number_format($order->total_amount, 0, ',', '.');

        $replacements = [
            '{customer_name}' => $order->customer_name ?: 'Pelanggan',
            '{site_name}' => $siteName,
            '{order_number}' => $order->order_number,
            '{total_amount}' => $formattedTotal,
            '{product_names}' => $productNames,
            '{download_url}' => $downloadUrl,
            '{invoice_url}' => $invoiceUrl,
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    /**
     * Send a WhatsApp message to a phone number.
     *
     * @return array{success: bool, message: string, data?: mixed, skipped?: bool}
     */
    public function sendMessage(string $phone, string $message): array
    {
        $target = $this->normalizePhoneNumber($phone);

        if (empty($target)) {
            return [
                'success' => false,
                'message' => 'Nomor WhatsApp tidak valid atau kosong.',
            ];
        }

        if (! $this->isEnabled()) {
            return [
                'success' => false,
                'message' => 'Notifikasi WhatsApp saat ini nonaktif di pengaturan.',
                'skipped' => true,
            ];
        }

        $apiKey = $this->getApiKey();
        if (empty($apiKey)) {
            Log::warning('WhatsApp Gateway: API token belum diatur.');

            return [
                'success' => false,
                'message' => 'API token gateway WhatsApp belum diatur.',
                'skipped' => true,
            ];
        }

        $provider = strtolower($this->getProvider());

        try {
            if ($provider === 'fonnte') {
                $response = Http::withHeaders([
                    'Authorization' => $apiKey,
                ])->timeout(15)->post('https://api.fonnte.com/send', [
                    'target' => $target,
                    'message' => $message,
                    'countryCode' => '62',
                ]);

                $data = $response->json();
                $isSuccess = $response->successful() && ($data['status'] ?? false) == true;

                if (! $isSuccess) {
                    Log::warning('Fonnte WhatsApp API error', [
                        'target' => $target,
                        'response' => $data,
                        'status' => $response->status(),
                    ]);
                }

                return [
                    'success' => $isSuccess,
                    'message' => $isSuccess ? 'Pesan WhatsApp berhasil dikirim via Fonnte.' : ($data['reason'] ?? 'Gagal mengirim pesan via Fonnte.'),
                    'data' => $data,
                ];
            }

            if ($provider === 'wablas') {
                $response = Http::withHeaders([
                    'Authorization' => $apiKey,
                ])->timeout(15)->post('https://api.wablas.com/api/v2/send-message', [
                    'phone' => $target,
                    'message' => $message,
                ]);

                $data = $response->json();
                $isSuccess = $response->successful() && (($data['status'] ?? '') === 'success' || ($data['status'] ?? false) == true);

                return [
                    'success' => $isSuccess,
                    'message' => $isSuccess ? 'Pesan WhatsApp berhasil dikirim via Wablas.' : ($data['message'] ?? 'Gagal mengirim pesan via Wablas.'),
                    'data' => $data,
                ];
            }

            // Fallback for custom / mock webhook
            Log::info("WhatsApp Gateway Mock [{$provider}] to {$target}: {$message}");

            return [
                'success' => true,
                'message' => "Pesan tercatat pada log provider [{$provider}].",
            ];
        } catch (\Throwable $e) {
            Log::error('WhatsApp Gateway Exception: '.$e->getMessage(), [
                'target' => $target,
                'provider' => $provider,
            ]);

            return [
                'success' => false,
                'message' => 'Koneksi ke gateway WhatsApp gagal: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Send order confirmation notification for a paid Order.
     *
     * @return array{success: bool, message: string, skipped?: bool}
     */
    public function sendOrderNotification(Order $order): array
    {
        if (empty($order->customer_phone)) {
            return [
                'success' => false,
                'message' => 'Pesanan tidak memiliki nomor telepon pembeli.',
                'skipped' => true,
            ];
        }

        $message = $this->renderTemplate($order);

        return $this->sendMessage($order->customer_phone, $message);
    }
}
