<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function welcome()
    {
        $featuredProducts = Product::with(['category', 'variations'])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
            ->where('is_active', true)
            ->latest()
            ->take(6)
            ->get();
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
        $query = Product::with(['category', 'variations'])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
            ->where('is_active', true);

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
        $product = Product::with([
            'category',
            'variations',
            'updates' => function ($q) {
                $q->whereNotNull('published_at')->latest('published_at');
            },
            'reviews' => function ($q) {
                $q->where('is_approved', true)->latest();
            },
        ])->where('slug', $slug)->firstOrFail();

        $relatedProducts = Product::with(['category', 'variations'])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        $reviews = $product->reviews;
        $reviewsCount = $reviews->count();
        $averageRating = $reviewsCount > 0 ? round($reviews->avg('rating'), 1) : 0;
        $ratingBreakdown = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        $eligibleOrderItemId = null;
        if (auth()->check()) {
            $eligibleItem = OrderItem::where('product_id', $product->id)
                ->whereHas('order', function ($q) {
                    $q->where('user_id', auth()->id())->where('status', 'paid');
                })
                ->whereDoesntHave('review')
                ->first();

            $eligibleOrderItemId = $eligibleItem?->id;
        }

        $bundles = $product->bundles()
            ->where('is_active', true)
            ->with(['products' => function ($q) {
                $q->where('is_active', true)->with('variations');
            }])
            ->get()
            ->filter(fn ($b) => $b->isAvailable())
            ->values();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'bundles' => $bundles,
            'reviews' => $reviews,
            'reviewsStats' => [
                'average' => $averageRating,
                'count' => $reviewsCount,
                'breakdown' => $ratingBreakdown,
            ],
            'eligibleOrderItemId' => $eligibleOrderItemId,
        ])
            ->withViewData(['meta' => [
                'title' => $product->title.' | '.config('app.name'),
                'description' => strip_tags(substr($product->description, 0, 150)),
                'image' => $product->cover_image ? Storage::url($product->cover_image) : null,
                'type' => 'product',
            ]]);
    }
}
