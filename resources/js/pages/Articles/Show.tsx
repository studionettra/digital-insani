import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Author {
    id: number;
    name: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    published_at: string;
    author: Author | null;
}

export default function ArticleShow({ article, meta }: { article: Article, meta?: any }) {
    return (
        <GuestLayout>
            <Head>
                <title>{meta?.title || article.title}</title>
                <meta name="description" content={meta?.description || article.excerpt} />
            </Head>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/articles" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke daftar artikel
                </Link>

                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center text-sm text-muted-foreground mb-4 space-x-2">
                            <span>
                                {format(new Date(article.published_at), 'd MMMM yyyy', { locale: id })}
                            </span>
                            {article.author && (
                                <>
                                    <span>•</span>
                                    <span>Ditulis oleh {article.author.name}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                            {article.title}
                        </h1>
                        {article.excerpt && (
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                                {article.excerpt}
                            </p>
                        )}
                    </header>

                    {article.cover_image && (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-12 shadow-md">
                            <img
                                src={`/storage/${article.cover_image}`}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div 
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: article.content }} 
                    />
                </article>
            </div>
            
            {/* Trix Editor CSS adjustments if needed */}
            <style dangerouslySetInnerHTML={{__html: `
                .article-content img { border-radius: 0.5rem; max-width: 100%; height: auto; margin-top: 2rem; margin-bottom: 2rem; }
                .article-content h2 { margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 700; font-size: 1.875rem; }
                .article-content h3 { margin-top: 2rem; margin-bottom: 0.75rem; font-weight: 600; font-size: 1.5rem; }
                .article-content p { margin-bottom: 1.25rem; line-height: 1.75; }
                .article-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                .article-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                .article-content a { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 4px; }
                .article-content blockquote { border-left: 4px solid hsl(var(--border)); padding-left: 1rem; font-style: italic; color: hsl(var(--muted-foreground)); margin: 1.5rem 0; }
                .article-content pre { background: hsl(var(--muted)); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-family: monospace; font-size: 0.875rem; margin-bottom: 1.25rem; }
                .article-content code { background: hsl(var(--muted)); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em; }
            `}} />
        </GuestLayout>
    );
}
