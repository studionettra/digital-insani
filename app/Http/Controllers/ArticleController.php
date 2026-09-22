<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::where('is_published', true)
            ->with('author')
            ->orderBy('published_at', 'desc')
            ->paginate(12);

        $meta = [
            'title' => 'Artikel & Berita - '.config('app.name'),
            'description' => 'Baca artikel dan berita terbaru seputar produk digital dari '.config('app.name'),
        ];

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
        ])->withViewData(['meta' => $meta]);
    }

    public function show(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->where('is_published', true)
            ->with('author')
            ->firstOrFail();

        $meta = [
            'title' => $article->meta_title ?: $article->title.' - '.config('app.name'),
            'description' => $article->meta_description ?: $article->excerpt,
            'image' => $article->cover_image ? Storage::url($article->cover_image) : null,
        ];

        return Inertia::render('Articles/Show', [
            'article' => $article,
        ])->withViewData(['meta' => $meta]);
    }
}
