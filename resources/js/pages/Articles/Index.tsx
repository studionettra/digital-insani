import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    cover_image: string | null;
    published_at: string;
    author: Author | null;
}

interface Pagination {
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export default function ArticleIndex({ articles, meta }: { articles: { data: Article[] } & Pagination, meta?: any }) {
    return (
        <GuestLayout>
            <Head>
                <title>{meta?.title || 'Artikel'}</title>
                <meta name="description" content={meta?.description || 'Baca artikel dan berita terbaru.'} />
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Artikel & Berita</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Kumpulan wawasan, tutorial, dan kabar terbaru seputar pengembangan produk digital.
                    </p>
                </div>

                {articles.data.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
                        <p className="text-muted-foreground text-lg">Belum ada artikel yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.data.map((article) => (
                            <Link href={`/articles/${article.slug}`} key={article.id} className="group flex flex-col">
                                <Card className="h-full flex flex-col transition-all hover:shadow-md hover:border-primary/50 overflow-hidden">
                                    {article.cover_image && (
                                        <div className="aspect-video w-full overflow-hidden bg-muted">
                                            <img
                                                src={`/storage/${article.cover_image}`}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex items-center text-xs text-muted-foreground mb-2 space-x-2">
                                            <span>
                                                {format(new Date(article.published_at), 'd MMMM yyyy', { locale: id })}
                                            </span>
                                            {article.author && (
                                                <>
                                                    <span>•</span>
                                                    <span>{article.author.name}</span>
                                                </>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-muted-foreground line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <span className="text-primary font-medium text-sm inline-flex items-center">
                                            Baca selengkapnya
                                            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {articles.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center space-x-2">
                        {articles.prev_page_url && (
                            <Link href={articles.prev_page_url}>
                                <Button variant="outline">Sebelumnya</Button>
                            </Link>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Halaman {articles.current_page} dari {articles.last_page}
                        </span>
                        {articles.next_page_url && (
                            <Link href={articles.next_page_url}>
                                <Button variant="outline">Selanjutnya</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
