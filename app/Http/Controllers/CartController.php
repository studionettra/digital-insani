<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $query = CartItem::with(['product.category', 'productVariation']);

        if (auth()->check()) {
            $query->where('user_id', auth()->id());
        } else {
            $query->where('session_id', session()->getId());
        }

        $cartItems = $query->get();

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

            return redirect()->back()->with('error', 'Failed to add product to cart');
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

            return redirect()->back()->with('success', 'Product removed from cart');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Failed to remove product from cart');
        }
    }
}
