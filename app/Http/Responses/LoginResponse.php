<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request)
    {
        $role = Auth::user()->role ?? 'member';

        $home = match ($role) {
            'admin' => '/admin/dashboard',
            default => '/member/dashboard',
        };

        return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->intended($home);
    }
}
