<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'cover_image' => 'required|image|max:2048', // 2MB Max
            'demo_url' => 'nullable|url|max:255',
            'preview_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'code_snippet' => 'nullable|string|max:65535',
            'code_snippet_lang' => 'nullable|string|max:50',

            // Variations array
            'variations' => 'required|array|min:1',
            'variations.*.name' => 'required|string|max:255',
            'variations.*.price' => 'required|numeric|min:0',
            'variations.*.delivery_type' => 'required|in:file,url',
            'variations.*.product_file' => 'exclude_if:variations.*.delivery_type,url|required_if:variations.*.delivery_type,file|file|max:51200',
            'variations.*.file_url' => 'required_if:variations.*.delivery_type,url|nullable|url',
        ];
    }
}
