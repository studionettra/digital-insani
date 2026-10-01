<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\ProductBundle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $query = CartItem::with(['product.category', 'productVariation', 'bundle.products']);

        if (auth()->check()) {
            $query->where('user_id', auth()->id());
        } else {
            $query->where('session_id', session()->getId());
        }

        $cartItems = $query->get();

        $cartProductIds = $cartItems->pluck('product_id')->unique()->toArray();

        foreach ($cartItems as $item) {
            $effectivePrice = $item->productVariation ? (float) $item->productVariation->price : 0;
            $bundleDiscountPercentage = 0;
            $bundleName = null;

            if ($item->bundle_id && $item->bundle && $item->bundle->is_active) {
                $bundleProductIds = $item->bundle->products->pluck('id')->toArray();
                $isComplete = count(array_diff($bundleProductIds, $cartProductIds)) === 0;

                if ($isComplete) {
                    $bundleDiscountPercentage = $item->bundle->discount_percentage;
                    $bundleName = $item->bundle->name;
                    $effectivePrice = round($effectivePrice * (1 - ($bundleDiscountPercentage / 100)));
                }
            }

            $item->effective_price = $effectivePrice;
            $item->bundle_discount_percentage = $bundleDiscountPercentage;
            $item->bundle_name = $bundleName;
        }

        return Inertia::render('Cart/Index', ['cartItems' => $cartItems]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variation_id' => 'required|exists:product_variations,id',
        ]);
        DB::beginTransaction();
        try {
            $query = CartItem::where('product_id', $request->product_id)
                ->where('product_variation_id', $request->product_variation_id);

            if (auth()->check()) {
                $query->where('user_id', auth()->id());
            } else {
                $query->where('session_id', session()->getId());
            }

            $cartItem = $query->first();

            if ($cartItem) {
                // For digital products, we don't really need quantity > 1, but we keep it for structure
                $cartItem->increment('quantity');
            } else {
                CartItem::create([
                    'user_id' => auth()->id(),
                    'session_id' => session()->getId(),
                    'product_id' => $request->product_id,
                    'product_variation_id' => $request->product_variation_id,
                    'quantity' => 1,
                ]);
            }
            DB::commit();

            if ($request->boolean('buy_now')) {
                return redirect()->route('cart.index');
            }

            return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke keranjang.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menambahkan produk ke keranjang.');
        }
    }

    public function addBundle(Request $request)
    {
        $request->validate([
            'bundle_id' => 'required|exists:product_bundles,id',
        ]);

        $bundle = ProductBundle::with(['products.variations'])->findOrFail($request->bundle_id);

        if (! $bundle->isAvailable()) {
            return redirect()->back()->with('error', 'Paket bundle tidak tersedia saat ini.');
        }

        DB::beginTransaction();
        try {
            foreach ($bundle->products as $product) {
                $variation = $product->variations->first();
                if (! $variation) {
                    continue;
                }

                $query = CartItem::where('product_id', $product->id)
                    ->where('product_variation_id', $variation->id);

                if (auth()->check()) {
                    $query->where('user_id', auth()->id());
                } else {
                    $query->where('session_id', session()->getId());
                }

                $cartItem = $query->first();

                if ($cartItem) {
                    $cartItem->bundle_id = $bundle->id;
                    $cartItem->save();
                } else {
                    CartItem::create([
                        'user_id' => auth()->id(),
                        'session_id' => session()->getId(),
                        'product_id' => $product->id,
                        'product_variation_id' => $variation->id,
                        'bundle_id' => $bundle->id,
                        'quantity' => 1,
                    ]);
                }
            }

            DB::commit();

            if ($request->boolean('buy_now')) {
                return redirect()->route('cart.index');
            }

            return redirect()->back()->with('success', "Paket {$bundle->name} berhasil ditambahkan ke keranjang dengan potongan diskon {$bundle->discount_percentage}%!");
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menambahkan paket ke keranjang.');
        }
    }

    public function remove(CartItem $cartItem)
    {
        if (auth()->check()) {
            if ($cartItem->user_id !== auth()->id()) {
                abort(403);
            }
        } else {
            if ($cartItem->session_id !== session()->getId()) {
                abort(403);
            }
        }

        DB::beginTransaction();
        try {
            $cartItem->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Produk berhasil dihapus dari keranjang.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menghapus produk dari keranjang.');
        }
    }
}
