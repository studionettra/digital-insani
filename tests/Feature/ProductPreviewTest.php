<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
    Storage::fake('google');

    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->category = Category::factory()->create(['is_active' => true]);
});

test('product show page includes preview pdf and code snippet props', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'is_active' => true,
        'preview_pdf' => 'products/previews/sample-preview.pdf',
        'code_snippet' => 'echo "Hello World";',
        'code_snippet_lang' => 'php',
    ]);
    ProductVariation::factory()->create(['product_id' => $product->id]);

    $response = $this->get(route('products.show', $product->slug));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
        ->where('product.preview_pdf', 'products/previews/sample-preview.pdf')
        ->where('product.code_snippet', 'echo "Hello World";')
        ->where('product.code_snippet_lang', 'php')
    );
});

test('admin can create product with preview pdf and code snippet', function () {
    $pdf = UploadedFile::fake()->create('sample-guide.pdf', 1024, 'application/pdf');
    $cover = UploadedFile::fake()->image('cover.jpg', 600, 400);

    $response = $this->actingAs($this->admin)->post(route('admin.products.store'), [
        'title' => 'E-Book Laravel Mastery',
        'category_id' => $this->category->id,
        'description' => '<p>Deskripsi buku lengkap</p>',
        'demo_url' => 'https://example.com/demo',
        'cover_image' => $cover,
        'preview_pdf' => $pdf,
        'code_snippet' => 'public function index(): Response { return inertia("Home"); }',
        'code_snippet_lang' => 'php',
        'variations' => [
            [
                'name' => 'E-Book PDF Only',
                'price' => '150000',
                'delivery_type' => 'url',
                'file_url' => 'https://drive.google.com/file/d/123/view',
            ],
        ],
    ]);

    $response->assertRedirect(route('admin.products.index'));

    $product = Product::where('title', 'E-Book Laravel Mastery')->first();
    expect($product)->not->toBeNull()
        ->and($product->preview_pdf)->not->toBeNull()
        ->and($product->code_snippet)->toBe('public function index(): Response { return inertia("Home"); }')
        ->and($product->code_snippet_lang)->toBe('php');

    Storage::disk('public')->assertExists($product->preview_pdf);
    Storage::disk('public')->assertExists($product->cover_image);
});

test('admin can update code snippet and replace preview pdf', function () {
    $oldPdf = UploadedFile::fake()->create('old-preview.pdf', 500, 'application/pdf');
    $oldPdfPath = $oldPdf->store('products/previews', 'public');

    $product = Product::factory()->create([
        'category_id' => $this->category->id,
        'preview_pdf' => $oldPdfPath,
        'code_snippet' => 'old code snippet',
        'code_snippet_lang' => 'javascript',
    ]);
    $variation = ProductVariation::factory()->create(['product_id' => $product->id]);

    Storage::disk('public')->assertExists($oldPdfPath);

    $newPdf = UploadedFile::fake()->create('new-preview.pdf', 700, 'application/pdf');

    $response = $this->actingAs($this->admin)->put(route('admin.products.update', $product->id), [
        'title' => $product->title,
        'category_id' => $this->category->id,
        'description' => $product->description,
        'demo_url' => $product->demo_url,
        'preview_pdf' => $newPdf,
        'code_snippet' => 'const express = require("express");',
        'code_snippet_lang' => 'javascript',
        'variations' => [
            [
                'id' => $variation->id,
                'name' => $variation->name,
                'price' => (string) $variation->price,
                'delivery_type' => 'url',
                'file_url' => 'https://drive.google.com/test',
            ],
        ],
    ]);

    $response->assertRedirect(route('admin.products.index'));

    $product->refresh();
    expect($product->code_snippet)->toBe('const express = require("express");')
        ->and($product->preview_pdf)->not->toBe($oldPdfPath);

    Storage::disk('public')->assertMissing($oldPdfPath);
    Storage::disk('public')->assertExists($product->preview_pdf);
});

test('validation rejects non-pdf files for preview pdf', function () {
    $invalidFile = UploadedFile::fake()->create('document.exe', 500);

    $response = $this->actingAs($this->admin)->post(route('admin.products.store'), [
        'title' => 'Produk A',
        'category_id' => $this->category->id,
        'preview_pdf' => $invalidFile,
        'variations' => [
            [
                'name' => 'Standard',
                'price' => '50000',
                'delivery_type' => 'url',
                'file_url' => 'https://drive.google.com',
            ],
        ],
    ]);

    $response->assertSessionHasErrors(['preview_pdf']);
});

test('validation rejects preview pdf exceeding maximum size', function () {
    $largePdf = UploadedFile::fake()->create('large-sample.pdf', 11000, 'application/pdf'); // 11MB > 10MB (10240KB)

    $response = $this->actingAs($this->admin)->post(route('admin.products.store'), [
        'title' => 'Produk Besar',
        'category_id' => $this->category->id,
        'preview_pdf' => $largePdf,
        'variations' => [
            [
                'name' => 'Standard',
                'price' => '50000',
                'delivery_type' => 'url',
                'file_url' => 'https://drive.google.com',
            ],
        ],
    ]);

    $response->assertSessionHasErrors(['preview_pdf']);
});
