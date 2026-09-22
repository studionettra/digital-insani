<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\ProductUpdate;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UpdateController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $productIds = $user->entitlements()
            ->active()
            ->pluck('product_id');

        $updates = ProductUpdate::with('product')
            ->whereIn('product_id', $productIds)
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->paginate(15);

        return Inertia::render('Member/Updates/Index', [
            'updates' => $updates,
        ]);
    }
}
