import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/MemberLayout';

type Product = {
    id: number;
    title: string;
    slug: string;
    cover_image: string | null;
    category: {
        name: string;
    };
};

type Entitlement = {
    id: number;
    granted_at: string;
    product: Product;
    productVariation?: {
        name: string;
    };
};

export default function ProductsIndex({ entitlements }: { entitlements: Entitlement[] }) {
    return (
        <MemberLayout>
            <Head title="Produk Saya | Digital Insani" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Produk Saya</h1>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Daftar produk digital yang telah Anda beli dan berhak Anda akses.</p>
                    </div>

                    {entitlements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {entitlements.map(entitlement => (
                                <Link 
                                    key={entitlement.id} 
                                    href={`/member/products/${entitlement.id}`}
                                    className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                                        {entitlement.product.cover_image ? (
                                            <img 
                                                src={`/storage/${entitlement.product.cover_image}`} 
                                                alt={entitlement.product.title} 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400">IMG</div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 shadow-sm">
                                                {entitlement.product.category.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col grow">
                                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2">
                                            {entitlement.product.title}
                                        </h2>
                                        {entitlement.productVariation && (
                                            <p className="text-sm text-zinc-500 mb-2">{entitlement.productVariation.name}</p>
                                        )}
                                        <div className="mt-auto pt-4 flex items-center justify-between text-sm text-zinc-500">
                                            <span>Diakses sejak {new Date(entitlement.granted_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">Buka &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">Anda belum memiliki produk apa pun.</p>
                            <Link href="/products" className="inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                                Jelajahi Katalog
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </MemberLayout>
    );
}
