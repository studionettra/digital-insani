<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\GuestDownloadController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\Member\DashboardController;
use App\Http\Controllers\Member\DownloadController;
use App\Http\Controllers\Member\OrderController;
use App\Http\Controllers\Member\ProfileController;
use App\Http\Controllers\Member\UpdateController;
use App\Http\Controllers\MidtransWebhookController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProductController::class, 'welcome'])->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
Route::post('/wishlist/toggle/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
Route::post('/wishlist/sync', [WishlistController::class, 'sync'])->name('wishlist.sync');
Route::get('/wishlist/ids', [WishlistController::class, 'ids'])->name('wishlist.ids');

Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');

Route::get('/refund-policy', [LegalController::class, 'refundPolicy'])->name('legal.refund');
Route::get('/terms', [LegalController::class, 'terms'])->name('legal.terms');
Route::get('/privacy-policy', [LegalController::class, 'privacyPolicy'])->name('legal.privacy');

Route::get('/sitemap.xml', [SitemapController::class, 'index']);

Route::middleware(['auth', 'verified', 'prevent.back'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()?->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('member.dashboard');
    })->name('dashboard');

    Route::prefix('member')->name('member.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/products', [App\Http\Controllers\Member\ProductController::class, 'index'])->name('products.index');
        Route::get('/products/{id}', [App\Http\Controllers\Member\ProductController::class, 'show'])->name('products.show');
        Route::get('/products/{id}/download', DownloadController::class)->name('products.download');

        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{order}/invoice', [OrderController::class, 'downloadInvoice'])->name('orders.invoice');

        Route::get('/updates', [UpdateController::class, 'index'])->name('updates.index');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    });
});

Route::middleware(['web'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/bundle', [CartController::class, 'addBundle'])->name('cart.bundle');
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');

    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/{order}/status/{token?}', [CheckoutController::class, 'status'])->name('checkout.status');
    Route::get('/checkout/{order}/invoice/{token?}', [CheckoutController::class, 'downloadInvoice'])->name('checkout.invoice');
    Route::get('/orders/{order}/download/{item}', GuestDownloadController::class)->name('guest.download');
    Route::post('/coupon/validate', [CouponController::class, 'validateCoupon'])->name('coupon.validate');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

Route::post('/webhook/midtrans', [MidtransWebhookController::class, 'handle'])->name('webhook.midtrans');

require __DIR__.'/settings.php';
