<?php

namespace App\Http\Controllers;

use App\Models\Download;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GuestDownloadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Order $order, OrderItem $item)
    {
        // 1. Validate Token
        $token = $request->query('token');
        if (! $token || $token !== $order->access_token) {
            abort(403, 'Akses ditolak. Token tidak valid.');
        }

        // 2. Ensure item belongs to the order
        if ($item->order_id !== $order->id) {
            abort(404, 'Item tidak ditemukan dalam pesanan ini.');
        }

        // 3. Ensure order is paid
        if ($order->status !== 'paid') {
            return back()->with('error', 'Pesanan belum lunas.');
        }

        // 3.5 Check 24-hour expiration for guest access
        if ($order->paid_at && $order->paid_at->diffInHours(now()) >= 24) {
            return back()->with('error', 'Tautan unduhan telah kedaluwarsa (lebih dari 24 jam). Silakan buat akun menggunakan email yang sama dengan pesanan ini untuk mengakses produk di Member Area secara permanen.');
        }

        $variation = $item->productVariation;
        if (! $variation) {
            return back()->with('error', 'Produk tidak ditemukan.');
        }

        // 4. Check if delivery type is url
        if ($variation->delivery_type === 'url' && $variation->file_url) {
            return redirect()->away($variation->file_url);
        }

        // 5. Check download limit (5) on OrderItem
        if ($item->download_count >= 5) {
            return back()->with('error', 'Batas maksimal download (5 kali) telah tercapai untuk produk ini.');
        }

        if (! $variation->file_path) {
            return back()->with('error', 'File produk belum tersedia.');
        }

        // 6. Download file from Google Drive
        $fileId = $variation->file_path; // GDrive File ID
        $disk = Storage::disk('google');

        if (! $disk->exists($fileId)) {
            return back()->with('error', 'File tidak ditemukan di sistem kami.');
        }

        // 7. Increment download count
        $item->increment('download_count');

        // 7.5 Log the download
        Download::create([
            'order_item_id' => $item->id,
            'user_id' => auth()->id(), // null if guest
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'downloaded_at' => now(),
        ]);

        // 8. Stream response
        $mimeType = 'application/octet-stream';
        $fileName = $item->product->title.' - '.$variation->name;

        $headers = [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
        ];

        return response()->stream(function () use ($disk, $fileId) {
            $stream = $disk->readStream($fileId);
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, $headers);
    }
}
