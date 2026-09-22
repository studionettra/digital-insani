<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'site_name' => SiteSetting::get('site_name', 'Digital Insani'),
                'support_email' => SiteSetting::get('support_email', 'support@digital.insani.id'),
                'contact_phone' => SiteSetting::get('contact_phone', ''),
                'address' => SiteSetting::get('address', ''),
                'logo_url' => SiteSetting::get('logo_url', ''),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'support_email' => ['required', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:2048'], // 2MB Max
        ]);

        SiteSetting::set('site_name', $validated['site_name']);
        SiteSetting::set('support_email', $validated['support_email']);
        SiteSetting::set('contact_phone', $validated['contact_phone']);
        SiteSetting::set('address', $validated['address']);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('settings', 'public');
            $logoUrl = Storage::url($path);
            SiteSetting::set('logo_url', $logoUrl, 'general', 'image');
        }

        return back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
