import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/MemberLayout';
import { Download, ChevronLeft } from 'lucide-react';

type ProductUpdate = {
    id: number;
    version: string | null;
    html_changelog: string;
    published_at: string;
};

type Product = {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string | null;
    updates?: ProductUpdate[];
};

type ProductVariation = {
    id: number;
    name: string;
};

type Entitlement = {
    id: number;
    download_count: number;
    granted_at: string;
};

export default function ProductShow({ entitlement, product, variation }: { entitlement: Entitlement, product: Product, variation: ProductVariation | null }) {
    return (
        <MemberLayout>
            <Head title={`${product.title} | Produk Saya`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-6">
                        <Link href="/member/products" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Kembali ke Produk Saya
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="md:flex">
                            <div className="md:w-1/3 bg-zinc-100 dark:bg-zinc-800 aspect-square md:aspect-auto relative">
                                {product.cover_image ? (
                                    <img 
                                        src={`/storage/${product.cover_image}`} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                                )}
                            </div>
                            <div className="p-8 md:w-2/3 flex flex-col">
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                                    {product.title}
                                </h1>
                                {variation && (
                                    <h2 className="text-lg font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                                        {variation.name}
                                    </h2>
                                )}
                                
                                <div 
                                    className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 text-sm mb-8"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />

                                <div className="mt-auto pt-8 border-t border-zinc-100 dark:border-zinc-800">
                                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4">Akses File Anda</h3>
                                    
                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                                                <Download className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">Main File (Versi Terbaru)</p>
                                                <p className="text-xs text-zinc-500">Sisa Kuota Download: {5 - (entitlement.download_count || 0)} / 5</p>
                                            </div>
                                        </div>
                                        
                                        {entitlement.download_count >= 5 ? (
                                            <button 
                                                disabled
                                                className="inline-flex items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
                                            >
                                                Limit Tercapai
                                            </button>
                                        ) : (
                                            <a 
                                                href={`/member/products/${entitlement.id}/download`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                            >
                                                {variation && (variation as any).delivery_type === 'url' ? 'Buka Akses' : 'Download'}
                                            </a>
                                        )}
                                    </div>
                                    <p className="mt-4 text-xs text-zinc-500">
                                        Perhatian: {variation && (variation as any).delivery_type === 'url' ? 'Tautan ini akan membuka halaman eksternal di tab baru.' : 'URL download dibuat unik dan hanya berlaku selama satu sesi. Pastikan koneksi stabil saat mengunduh.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Product Updates Section */}
            {product.updates && product.updates.length > 0 && (
                <div className="pb-12">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-zinc-900 shadow-sm sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
                            <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white mb-6">Pembaruan Produk</h3>
                            <div className="space-y-8">
                                {product.updates.map((update, idx) => (
                                    <div key={update.id} className={idx !== product.updates!.length - 1 ? "pb-8 border-b border-zinc-100 dark:border-zinc-800" : ""}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide">
                                                {update.version || 'Update'}
                                            </div>
                                            <div className="text-sm text-zinc-500">
                                                {new Date(update.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div 
                                            className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400"
                                            dangerouslySetInnerHTML={{ __html: update.html_changelog }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MemberLayout>
    );
}
