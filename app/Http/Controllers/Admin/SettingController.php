<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index(WhatsAppService $whatsAppService)
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'site_name' => SiteSetting::get('site_name', 'Digital Insani'),
                'support_email' => SiteSetting::get('support_email', 'support@digital.insani.id'),
                'contact_phone' => SiteSetting::get('contact_phone', ''),
                'address' => SiteSetting::get('address', ''),
                'logo_url' => SiteSetting::get('logo_url', ''),
                'flash_sale_active' => filter_var(SiteSetting::get('flash_sale_active', '1'), FILTER_VALIDATE_BOOLEAN),
                'flash_sale_title' => SiteSetting::get('flash_sale_title', '⚡ Flash Sale Spesial — Diskon Kilat Terbatas!'),
                'flash_sale_ends_at' => SiteSetting::get('flash_sale_ends_at', now()->addDays(2)->format('Y-m-d\TH:i')),
                'flash_sale_discount_percentage' => (int) SiteSetting::get('flash_sale_discount_percentage', '30'),
                'whatsapp_notification_active' => filter_var(SiteSetting::get('whatsapp_notification_active', '0'), FILTER_VALIDATE_BOOLEAN),
                'whatsapp_provider' => SiteSetting::get('whatsapp_provider', 'fonnte'),
                'whatsapp_api_token' => SiteSetting::get('whatsapp_api_token', ''),
                'whatsapp_message_template' => SiteSetting::get('whatsapp_message_template', $whatsAppService->getDefaultTemplate()),
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
            'flash_sale_active' => ['nullable', 'boolean'],
            'flash_sale_title' => ['nullable', 'string', 'max:255'],
            'flash_sale_ends_at' => ['nullable', 'string', 'max:255'],
            'flash_sale_discount_percentage' => ['nullable', 'integer', 'min:1', 'max:99'],
            'whatsapp_notification_active' => ['nullable', 'boolean'],
            'whatsapp_provider' => ['nullable', 'string', 'in:fonnte,wablas,custom'],
            'whatsapp_api_token' => ['nullable', 'string', 'max:255'],
            'whatsapp_message_template' => ['nullable', 'string', 'max:2000'],
        ]);

        SiteSetting::set('site_name', $validated['site_name']);
        SiteSetting::set('support_email', $validated['support_email']);
        SiteSetting::set('contact_phone', $validated['contact_phone'] ?? '');
        SiteSetting::set('address', $validated['address'] ?? '');

        if (array_key_exists('flash_sale_active', $validated)) {
            SiteSetting::set('flash_sale_active', $validated['flash_sale_active'] ? '1' : '0');
        }
        if (! empty($validated['flash_sale_title'])) {
            SiteSetting::set('flash_sale_title', $validated['flash_sale_title']);
        }
        if (! empty($validated['flash_sale_ends_at'])) {
            SiteSetting::set('flash_sale_ends_at', $validated['flash_sale_ends_at']);
        }
        if (! empty($validated['flash_sale_discount_percentage'])) {
            SiteSetting::set('flash_sale_discount_percentage', (string) $validated['flash_sale_discount_percentage']);
        }

        if (array_key_exists('whatsapp_notification_active', $validated)) {
            SiteSetting::set('whatsapp_notification_active', $validated['whatsapp_notification_active'] ? '1' : '0');
        }
        if (! empty($validated['whatsapp_provider'])) {
            SiteSetting::set('whatsapp_provider', $validated['whatsapp_provider']);
        }
        if (array_key_exists('whatsapp_api_token', $validated)) {
            SiteSetting::set('whatsapp_api_token', $validated['whatsapp_api_token'] ?? '');
        }
        if (! empty($validated['whatsapp_message_template'])) {
            SiteSetting::set('whatsapp_message_template', $validated['whatsapp_message_template']);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('settings', 'public');
            $logoUrl = Storage::url($path);
            SiteSetting::set('logo_url', $logoUrl, 'general', 'image');
        }

        return back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    public function testWhatsApp(Request $request, WhatsAppService $whatsAppService)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:25'],
        ]);

        $siteName = SiteSetting::get('site_name', config('app.name', 'Digital Insani'));
        $providerName = strtoupper($whatsAppService->getProvider());
        $testMessage = "Halo! Ini adalah pesan uji coba dari sistem *{$siteName}* menggunakan gateway WhatsApp *{$providerName}*. Koneksi integrasi WhatsApp berhasil aktif! 🎉";

        $result = $whatsAppService->sendMessage($validated['phone'], $testMessage);

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }
}
