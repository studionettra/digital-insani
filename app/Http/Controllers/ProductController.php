<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function welcome()
    {
        $featuredProducts = Product::with(['category', 'variations'])->where('is_active', true)->latest()->take(6)->get();

        return Inertia::render('welcome', ['featuredProducts' => $featuredProducts])
            ->withViewData(['meta' => [
                'title' => 'Selamat Datang | '.config('app.name'),
                'description' => 'Produk Digital Premium dari '.config('app.name'),
            ]]);
    }

    public function index()
    {
        $products = Product::with(['category', 'variations'])->where('is_active', true)->paginate(12);

        return Inertia::render('Products/Index', ['products' => $products])
            ->withViewData(['meta' => [
                'title' => 'Katalog Produk | '.config('app.name'),
                'description' => 'Eksplorasi koleksi produk digital premium kami.',
            ]]);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'variations'])->where('slug', $slug)->firstOrFail();

        return Inertia::render('Products/Show', ['product' => $product])
            ->withViewData(['meta' => [
                'title' => $product->title.' | '.config('app.name'),
                'description' => strip_tags(substr($product->description, 0, 150)),
                'image' => $product->cover_image ? Storage::url($product->cover_image) : null,
                'type' => 'product',
            ]]);
    }
}
