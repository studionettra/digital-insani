import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/MemberLayout';
import { Package, ChevronRight } from 'lucide-react';
import { Paginator } from '@/types';

type ProductUpdate = {
    id: number;
    product_id: number;
    version: string | null;
    html_changelog: string;
    published_at: string;
    product: {
        id: number;
        title: string;
        slug: string;
    };
};

export default function UpdatesIndex({ updates }: { updates: Paginator<ProductUpdate> }) {
    return (
        <MemberLayout>
            <Head title="Pembaruan Produk" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Pembaruan Produk</h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Berita dan rilis versi terbaru dari produk yang Anda miliki.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {updates.data.length === 0 ? (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">Belum Ada Pembaruan</h3>
                                <p className="text-zinc-500 max-w-md mx-auto">
                                    Pembaruan produk akan muncul di sini ketika produk yang Anda beli merilis versi baru.
                                </p>
                            </div>
                        ) : (
                            updates.data.map(update => (
                                <div key={update.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide">
                                                        {update.version || 'Update'}
                                                    </span>
                                                    <span className="text-sm text-zinc-500">
                                                        {new Date(update.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                                    {update.product.title}
                                                </h3>
                                            </div>
                                            <Link 
                                                href={`/member/products/${update.product_id}`}
                                                className="shrink-0 inline-flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                            >
                                                Lihat Produk <ChevronRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </div>

                                        <div 
                                            className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400"
                                            dangerouslySetInnerHTML={{ __html: update.html_changelog }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Simple Pagination */}
                    {updates.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {updates.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        link.active 
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' 
                                            : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
