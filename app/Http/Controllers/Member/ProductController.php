<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the member's products.
     */
    public function index()
    {
        $entitlements = Auth::user()->entitlements()
            ->with('product.category')
            ->active()
            ->latest()
            ->get();

        return Inertia::render('Member/Products/Index', [
            'entitlements' => $entitlements,
        ]);
    }

    /**
     * Display the specified product entitlement.
     */
    public function show($id)
    {
        $entitlement = Auth::user()->entitlements()
            ->with(['product.category', 'productVariation', 'product.updates' => function ($query) {
                $query->orderBy('published_at', 'desc');
            }])
            ->where('id', $id)
            ->active()
            ->firstOrFail();

        return Inertia::render('Member/Products/Show', [
            'entitlement' => $entitlement,
            'product' => $entitlement->product,
            'variation' => $entitlement->productVariation,
        ]);
    }
}
