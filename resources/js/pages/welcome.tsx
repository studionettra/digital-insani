import { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { 
    ArrowRight, 
    Box, 
    Zap, 
    Shield, 
    Sparkles, 
    Search, 
    CheckCircle2, 
    ChevronDown, 
    HelpCircle, 
    Code2, 
    Lock, 
    RefreshCw,
    Download,
    Heart,
    Star
} from 'lucide-react';
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
        name: string;
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

type Props = {
    featuredProducts: Product[];
    categories?: Category[];
};

export default function Welcome({ featuredProducts = [], categories = [] }: Props) {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [heroSearch, setHeroSearch] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const handleHeroSearch = (e: FormEvent) => {
        e.preventDefault();
        if (heroSearch.trim()) {
            router.get('/products', { search: heroSearch.trim() });
        } else {
            router.get('/products');
        }
    };

    const faqs = [
        {
            q: 'Bagaimana cara menerima dan mengunduh berkas setelah pembayaran?',
            a: 'Begitu pembayaran Anda terverifikasi oleh Midtrans, halaman status langsung menampilkan tombol unduh file secara instan. Selain itu, salinan tanda terima dan tautan unduhan otomatis dikirimkan ke alamat email Anda.'
        },
        {
            q: 'Apakah saya mendapatkan source code lengkap yang dapat dimodifikasi?',
            a: 'Ya, seluruh produk berupa script, template, atau kit pengembangan menyertakan source code asli (unminified) tanpa enkripsi rumit, sehingga Anda dapat menyesuaikannya sesuai kebutuhan proyek.'
        },
        {
            q: 'Bolehkah produk ini digunakan untuk proyek klien komersial?',
            a: 'Bisa! Anda dapat memilih variasi lisensi komersial/developer pada halaman produk saat menambahkan ke keranjang belanja.'
        },
        {
            q: 'Metode pembayaran apa saja yang didukung?',
            a: 'Kami mendukung pembayaran QRIS (semua e-wallet dan m-banking), GoPay, OVO, ShopeePay, serta Virtual Account bank terkemuka (BCA, Mandiri, BNI, BRI) melalui payment gateway resmi Midtrans.'
        },
        {
            q: 'Bagaimana jika berkas yang diunduh mengalami kendala teknis?',
            a: 'Kami menjamin file bebas dari kerusakan. Jika Anda menemui kendala saat mengekstrak atau menjalankan panduan instalasi, tim kami siap membantu melalui WhatsApp atau email resmi kami.'
        }
    ];

    return (
        <GuestLayout>
            <Head title="Karya Digital Instan untuk Kreator & Developer | Digital Insani" />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 pt-16 sm:pt-24 pb-24 md:pb-32 border-b border-zinc-200/60 dark:border-zinc-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                        
                        {/* Hero Left Column: Copy & Search */}
                        <div className="sm:text-center md:mx-auto lg:col-span-6 lg:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100/70 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 mb-6">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Katalog Aset Digital Terbaru 2026</span>
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.12]">
                                Karya digital instan untuk <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">developer modern.</span>
                            </h1>
                            
                            <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl sm:mx-auto lg:mx-0 leading-relaxed">
                                Percepat proses pengembangan produk Anda. Unduh source code, starter kit, script, dan template antarmuka teruji dengan pengiriman instan.
                            </p>

                            {/* Hero Search Box */}
                            <form onSubmit={handleHeroSearch} className="mt-8 max-w-md sm:mx-auto lg:mx-0">
                                <div className="relative flex items-center shadow-md rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 focus-within:ring-2 focus-within:ring-blue-600 transition-all">
                                    <Search className="h-5 w-5 text-zinc-400 ml-3.5 shrink-0" />
                                    <input 
                                        type="text" 
                                        value={heroSearch}
                                        onChange={(e) => setHeroSearch(e.target.value)}
                                        placeholder="Cari template, script, tema..."
                                        className="w-full bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
                                    />
                                    <button 
                                        type="submit"
                                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>

                            {/* Category Quick Chips */}
                            {categories.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-1.5 items-center sm:justify-center lg:justify-start">
                                    <span className="text-xs text-zinc-400 mr-1 font-medium">Populer:</span>
                                    {categories.slice(0, 4).map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${cat.slug}`}
                                            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Actions CTAs */}
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                                <Link 
                                    href="/products" 
                                    className="group inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-sm"
                                >
                                    Eksplorasi Katalog
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link 
                                    href="/articles" 
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-zinc-800 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 dark:text-zinc-200 dark:ring-zinc-700 dark:hover:bg-zinc-800 transition-all"
                                >
                                    Panduan & Artikel
                                </Link>
                            </div>
                        </div>
                        
                        {/* Hero Right Column: Interactive Digital Product Mockup Frame */}
                        <div className="relative mt-14 lg:mt-0 lg:col-span-6">
                            <div className="relative mx-auto w-full max-w-lg lg:max-w-none rounded-3xl bg-gradient-to-tr from-blue-600/10 via-zinc-900/5 to-indigo-600/10 p-2 sm:p-3 border border-zinc-200/80 dark:border-zinc-800 shadow-xl backdrop-blur-xl">
                                
                                {/* Simulated Browser Window */}
                                <div className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-inner">
                                    {/* Browser Window Controls */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-100/80 dark:bg-zinc-800/60 border-b border-zinc-200/80 dark:border-zinc-800 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                        </div>
                                        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 px-3 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                                            digitalinsani.id/demo/starter-kit
                                        </span>
                                        <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                                        </span>
                                    </div>

                                    {/* Mockup Dashboard Content */}
                                    <div className="p-6 space-y-5 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Premium Starter Kit</span>
                                                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">SaaS Multi-Tenant Boilerplate</h4>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                                v2.4.0
                                            </span>
                                        </div>

                                        {/* Mock Stat Cards */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-xs">
                                                <span className="text-[10px] text-zinc-400 block">Deliverables</span>
                                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Full Code</span>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-xs">
                                                <span className="text-[10px] text-zinc-400 block">Tech Stack</span>
                                                <span className="text-sm font-bold text-blue-600">Laravel + React</span>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-xs">
                                                <span className="text-[10px] text-zinc-400 block">Akses File</span>
                                                <span className="text-sm font-bold text-green-600">Instan</span>
                                            </div>
                                        </div>

                                        {/* Mock Code Snippet */}
                                        <div className="p-3 rounded-xl bg-zinc-900 text-zinc-300 font-mono text-xs border border-zinc-800 space-y-1">
                                            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1 border-b border-zinc-800 pb-1">
                                                <span>terminal — bash</span>
                                                <span>READY</span>
                                            </div>
                                            <p className="text-emerald-400">$ git clone digital-insani-asset.git</p>
                                            <p className="text-zinc-400">$ composer install && npm run build</p>
                                            <p className="text-blue-400">&#10003; Server live on http://localhost:8000</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Micro Trust Badges */}
                                <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span>Unduh Instan .ZIP</span>
                                </div>

                                <div className="absolute -top-4 -right-3 sm:-right-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                    <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span>Bebas Virus 100%</span>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Value Metrics / Trust Bar */}
            <section className="py-12 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto mb-2">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">100% Instan</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Unduh detik ini juga setelah pembayaran</p>
                        </div>
                        <div className="space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 flex items-center justify-center mx-auto mb-2">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Bebas Malware</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">File dipindai & terverifikasi aman</p>
                        </div>
                        <div className="space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto mb-2">
                                <RefreshCw className="w-5 h-5" />
                            </div>
                            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Update Gratis</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Akses pembaruan minor berkelanjutan</p>
                        </div>
                        <div className="space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto mb-2">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Full Source Code</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Dapat diedit & disesuaikan sepenuhnya</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-20 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-14 max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Kelebihan Utama</span>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">Dirancang untuk kecepatan & skala.</h2>
                        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">Kami memastikan setiap produk dikembangkan mengikuti standar industri modern, rapi, dan mudah di-deploy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-2 rounded-3xl bg-white dark:bg-zinc-900 p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-500 mb-5" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Pengiriman Berkas Tanpa Jeda</h3>
                            <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                Begitu transaksi berhasil diverifikasi oleh gateway Midtrans, file langsung dapat diunduh tanpa proses verifikasi manual atau menunggu admin.
                            </p>
                        </div>
                        <div className="col-span-1 rounded-3xl bg-white dark:bg-zinc-900 p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                            <Box className="h-8 w-8 text-blue-600 dark:text-blue-500 mb-5" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Format Universal</h3>
                            <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                Mendukung ekosistem terpopuler: Laravel 11, React, Inertia, Tailwind CSS, serta desain Figma.
                            </p>
                        </div>
                        <div className="col-span-1 md:col-span-3 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden relative shadow-lg">
                            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between z-10 text-white">
                                <div className="max-w-xl">
                                    <Shield className="h-8 w-8 text-blue-200 mb-4" />
                                    <h3 className="text-2xl font-bold">Lisensi Jelas & Garansi Pembaruan</h3>
                                    <p className="mt-2 text-blue-100 text-sm leading-relaxed">
                                        Setiap pembelian mencakup hak unduh pembaruan minor di masa depan tanpa biaya langganan bulanan.
                                    </p>
                                </div>
                                <div className="mt-6 md:mt-0">
                                    <Link href="/register" className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-zinc-50 transition-colors">
                                        Daftar Akun Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Paling Diminati</span>
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
                                Kurasi Produk Unggulan
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 text-base mt-1">Aset digital terbaik yang paling banyak diunduh bulan ini.</p>
                        </div>
                        <Link href="/products" className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors group">
                            Lihat Semua Katalog <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {featuredProducts && featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product) => {
                                const lowestPrice = product.variations?.length > 0 
                                    ? Math.min(...product.variations.map(v => v.price)) 
                                    : 0;

                                return (
                                    <Link 
                                        key={product.id} 
                                        href={`/products/${product.slug}`} 
                                        className="group flex flex-col bg-zinc-50 dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 hover:shadow-md transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-4 border border-zinc-200/40 dark:border-zinc-800">
                                            {product.cover_image ? (
                                                <img src={`/storage/${product.cover_image}`} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-mono">NO IMAGE</div>
                                            )}

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
                                        <div className="flex flex-col flex-1 px-1">
                                            {product.reviews_count && product.reviews_count > 0 ? (
                                                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mb-1">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span>{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                                                    <span className="text-zinc-400 font-normal">({product.reviews_count})</span>
                                                </div>
                                            ) : null}
                                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">
                                                {product.category?.name || 'Aset Digital'}
                                            </span>
                                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {product.title}
                                            </h3>
                                            <div className="mt-auto pt-3 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800">
                                                <div>
                                                    <span className="text-[10px] text-zinc-400 block">Mulai dari</span>
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                                        Rp {new Intl.NumberFormat('id-ID').format(lowestPrice)}
                                                    </span>
                                                </div>
                                                <div className="h-7 w-7 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                            <p className="text-zinc-500 dark:text-zinc-400">Belum ada kurasi produk saat ini.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Digital Product FAQ Section */}
            <section className="py-20 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-3 border border-blue-200/50">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>Pertanyaan Umum</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Seputar Pembelian Produk Digital
                        </h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            Hal-hal yang sering ditanyakan sebelum melakukan transaksi.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div 
                                    key={idx} 
                                    className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
