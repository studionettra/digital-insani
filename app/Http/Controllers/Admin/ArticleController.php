<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with('category')->latest()->paginate(10);

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Articles/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'excerpt' => 'nullable|string|max:1000',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:1000',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author_id'] = auth()->id();

        if ($validated['is_published']) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('articles', 'public');
        }

        Article::create($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil ditambahkan.');
    }

    public function edit(Article $article)
    {
        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'excerpt' => 'nullable|string|max:1000',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:1000',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($validated['is_published'] && ! $article->published_at) {
            $validated['published_at'] = now();
        } elseif (! $validated['is_published']) {
            $validated['published_at'] = null;
        }

        if ($request->hasFile('cover_image')) {
            if ($article->cover_image) {
                Storage::disk('public')->delete($article->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('articles', 'public');
        }

        $article->update($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Article $article)
    {
        if ($article->cover_image) {
            Storage::disk('public')->delete($article->cover_image);
        }
        $article->delete();

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dihapus.');
    }
}
