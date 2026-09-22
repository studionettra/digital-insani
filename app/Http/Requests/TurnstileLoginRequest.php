<?php

namespace App\Http\Requests;

use App\Rules\TurnstileRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Laravel\Fortify\Http\Requests\LoginRequest;

class TurnstileLoginRequest extends LoginRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'cf-turnstile-response' => app()->environment('testing') ? [] : ['required', new TurnstileRule],
        ]);
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cf-turnstile-response.required' => 'Verifikasi Turnstile diperlukan.',
        ];
    }
}
