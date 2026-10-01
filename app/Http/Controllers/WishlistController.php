<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        if (auth()->check()) {
            $products = auth()->user()
                ->wishlistProducts()
                ->where('is_active', true)
                ->with(['category', 'variations'])
                ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
                ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
                ->latest()
                ->get();
        } else {
            $ids = $request->input('ids', []);
            if (is_string($ids)) {
                $ids = array_filter(explode(',', $ids));
            }

            $products = Product::whereIn('id', $ids)
                ->where('is_active', true)
                ->with(['category', 'variations'])
                ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
                ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
                ->latest()
                ->get();
        }

        return Inertia::render('Wishlist/Index', [
            'products' => $products,
        ])
            ->withViewData(['meta' => [
                'title' => 'Wishlist Produk Favorit | '.config('app.name'),
                'description' => 'Daftar produk digital pilihan yang Anda simpan untuk dibeli nanti.',
            ]]);
    }

    public function toggle(Request $request, Product $product): JsonResponse
    {
        if (! $product->is_active) {
            return response()->json(['message' => 'Produk tidak aktif.'], 404);
        }

        if (auth()->check()) {
            $wishlist = Wishlist::where('user_id', auth()->id())
                ->where('product_id', $product->id)
                ->first();

            if ($wishlist) {
                $wishlist->delete();
                $inWishlist = false;
                $message = 'Produk dihapus dari wishlist.';
            } else {
                Wishlist::create([
                    'user_id' => auth()->id(),
                    'product_id' => $product->id,
                ]);
                $inWishlist = true;
                $message = 'Produk berhasil disimpan ke wishlist.';
            }

            $count = Wishlist::where('user_id', auth()->id())->count();

            return response()->json([
                'status' => $inWishlist ? 'added' : 'removed',
                'in_wishlist' => $inWishlist,
                'count' => $count,
                'message' => $message,
            ]);
        }

        return response()->json([
            'status' => 'guest_handled',
            'product_id' => $product->id,
            'message' => 'Wishlist tamu disimpan di browser.',
        ]);
    }

    public function sync(Request $request): JsonResponse
    {
        if (! auth()->check()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $ids = $request->input('ids', []);
        if (is_array($ids) && count($ids) > 0) {
            $validProducts = Product::whereIn('id', $ids)->where('is_active', true)->pluck('id');

            foreach ($validProducts as $productId) {
                Wishlist::firstOrCreate([
                    'user_id' => auth()->id(),
                    'product_id' => $productId,
                ]);
            }
        }

        $count = Wishlist::where('user_id', auth()->id())->count();

        return response()->json([
            'status' => 'synced',
            'count' => $count,
        ]);
    }

    public function ids(): JsonResponse
    {
        if (auth()->check()) {
            $ids = auth()->user()->wishlistProducts()->pluck('products.id');

            return response()->json(['ids' => $ids]);
        }

        return response()->json(['ids' => []]);
    }
}
