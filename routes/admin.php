<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductUpdateController;
use App\Http\Controllers\Admin\SettingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin', 'verified', 'prevent.back'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('articles', ArticleController::class);
    Route::resource('products', ProductController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('members', MemberController::class);

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    Route::resource('coupons', CouponController::class)->except(['show']);
    Route::resource('product-updates', ProductUpdateController::class)->except(['show']);

    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
});
