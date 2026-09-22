<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendProductUpdateNotification;
use App\Models\Product;
use App\Models\ProductUpdate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductUpdateController extends Controller
{
    public function index(Request $request)
    {
        $updates = ProductUpdate::with('product')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/ProductUpdates/Index', [
            'updates' => $updates,
        ]);
    }

    public function create()
    {
        $products = Product::select('id', 'title')->get();

        return Inertia::render('Admin/ProductUpdates/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'version' => ['required', 'string', 'max:255'],
            'changelog' => ['required', 'string'],
            'email_message' => ['nullable', 'string'],
            'notify_users' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $update = ProductUpdate::create($validated);

        if ($update->notify_users && ! $update->is_notified) {
            SendProductUpdateNotification::dispatch($update);
            $update->update(['is_notified' => true]);
        }

        return redirect()->route('admin.product-updates.index')->with('success', 'Pembaruan produk berhasil dibuat.');
    }

    public function edit(ProductUpdate $productUpdate)
    {
        $products = Product::select('id', 'title')->get();

        return Inertia::render('Admin/ProductUpdates/Edit', [
            'productUpdate' => $productUpdate,
            'products' => $products,
        ]);
    }

    public function update(Request $request, ProductUpdate $productUpdate)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'version' => ['required', 'string', 'max:255'],
            'changelog' => ['required', 'string'],
            'email_message' => ['nullable', 'string'],
            'notify_users' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $productUpdate->update($validated);

        if ($productUpdate->notify_users && ! $productUpdate->is_notified) {
            SendProductUpdateNotification::dispatch($productUpdate);
            $productUpdate->update(['is_notified' => true]);
        }

        return redirect()->route('admin.product-updates.index')->with('success', 'Pembaruan produk berhasil diperbarui.');
    }

    public function destroy(ProductUpdate $productUpdate)
    {
        $productUpdate->delete();

        return redirect()->route('admin.product-updates.index')->with('success', 'Pembaruan produk berhasil dihapus.');
    }
}
