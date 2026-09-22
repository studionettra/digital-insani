<?php

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can view settings page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.settings.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Settings/Index')
    );
});

test('admin can update settings', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $logo = UploadedFile::fake()->image('logo.png');

    $response = $this->actingAs($admin)->post(route('admin.settings.update'), [
        'site_name' => 'New Site Name',
        'support_email' => 'support@newsite.com',
        'contact_phone' => '08123456789',
        'address' => 'Jl. Baru No. 1',
        'logo' => $logo,
    ]);

    $response->assertRedirect();

    expect(SiteSetting::get('site_name'))->toBe('New Site Name');
    expect(SiteSetting::get('support_email'))->toBe('support@newsite.com');
    expect(SiteSetting::get('logo_url'))->not()->toBeNull();
});
