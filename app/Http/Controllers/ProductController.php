<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function welcome()
    {
        $featuredProducts = Product::with(['category', 'variations'])->where('is_active', true)->latest()->take(6)->get();
        $categories = Category::where('is_active', true)->withCount(['products' => function ($q) {
            $q->where('is_active', true);
        }])->get();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ])
            ->withViewData(['meta' => [
                'title' => 'Selamat Datang | '.config('app.name'),
                'description' => 'Produk Digital Premium dari '.config('app.name'),
            ]]);
    }

    public function index(Request $request)
    {
        $query = Product::with(['category', 'variations'])->where('is_active', true);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category)->orWhere('id', $category);
            });
        }

        $sort = $request->input('sort', 'latest');
        if ($sort === 'price_asc') {
            $query->withMin('variations', 'price')->orderBy('variations_min_price', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->withMax('variations', 'price')->orderBy('variations_max_price', 'desc');
        } elseif ($sort === 'name_asc') {
            $query->orderBy('title', 'asc');
        } else {
            $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        $categories = Category::where('is_active', true)->withCount(['products' => function ($q) {
            $q->where('is_active', true);
        }])->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'sort' => $sort,
            ],
        ])
            ->withViewData(['meta' => [
                'title' => 'Katalog Produk | '.config('app.name'),
                'description' => 'Eksplorasi koleksi produk digital premium kami.',
            ]]);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'variations', 'updates' => function ($q) {
            $q->whereNotNull('published_at')->latest('published_at');
        }])->where('slug', $slug)->firstOrFail();

        $relatedProducts = Product::with(['category', 'variations'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ])
            ->withViewData(['meta' => [
                'title' => $product->title.' | '.config('app.name'),
                'description' => strip_tags(substr($product->description, 0, 150)),
                'image' => $product->cover_image ? Storage::url($product->cover_image) : null,
                'type' => 'product',
            ]]);
    }
}
