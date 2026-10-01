<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_item_id' => ['required', 'integer', 'exists:order_items,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:5', 'max:1000'],
            'token' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_item_id.required' => 'Item pesanan wajib dipilih.',
            'order_item_id.exists' => 'Item pesanan tidak ditemukan.',
            'rating.required' => 'Silakan pilih rating bintang 1 sampai 5.',
            'rating.min' => 'Rating minimal 1 bintang.',
            'rating.max' => 'Rating maksimal 5 bintang.',
            'comment.required' => 'Tuliskan ulasan Anda mengenai produk ini.',
            'comment.min' => 'Ulasan minimal 5 karakter.',
            'comment.max' => 'Ulasan maksimal 1000 karakter.',
        ];
    }
}
