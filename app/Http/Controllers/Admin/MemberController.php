<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        $members = User::where('role', 'member')->latest()->paginate(10);

        return Inertia::render('Admin/Members/Index', [
            'members' => $members,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Members/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'member',
        ]);

        return redirect()->route('admin.members.index')->with('success', 'Member berhasil ditambahkan.');
    }

    public function edit(User $member)
    {
        return Inertia::render('Admin/Members/Edit', [
            'member' => $member,
        ]);
    }

    public function update(Request $request, User $member)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($member->id)],
            'password' => ['nullable', Password::defaults()],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $member->update($data);

        return redirect()->route('admin.members.index')->with('success', 'Member berhasil diperbarui.');
    }

    public function destroy(User $member)
    {
        $member->delete();

        return redirect()->route('admin.members.index')->with('success', 'Member berhasil dihapus.');
    }
}
