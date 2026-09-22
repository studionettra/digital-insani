<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return Inertia::render('Member/Profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
            'current_password' => ['nullable', 'required_with:password', 'current_password'],
            'password' => ['nullable', Password::defaults(), 'confirmed'],
        ]);

        $user = $request->user();

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('member.profile.edit')->with('success', 'Profil berhasil diperbarui.');
    }
}
