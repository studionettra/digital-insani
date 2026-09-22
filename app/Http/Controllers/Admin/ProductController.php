<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'variations'])->latest()->paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $coverImagePath = $request->file('cover_image')->store('products/covers', 'public');

        $product = Product::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title).'-'.uniqid(),
            'category_id' => $request->category_id,
            'description' => $request->description,
            'cover_image' => $coverImagePath,
            'is_active' => true,
        ]);

        foreach ($request->variations as $index => $variationData) {
            $deliveryType = $variationData['delivery_type'] ?? 'file';
            $productFilePath = null;
            $fileUrl = null;

            if ($deliveryType === 'file') {
                $productFilePath = $request->file("variations.{$index}.product_file")->store('products/files', 'google');
            } else {
                $fileUrl = $variationData['file_url'] ?? null;
            }

            $product->variations()->create([
                'name' => $variationData['name'],
                'price' => $variationData['price'],
                'delivery_type' => $deliveryType,
                'file_path' => $productFilePath,
                'file_url' => $fileUrl,
                'is_active' => true,
            ]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->get();
        // Load all variations
        $product->load('variations');

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = [
            'title' => $request->title,
            'category_id' => $request->category_id,
            'description' => $request->description,
        ];

        if ($request->hasFile('cover_image')) {
            if ($product->cover_image) {
                Storage::disk('public')->delete($product->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('products/covers', 'public');
        }

        $product->update($data);

        // Handle Variations
        if ($request->has('variations')) {
            $submittedVariationIds = collect($request->variations)->pluck('id')->filter()->toArray();

            // Delete variations that are removed
            $variationsToDelete = $product->variations()->whereNotIn('id', $submittedVariationIds)->get();
            foreach ($variationsToDelete as $variation) {
                if ($variation->file_path) {
                    Storage::disk('google')->delete($variation->file_path);
                }
                $variation->delete();
            }

            // Update or Create variations
            foreach ($request->variations as $index => $variationData) {
                $deliveryType = $variationData['delivery_type'] ?? 'file';

                if (! empty($variationData['id'])) {
                    // Update existing
                    $variation = $product->variations()->find($variationData['id']);
                    if ($variation) {
                        $updateData = [
                            'name' => $variationData['name'],
                            'price' => $variationData['price'],
                            'delivery_type' => $deliveryType,
                        ];

                        if ($deliveryType === 'url') {
                            $updateData['file_url'] = $variationData['file_url'] ?? null;
                            // Optionally delete old file if they switch to URL
                            if ($variation->file_path) {
                                Storage::disk('google')->delete($variation->file_path);
                                $updateData['file_path'] = null;
                            }
                        } else {
                            // It's a file
                            if ($request->hasFile("variations.{$index}.product_file")) {
                                if ($variation->file_path) {
                                    Storage::disk('google')->delete($variation->file_path);
                                }
                                $updateData['file_path'] = $request->file("variations.{$index}.product_file")->store('products/files', 'google');
                            }
                            // Clear file url just in case
                            $updateData['file_url'] = null;
                        }

                        $variation->update($updateData);
                    }
                } else {
                    // Create new
                    $productFilePath = null;
                    $fileUrl = null;

                    if ($deliveryType === 'file') {
                        $productFilePath = $request->file("variations.{$index}.product_file")
                                       ? $request->file("variations.{$index}.product_file")->store('products/files', 'google')
                                       : null;
                    } else {
                        $fileUrl = $variationData['file_url'] ?? null;
                    }

                    $product->variations()->create([
                        'name' => $variationData['name'],
                        'price' => $variationData['price'],
                        'delivery_type' => $deliveryType,
                        'file_path' => $productFilePath,
                        'file_url' => $fileUrl,
                        'is_active' => true,
                    ]);
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        if ($product->cover_image) {
            Storage::disk('public')->delete($product->cover_image);
        }

        foreach ($product->variations as $variation) {
            if ($variation->file_path) {
                Storage::disk('google')->delete($variation->file_path);
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index');
    }
}
