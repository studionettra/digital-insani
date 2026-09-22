<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Download;
use App\Models\Entitlement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, string $id)
    {
        $user = $request->user();

        // 1. Find entitlement
        $entitlement = Entitlement::where('user_id', $user->id)
            ->where('id', $id)
            ->active()
            ->firstOrFail();

        // 3. Get variation
        $variation = $entitlement->productVariation;

        if (! $variation) {
            return back()->with('error', 'Produk tidak ditemukan.');
        }

        // Check if delivery type is url
        if ($variation->delivery_type === 'url' && $variation->file_url) {
            return redirect()->away($variation->file_url);
        }

        // 2. Check download limit (5)
        if ($entitlement->download_count >= 5) {
            return back()->with('error', 'Batas maksimal download (5 kali) telah tercapai untuk produk ini.');
        }

        if (! $variation->file_path) {
            return back()->with('error', 'File produk belum tersedia.');
        }

        // 4. Download file from Google Drive
        $fileId = $variation->file_path; // GDrive File ID
        $disk = Storage::disk('google');

        if (! $disk->exists($fileId)) {
            return back()->with('error', 'File tidak ditemukan di sistem kami.');
        }

        // 5. Increment download count
        $entitlement->increment('download_count');

        // 5.5 Log the download
        Download::create([
            'entitlement_id' => $entitlement->id,
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'downloaded_at' => now(),
        ]);

        // 6. Stream response
        $mimeType = 'application/octet-stream';

        $fileName = $variation->product->title.' - '.$variation->name;

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
