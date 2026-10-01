import { useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Heart, Trash2, ArrowRight, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';

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
    category?: {
        name: string;
    };
    variations?: ProductVariation[];
    reviews_avg_rating?: number | null;
    reviews_count?: number;
};

type Props = {
    products: Product[];
};

export default function WishlistIndex({ products = [] }: Props) {
    const { auth } = usePage<any>().props;
    const { toggleWishlist, isWishlisted, wishlistIds } = useWishlist();

    // If guest and URL does not have ids parameter, automatically reload with stored IDs
    useEffect(() => {
        if (!auth?.user && typeof window !== 'undefined') {
            const saved = localStorage.getItem('di_guest_wishlist_ids_v1');
            if (saved) {
                try {
                    const ids = JSON.parse(saved);
                    const currentUrl = new URL(window.location.href);
                    const urlIds = currentUrl.searchParams.get('ids');
                    const idsStr = ids.join(',');

                    if (ids.length > 0 && urlIds !== idsStr) {
                        router.get('/wishlist', { ids: idsStr }, { preserveState: true, replace: true });
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
    }, [auth?.user]);

    const displayedProducts = products.filter(p => isWishlisted(p.id) || auth?.user);

    return (
        <GuestLayout>
            <Head title="Wishlist Produk Favorit | Digital Insani" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 ring-1 ring-inset ring-rose-600/20 mb-3">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            <span>Daftar Simpanan</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            Wishlist Produk Favorit
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            Simpan aset digital favorit Anda dan selesaikan transaksi kapan saja.
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Lanjut Belanja di Katalog &rarr;
                    </Link>
                </div>

                {/* Guest Account Prompt */}
                {!auth?.user && displayedProducts.length > 0 && (
                    <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-left">
                            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                <strong>Simpan Permanen:</strong> Wishlist saat ini tersimpan di peramban ini. 
                                <Link href="/login" className="underline font-bold ml-1 hover:text-amber-950 dark:hover:text-white">Masuk</Link> atau <Link href="/register" className="underline font-bold hover:text-amber-950 dark:hover:text-white">Daftar Akun</Link> untuk menyinkronkannya di seluruh perangkat.
                            </p>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                {displayedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => {
                            const minPrice = product.variations && product.variations.length > 0
                                ? Math.min(...product.variations.map(v => v.price))
                                : 0;

                            return (
                                <div 
                                    key={product.id}
                                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Cover Image & Remove Button */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
                                        {product.cover_image ? (
                                            <img
                                                src={`/storage/${product.cover_image}`}
                                                alt={product.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400 font-mono">
                                                No Image
                                            </div>
                                        )}

                                        {/* Remove from Wishlist Button */}
                                        <button
                                            type="button"
                                            onClick={() => toggleWishlist(product.id, product.title)}
                                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-sm backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                            title="Hapus dari wishlist"
                                            aria-label="Hapus dari wishlist"
                                        >
                                            <Heart className="w-4 h-4 fill-rose-500" />
                                        </button>

                                        {product.category && (
                                            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-900/80 dark:bg-white/90 text-white dark:text-zinc-900 backdrop-blur-xs">
                                                {product.category.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex flex-1 flex-col p-5">
                                        {/* Rating preview */}
                                        {product.reviews_count && product.reviews_count > 0 ? (
                                            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mb-2">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                <span>{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                                                <span className="text-zinc-400 font-normal">({product.reviews_count})</span>
                                            </div>
                                        ) : null}

                                        <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Link href={`/products/${product.slug}`}>
                                                {product.title}
                                            </Link>
                                        </h3>

                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 mb-4 flex-1">
                                            {product.description?.replace(/<[^>]*>?/gm, '') || 'Aset digital berkualitas siap pakai.'}
                                        </p>

                                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 mt-auto">
                                            <div>
                                                <span className="text-[10px] text-zinc-400 block uppercase font-medium">Mulai Dari</span>
                                                <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                                                    Rp {new Intl.NumberFormat('id-ID').format(minPrice)}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                                            >
                                                Lihat
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Zero State */
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 shadow-xs max-w-xl mx-auto p-8">
                        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4 ring-8 ring-rose-50/50 dark:ring-rose-950/20">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            Wishlist Anda Masih Kosong
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
                            Jelajahi berbagai template, script, dan aset digital kami, lalu klik ikon hati untuk menyimpannya di sini.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                            Jelajahi Katalog Produk
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
