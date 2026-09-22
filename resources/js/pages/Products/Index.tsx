import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ArrowRight, Search } from 'lucide-react';

type ProductVariation = {
    id: number;
    name: string;
    price: number;
};

type Product = {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string | null;
    category: {
        name: string;
    };
    variations: ProductVariation[];
};

export default function Index({ products }: { products: { data: Product[], links: any[] } }) {
    return (
        <GuestLayout>
            <Head title="Katalog Produk | Digital Insani" />
            
            {/* Header Section */}
            <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                        Katalog Produk.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        Koleksi lengkap aset digital premium untuk mempercepat proyek Anda. Setiap produk dirancang dengan standar industri dan siap pakai.
                    </p>
                </div>
            </div>

            {/* Catalog Grid */}
            <div className="bg-zinc-50 dark:bg-zinc-950/50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {products.data.map((product) => {
                                const lowestPrice = product.variations?.length > 0 
                                    ? Math.min(...product.variations.map(v => v.price)) 
                                    : 0;

                                return (
                                    <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col">
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-5 ring-1 ring-zinc-900/5 dark:ring-white/10 shadow-sm transition-all duration-300 group-hover:shadow-md">
                                            {product.cover_image ? (
                                                <img src={`/storage/${product.cover_image}`} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 font-mono text-sm uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-800 dark:text-zinc-300">
                                                    {product.category?.name || 'Kategori'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {product.title}
                                            </h3>
                                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                                                <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                                                    Rp {new Intl.NumberFormat('id-ID').format(lowestPrice)}
                                                </span>
                                                <div className="h-8 w-8 rounded-full bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <ArrowRight className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-32 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <Search className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Katalog Kosong</h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">Belum ada produk yang dipublikasikan.</p>
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
