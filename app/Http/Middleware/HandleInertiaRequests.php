<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cartItemCount = 0;
        if (Schema::hasTable('cart_items')) {
            if (auth()->check()) {
                $cartItemCount = CartItem::where('user_id', auth()->id())->count();
            } else {
                $cartItemCount = CartItem::where('session_id', session()->getId())->count();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
                'status' => fn () => $request->session()->get('status'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'cartItemCount' => $cartItemCount,
            'site_settings' => [
                'site_name' => SiteSetting::get('site_name', config('app.name')),
                'logo_url' => SiteSetting::get('logo_url'),
                'support_email' => SiteSetting::get('support_email'),
                'contact_phone' => SiteSetting::get('contact_phone'),
            ],
        ];
    }
}
