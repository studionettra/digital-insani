<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $products = Product::where('is_active', true)->get();
        $articles = Article::where('is_published', true)->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Home
        $xml .= '<url>';
        $xml .= '<loc>'.route('home').'</loc>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>1.0</priority>';
        $xml .= '</url>';

        // Products Index
        $xml .= '<url>';
        $xml .= '<loc>'.route('products.index').'</loc>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>0.9</priority>';
        $xml .= '</url>';

        // Articles Index
        $xml .= '<url>';
        $xml .= '<loc>'.route('articles.index').'</loc>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>0.8</priority>';
        $xml .= '</url>';

        // Products
        foreach ($products as $product) {
            $xml .= '<url>';
            $xml .= '<loc>'.route('products.show', $product->slug).'</loc>';
            $xml .= '<lastmod>'.$product->updated_at->tz('UTC')->toAtomString().'</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        // Articles
        foreach ($articles as $article) {
            $xml .= '<url>';
            $xml .= '<loc>'.route('articles.show', $article->slug).'</loc>';
            $xml .= '<lastmod>'.$article->updated_at->tz('UTC')->toAtomString().'</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.7</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
