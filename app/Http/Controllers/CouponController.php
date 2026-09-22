<?php

namespace App\Http\Controllers;

use App\Services\CouponService;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCoupon(Request $request, CouponService $couponService)
    {
        $request->validate([
            'coupon_code' => 'required|string',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $code = $request->input('coupon_code');
        $subtotal = (float) $request->input('subtotal', 0);
        $validation = $couponService->validate($code, $subtotal);

        if (! $validation) {
            return response()->json([
                'valid' => false,
                'message' => 'Kupon tidak valid atau sudah tidak aktif.',
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'discount' => $validation['discount'],
            'message' => 'Kupon berhasil digunakan.',
        ]);
    }
}
