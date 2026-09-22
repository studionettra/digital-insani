<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $query = Coupon::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('code', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $coupons = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Coupons/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:255', 'unique:coupons,code'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'string', Rule::in(['fixed', 'percentage'])],
            'discount_amount' => ['required', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['boolean'],
        ]);

        Coupon::create($validated);

        return redirect()->route('admin.coupons.index')->with('success', 'Kupon berhasil dibuat.');
    }

    public function edit(Coupon $coupon)
    {
        return Inertia::render('Admin/Coupons/Edit', [
            'coupon' => $coupon,
        ]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:255', Rule::unique('coupons')->ignore($coupon->id)],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'string', Rule::in(['fixed', 'percentage'])],
            'discount_amount' => ['required', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['boolean'],
        ]);

        $coupon->update($validated);

        return redirect()->route('admin.coupons.index')->with('success', 'Kupon berhasil diperbarui.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('admin.coupons.index')->with('success', 'Kupon berhasil dihapus.');
    }
}
