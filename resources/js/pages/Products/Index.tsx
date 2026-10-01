import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ArrowRight, Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, Zap, Heart, Star } from 'lucide-react';
import { useState, FormEvent } from 'react';
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
    category: {
        id: number;
        name: string;
        slug: string;
    };
    variations: ProductVariation[];
    reviews_avg_rating?: number | null;
    reviews_count?: number;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    categories: Category[];
    filters: {
        search: string;
        category: string;
        sort: string;
    };
};

export default function Index({ products, categories = [], filters }: Props) {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const handleCategoryClick = (categorySlug: string) => {
        applyFilters({ 
            category: categorySlug === filters.category ? '' : categorySlug 
        });
    };

    const handleSortChange = (sortValue: string) => {
        applyFilters({ sort: sortValue });
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/products', {}, { preserveState: true, preserveScroll: true });
    };

    const applyFilters = (newParams: Partial<{ search: string; category: string; sort: string }>) => {
        const query: Record<string, string> = {};

        const search = newParams.search !== undefined ? newParams.search : searchTerm;
        const category = newParams.category !== undefined ? newParams.category : filters.category;
        const sort = newParams.sort !== undefined ? newParams.sort : filters.sort;

        if (search) query.search = search;
        if (category) query.category = category;
        if (sort && sort !== 'latest') query.sort = sort;

        router.get('/products', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = Boolean(filters.search || filters.category || (filters.sort && filters.sort !== 'latest'));

    return (
        <GuestLayout>
            <Head title="Katalog Produk Digital | Digital Insani" />
            
            {/* Header Section */}
            <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-4 border border-blue-200/50 dark:border-blue-800/50">
                            <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Koleksi Terverifikasi & Siap Pakai</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                            Katalog Produk Digital
                        </h1>
                        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Jelajahi source code, template antarmuka, dan paket aset siap integrasi untuk mempercepat peluncuran aplikasi Anda.
                        </p>
                    </div>

                    {/* Search & Sort Controls Bar */}
                    <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari template, script, tema..."
                                className="w-full pl-10 pr-10 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        applyFilters({ search: '' });
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </form>

                        {/* Sort Selector */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                <span>Urutkan:</span>
                            </div>
                            <select
                                value={filters.sort || 'latest'}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="px-3.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                            >
                                <option value="latest">Terbaru</option>
                                <option value="price_asc">Harga: Terendah</option>
                                <option value="price_desc">Harga: Tertinggi</option>
                                <option value="name_asc">Nama: A - Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    {categories.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2 items-center">
                            <button
                                type="button"
                                onClick={() => handleCategoryClick('')}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                    !filters.category
                                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }`}
                            >
                                Semua Kategori
                            </button>
                            {categories.map((cat) => {
                                const isActive = filters.category === cat.slug;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        {cat.products_count !== undefined && (
                                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                                isActive 
                                                    ? 'bg-blue-700 text-white' 
                                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                                            }`}>
                                                {cat.products_count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="ml-auto text-xs font-medium text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                                >
                                    <X className="h-3 w-3" />
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Catalog Grid Section */}
            <div className="bg-zinc-50 dark:bg-zinc-950/50 py-12 md:py-16 min-h-[500px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Result count status */}
                    <div className="mb-6 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>
                            Menampilkan <strong>{products.total}</strong> produk digital
                        </span>
                        {filters.search && (
                            <span>
                                Hasil pencarian untuk: &ldquo;<strong>{filters.search}</strong>&rdquo;
                            </span>
                        )}
                    </div>

                    {products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {products.data.map((product) => {
                                    const lowestPrice = product.variations?.length > 0 
                                        ? Math.min(...product.variations.map(v => v.price)) 
                                        : 0;

                                    return (
                                        <Link 
                                            key={product.id} 
                                            href={`/products/${product.slug}`} 
                                            className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-md transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                                        >
                                            {/* Thumbnail / Cover */}
                                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4 border border-zinc-200/40 dark:border-zinc-800/60">
                                                {product.cover_image ? (
                                                    <img 
                                                        src={`/storage/${product.cover_image}`} 
                                                        alt={product.title} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 font-mono text-xs uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900">
                                                        No Preview Image
                                                    </div>
                                                )}
                                                
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 shadow-xs">
                                                        {product.category?.name || 'Aset Digital'}
                                                    </span>
                                                </div>

                                                {/* Wishlist Button */}
                                                <div className="absolute top-3 right-3 z-10">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleWishlist(product.id, product.title);
                                                        }}
                                                        className={`p-2 rounded-full backdrop-blur-md shadow-xs transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                                                            isWishlisted(product.id)
                                                                ? 'bg-rose-50/90 dark:bg-rose-950/90 text-rose-500 ring-1 ring-rose-200 dark:ring-rose-800'
                                                                : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-400 hover:text-rose-500'
                                                        }`}
                                                        title={isWishlisted(product.id) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                                                        aria-label="Wishlist"
                                                    >
                                                        <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-col flex-1 px-1">
                                                {product.reviews_count && product.reviews_count > 0 ? (
                                                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mb-1">
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                        <span>{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                                                        <span className="text-zinc-400 font-normal">({product.reviews_count})</span>
                                                    </div>
                                                ) : null}

                                                <h3 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50 leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                    {product.title}
                                                </h3>
                                                
                                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
                                                    <div>
                                                        <span className="text-[11px] text-zinc-400 block font-normal">Mulai dari</span>
                                                        <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                                                            Rp {new Intl.NumberFormat('id-ID').format(lowestPrice)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {products.last_page > 1 && (
                                <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Halaman {products.current_page} dari {products.last_page} ({products.total} total produk)
                                    </p>
                                    
                                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                        {products.links.map((link, idx) => {
                                            // Handle Previous label
                                            const isPrevious = link.label.includes('Previous') || link.label.includes('&laquo;');
                                            // Handle Next label
                                            const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                                            
                                            if (!link.url) {
                                                return (
                                                    <span 
                                                        key={idx} 
                                                        className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-transparent"
                                                    >
                                                        {isPrevious ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                                    </span>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={idx}
                                                    href={link.url}
                                                    preserveScroll
                                                    preserveState
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white shadow-xs font-semibold'
                                                            : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                                    }`}
                                                >
                                                    {isPrevious ? (
                                                        <span className="flex items-center gap-1">
                                                            <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
                                                        </span>
                                                    ) : isNext ? (
                                                        <span className="flex items-center gap-1">
                                                            Selanjutnya <ChevronRight className="h-3.5 w-3.5" />
                                                        </span>
                                                    ) : (
                                                        link.label
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 max-w-xl mx-auto p-8">
                            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Produk Tidak Ditemukan</h3>
                            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                {filters.search 
                                    ? `Tidak ada produk yang cocok dengan kata kunci "${filters.search}".`
                                    : 'Belum ada produk digital dalam filter kategori ini.'}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 px-6 py-2.5 text-xs font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 transition-colors"
                                >
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
