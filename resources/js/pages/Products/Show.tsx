import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { FormEvent, useEffect, useState } from 'react';
import { 
    ArrowLeft, 
    ArrowRight,
    CheckCircle2, 
    ShieldCheck, 
    DownloadCloud, 
    Share2, 
    Link as LinkIcon, 
    MessageCircle, 
    Twitter, 
    Mail, 
    Facebook,
    FileText,
    History,
    Sliders,
    Zap,
    ExternalLink,
    Clock,
    Sparkles,
    ShoppingBag,
    Star,
    MessageSquare,
    Heart,
    BookOpen,
    Code2,
    Copy,
    Check,
    X,
} from 'lucide-react';
import { add } from '@/routes/cart';
import StarRating from '@/components/StarRating';
import { useWishlist } from '@/hooks/use-wishlist';
import CountdownTimer from '@/components/CountdownTimer';

type ProductVariation = {
    id: number;
    name: string;
    price: number;
};

type ProductUpdate = {
    id: number;
    version: string;
    changelog: string;
    html_changelog?: string;
    published_at: string;
};

type Product = {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string | null;
    demo_url?: string | null;
    preview_pdf?: string | null;
    code_snippet?: string | null;
    code_snippet_lang?: string | null;
    category: {
        name: string;
    };
    variations: ProductVariation[];
    updates?: ProductUpdate[];
};

type Review = {
    id: number;
    customer_name: string;
    rating: number;
    comment: string;
    is_verified_buyer: boolean;
    created_at: string;
};

type ReviewsStats = {
    average: number;
    count: number;
    breakdown: {
        [key: number]: number;
    };
};

type BundleProduct = {
    id: number;
    title: string;
    slug: string;
    cover_image: string | null;
    category?: { name: string };
    variations: Array<{ id: number; name: string; price: number }>;
};

type Bundle = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    discount_percentage: number;
    regular_price: number;
    discounted_price: number;
    savings_amount: number;
    products: BundleProduct[];
};

type Props = {
    product: Product;
    relatedProducts?: Product[];
    bundles?: Bundle[];
    reviews?: Review[];
    reviewsStats?: ReviewsStats;
    eligibleOrderItemId?: number | null;
};

export default function Show({ 
    product, 
    relatedProducts = [], 
    bundles = [],
    reviews = [], 
    reviewsStats, 
    eligibleOrderItemId 
}: Props) {
    const { site_settings } = usePage<any>().props;
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [isAddingBundle, setIsAddingBundle] = useState<number | null>(null);

    const handleAddBundle = (bundleId: number) => {
        setIsAddingBundle(bundleId);
        router.post('/cart/bundle', { bundle_id: bundleId }, {
            preserveScroll: true,
            onFinish: () => setIsAddingBundle(null),
        });
    };

    const { post, processing, data, setData } = useForm({
        product_id: product.id,
        product_variation_id: product.variations?.[0]?.id || '',
    });

    const {
        data: reviewData,
        setData: setReviewData,
        post: postReview,
        processing: reviewProcessing,
        reset: resetReview,
        errors: reviewErrors,
    } = useForm({
        order_item_id: eligibleOrderItemId || 0,
        rating: 5,
        comment: '',
    });

    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'updates' | 'reviews' | 'code'>('desc');
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [copied, setCopied] = useState(false);
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';

    const copyCodeToClipboard = () => {
        if (product.code_snippet) {
            navigator.clipboard.writeText(product.code_snippet);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2000);
        }
    };

    const handleReviewSubmit = (e: FormEvent) => {
        e.preventDefault();
        postReview('/reviews', {
            preserveScroll: true,
            onSuccess: () => {
                resetReview('comment');
            },
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'view_item',
                ecommerce: {
                    items: [{
                        item_id: product.slug,
                        item_name: product.title,
                        price: product.variations?.[0]?.price || 0,
                        item_category: product.category?.name || 'Uncategorized'
                    }]
                }
            });
        }
    }, [product]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(add.url());
    };

    const handleBuyNow = () => {
        setIsBuyingNow(true);
        router.post(add.url(), {
            product_id: product.id,
            product_variation_id: data.product_variation_id,
            buy_now: 1,
        }, {
            onFinish: () => setIsBuyingNow(false),
        });
    };

    const copyToClipboard = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(productUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(product.title + ' ' + productUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
        x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.title)}`,
        threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(product.title + ' ' + productUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(product.title)}&body=${encodeURIComponent('Lihat produk ini: ' + productUrl)}`,
    };

    const selectedVariation = product.variations?.find(v => v.id === Number(data.product_variation_id)) || product.variations?.[0];

    return (
        <GuestLayout>
            <Head title={`${product.title} | Digital Insani`} />
            
            <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    
                    {/* Breadcrumbs Back */}
                    <div className="flex items-center justify-between mb-8">
                        <Link 
                            href="/products" 
                            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Katalog
                        </Link>
                        <span className="text-xs text-zinc-400">
                            Kategori: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{product.category?.name || 'Aset Digital'}</strong>
                        </span>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 lg:items-start">
                        {/* Left Column: Product Visual & Tabbed Info */}
                        <div className="lg:col-span-8 mb-12 lg:mb-0">
                            {/* Main Preview Frame */}
                            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs mb-8 flex items-center justify-center p-2 sm:p-4 group">
                                {product.cover_image ? (
                                    <img 
                                        src={`/storage/${product.cover_image}`} 
                                        alt={product.title} 
                                        className="w-full h-auto max-h-[540px] rounded-2xl object-contain bg-zinc-50 dark:bg-zinc-950/40" 
                                    />
                                ) : (
                                    <div className="w-full aspect-[16/9] flex items-center justify-center text-zinc-400 dark:text-zinc-600 font-mono text-sm uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                                        No Image Preview
                                    </div>
                                )}

                                {/* Bottom Action Buttons Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
                                    <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                                        {product.preview_pdf && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPdfModal(true)}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white px-3.5 py-2 text-xs font-semibold backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                            >
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>Baca Cuplikan PDF</span>
                                            </button>
                                        )}
                                        {product.code_snippet && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveTab('code');
                                                    const tabElem = document.getElementById('product-tabs');
                                                    if (tabElem) tabElem.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-950 text-white dark:bg-zinc-800/90 dark:hover:bg-zinc-700 text-xs px-3.5 py-2 font-semibold backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                            >
                                                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Cuplikan Kode</span>
                                            </button>
                                        )}
                                    </div>

                                    {product.demo_url && (
                                        <a
                                            href={product.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-950 text-white dark:bg-white/95 dark:hover:bg-white dark:text-zinc-900 px-3.5 py-2 text-xs font-semibold backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 ml-auto"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
                                            <span>Lihat Live Demo</span>
                                        </a>
                                    )}
                                </div>

                                {/* Floating Wishlist Button */}
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        type="button"
                                        onClick={() => toggleWishlist(product.id, product.title)}
                                        className={`p-3 rounded-full backdrop-blur-md shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                                            isWishlisted(product.id)
                                                ? 'bg-rose-50/95 dark:bg-rose-950/90 text-rose-500 ring-2 ring-rose-300 dark:ring-rose-800'
                                                : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-400 hover:text-rose-500'
                                        }`}
                                        title={isWishlisted(product.id) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist Favorit'}
                                        aria-label="Wishlist"
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Structured Tabs Bar */}
                            <div id="product-tabs" className="border-b border-zinc-200 dark:border-zinc-800 mb-8 flex gap-6 overflow-x-auto scrollbar-none">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('desc')}
                                    className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                                        activeTab === 'desc'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    Deskripsi & Fitur
                                    {activeTab === 'desc' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('specs')}
                                    className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                                        activeTab === 'specs'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <Sliders className="w-4 h-4" />
                                    Spesifikasi & Berkas
                                    {activeTab === 'specs' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('updates')}
                                    className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                                        activeTab === 'updates'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <History className="w-4 h-4" />
                                    Riwayat Versi (Changelog)
                                    {product.updates && product.updates.length > 0 && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold">
                                            {product.updates.length}
                                        </span>
                                    )}
                                    {activeTab === 'updates' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('reviews')}
                                    className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                                        activeTab === 'reviews'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <Star className="w-4 h-4" />
                                    Ulasan Pembeli
                                    {reviewsStats && reviewsStats.count > 0 && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold">
                                            {reviewsStats.count}
                                        </span>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                    )}
                                </button>

                                {product.code_snippet && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('code')}
                                        className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                                            activeTab === 'code'
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                                        }`}
                                    >
                                        <Code2 className="w-4 h-4 text-emerald-500" />
                                        Cuplikan Kode & Sandbox
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold uppercase">
                                            {product.code_snippet_lang || 'Code'}
                                        </span>
                                        {activeTab === 'code' && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Tab 1: Description Content */}
                            {activeTab === 'desc' && (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        Ikhtisar Produk
                                    </h2>
                                    <div 
                                        className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 text-base leading-relaxed" 
                                        dangerouslySetInnerHTML={{ __html: product.description || '<p>Tidak ada rincian deskripsi tambahan.</p>' }} 
                                    />
                                </div>
                            )}

                            {/* Tab 2: Specifications & Deliverables */}
                            {activeTab === 'specs' && (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6">
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                                        Spesifikasi & Yang Anda Dapatkan
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800">
                                            <span className="text-xs text-zinc-400 block mb-1">Format Pengiriman</span>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                Akses Unduhan Instan (.ZIP / File Sumber)
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800">
                                            <span className="text-xs text-zinc-400 block mb-1">Kategori Produk</span>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                {product.category?.name || 'Aset Digital'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800">
                                            <span className="text-xs text-zinc-400 block mb-1">Pembaruan Versi</span>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                Gratis Pembaruan Minor Seumur Hidup
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800">
                                            <span className="text-xs text-zinc-400 block mb-1">Hak Penggunaan</span>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                Sesuai Lisensi Varian yang Dipilih
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 space-y-2">
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            Jaminan Keaslian Berkas
                                        </h4>
                                        <p>
                                            Seluruh file diperiksa sebelum diunggah ke server kami. Anda mendapatkan source code lengkap yang dapat dikembangkan lebih lanjut tanpa enkripsi yang membatasi.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Tab 3: Changelog Timeline */}
                            {activeTab === 'updates' && (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                                        Riwayat Pembaruan & Catatan Rilis
                                    </h2>

                                    {product.updates && product.updates.length > 0 ? (
                                        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                                            {product.updates.map((update) => (
                                                <div key={update.id} className="relative pl-9 group">
                                                    <div className="absolute left-2 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-blue-600 border-4 border-white dark:border-zinc-900 ring-2 ring-blue-600/20" />
                                                    
                                                    <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                            <span className="inline-flex items-center rounded-lg bg-blue-600 text-white px-2.5 py-0.5 text-xs font-bold font-mono">
                                                                {update.version}
                                                            </span>
                                                            {update.published_at && (
                                                                <span className="text-xs text-zinc-400 flex items-center gap-1">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    {new Date(update.published_at).toLocaleDateString('id-ID', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div 
                                                            className="prose prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-300 mt-2"
                                                            dangerouslySetInnerHTML={{ __html: update.html_changelog || update.changelog }} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                                            <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm font-medium">Ini merupakan rilis stabil versi awal.</p>
                                            <p className="text-xs mt-1">Pembaruan di masa mendatang akan dicatat di sini secara transparan.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab 4: Reviews Content */}
                            {activeTab === 'reviews' && (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                                            Ulasan & Rating Pembeli
                                        </h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Pengalaman nyata dari pelanggan yang telah membeli produk ini.
                                        </p>
                                    </div>

                                    {/* Score & Breakdown Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
                                        {/* Big Score */}
                                        <div className="md:col-span-4 text-center md:border-r border-zinc-200 dark:border-zinc-700/60 md:pr-6">
                                            <div className="text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                                                {reviewsStats?.average ? reviewsStats.average.toFixed(1) : '0.0'}
                                            </div>
                                            <div className="mt-2 flex justify-center">
                                                <StarRating rating={reviewsStats?.average || 0} size="md" />
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                                                Berdasarkan {reviewsStats?.count || 0} ulasan
                                            </p>
                                            <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 text-[11px] font-semibold text-green-700 dark:text-green-300">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                100% Pembeli Terverifikasi
                                            </div>
                                        </div>

                                        {/* Rating Breakdown Bars */}
                                        <div className="md:col-span-8 space-y-2">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = reviewsStats?.breakdown?.[star] || 0;
                                                const total = reviewsStats?.count || 0;
                                                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                                                return (
                                                    <div key={star} className="flex items-center gap-3 text-xs">
                                                        <span className="w-8 font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                                                            {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                                                        </span>
                                                        <div className="flex-1 h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-12 text-right text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                                                            {count} ({percentage}%)
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Submit Review Box (If Eligible) */}
                                    {eligibleOrderItemId && (
                                        <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                                            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                                                Tulis Ulasan Anda
                                            </h3>
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                                                Bagikan pengalaman Anda menggunakan template/aset ini untuk membantu calon pembeli lainnya.
                                            </p>

                                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                                                        Pilih Rating
                                                    </label>
                                                    <StarRating
                                                        rating={reviewData.rating}
                                                        size="lg"
                                                        interactive
                                                        onChange={(r) => setReviewData('rating', r)}
                                                    />
                                                    {reviewErrors.rating && (
                                                        <p className="text-red-500 text-xs mt-1">{reviewErrors.rating}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                                                        Komentar Ulasan
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={reviewData.comment}
                                                        onChange={(e) => setReviewData('comment', e.target.value)}
                                                        placeholder="Apa yang paling Anda sukai dari produk ini? Ceritakan kemudahan penggunaannya..."
                                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                    {reviewErrors.comment && (
                                                        <p className="text-red-500 text-xs mt-1">{reviewErrors.comment}</p>
                                                    )}
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={reviewProcessing}
                                                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
                                                >
                                                    {reviewProcessing ? 'Mengirim Ulasan...' : 'Kirim Ulasan Sekarang'}
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                                            Semua Ulasan ({reviews?.length || 0})
                                        </h3>

                                        {reviews && reviews.length > 0 ? (
                                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                                {reviews.map((rev) => (
                                                    <div key={rev.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                                                                    {rev.customer_name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                                                            {rev.customer_name}
                                                                        </span>
                                                                        {rev.is_verified_buyer && (
                                                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                                                                                <CheckCircle2 className="w-3 h-3" />
                                                                                Terverifikasi
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-zinc-400">
                                                                {new Date(rev.created_at).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })}
                                                            </span>
                                                        </div>

                                                        <StarRating rating={rev.rating} size="sm" />

                                                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                                                            {rev.comment}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-zinc-400">
                                                <Star className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
                                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    Belum ada ulasan untuk produk ini
                                                </p>
                                                <p className="text-xs text-zinc-400 mt-1">
                                                    Jadilah pembeli pertama yang memberikan ulasan setelah menyelesaikan transaksi!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tab 5: Code Snippet & Sandbox */}
                            {activeTab === 'code' && product.code_snippet && (
                                <div className="bg-zinc-950 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
                                    {/* Terminal Header */}
                                    <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 border-b border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                            <span className="ml-2 font-mono text-xs text-zinc-400 font-medium">
                                                preview.{product.code_snippet_lang || 'txt'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-mono text-emerald-400/90 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                                                {product.code_snippet_lang || 'Code'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={copyCodeToClipboard}
                                                className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer font-medium"
                                                title="Salin kode ke clipboard"
                                            >
                                                {codeCopied ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span className="text-emerald-400 font-semibold">Tersalin!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span>Salin Kode</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Code Content */}
                                    <div className="p-5 sm:p-6 overflow-x-auto text-sm font-mono text-zinc-200 leading-relaxed bg-zinc-950/95 max-h-[520px]">
                                        <pre className="selection:bg-blue-600/40 selection:text-white">
                                            <code>{product.code_snippet}</code>
                                        </pre>
                                    </div>

                                    {/* Sandbox Footer Info */}
                                    <div className="p-4 bg-zinc-900/60 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                                        <p className="flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                            Struktur & cuplikan kode sumber yang disertakan pada produk ini.
                                        </p>
                                        {product.demo_url && (
                                            <a
                                                href={product.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                                            >
                                                Coba Demo Aplikasi Lengkap <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Sering Dibeli Bersama / Bundle Hemat Section */}
                            {bundles && bundles.length > 0 && (
                                <div className="mt-12 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-6 rounded-full bg-blue-600" />
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                            Paket Bundle Hemat
                                        </h2>
                                    </div>
                                    {bundles.map((bundle) => (
                                        <div 
                                            key={bundle.id}
                                            className="rounded-3xl bg-gradient-to-br from-white to-blue-50/40 dark:from-zinc-900 dark:to-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 p-6 sm:p-8 shadow-xs relative overflow-hidden"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs mb-2">
                                                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                                        <span>Hemat {bundle.discount_percentage}%</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                                        {bundle.name}
                                                    </h3>
                                                    {bundle.description && (
                                                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                                            {bundle.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Items Row & Pricing CTA */}
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                                                <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 overflow-x-auto pb-2">
                                                    {bundle.products.map((item, idx) => (
                                                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                                            <Link 
                                                                href={`/products/${item.slug}`}
                                                                className="group/item flex items-center sm:flex-col gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-blue-500 transition-all shadow-xs w-full sm:w-36 text-center"
                                                            >
                                                                <div className="w-16 h-14 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0">
                                                                    {item.cover_image ? (
                                                                        <img src={`/storage/${item.cover_image}`} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-mono">NO IMAGE</div>
                                                                    )}
                                                                </div>
                                                                <div className="text-left sm:text-center flex-1">
                                                                    <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-tight">
                                                                        {item.title}
                                                                    </h4>
                                                                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                                                                        Rp {new Intl.NumberFormat('id-ID').format(item.variations?.[0]?.price || 0)}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                            {idx < bundle.products.length - 1 && (
                                                                <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold text-base shrink-0">
                                                                    +
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
                                                    <div className="space-y-0.5">
                                                        <span className="text-[11px] text-zinc-400 block font-medium">Harga Normal:</span>
                                                        <span className="text-xs text-zinc-400 line-through">
                                                            Rp {new Intl.NumberFormat('id-ID').format(bundle.regular_price)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                                                            Hemat Rp {new Intl.NumberFormat('id-ID').format(bundle.savings_amount)}
                                                        </span>
                                                        <span className="text-2xl font-black text-zinc-900 dark:text-white">
                                                            Rp {new Intl.NumberFormat('id-ID').format(bundle.discounted_price)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddBundle(bundle.id)}
                                                        disabled={isAddingBundle === bundle.id}
                                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 shadow-md transition-all active:scale-[0.98] disabled:opacity-75 cursor-pointer"
                                                    >
                                                        <ShoppingBag className="w-4 h-4" />
                                                        <span>{isAddingBundle === bundle.id ? 'Menambahkan...' : 'Beli Paket Sekaligus'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Checkout Card, Variation Selector & Trust Signals (Sticky) */}
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs border border-zinc-200/80 dark:border-zinc-800">
                                <div className="mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-600/10">
                                            {product.category?.name || 'Aset Digital'}
                                        </span>
                                        {site_settings?.flash_sale?.is_active && site_settings?.flash_sale?.ends_at && (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs">
                                                <CountdownTimer targetDate={site_settings.flash_sale.ends_at} variant="compact" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Star Rating Badge */}
                                    <div className="mb-2">
                                        {reviewsStats && reviewsStats.count > 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveTab('reviews');
                                                    window.scrollTo({ top: 400, behavior: 'smooth' });
                                                }}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-pointer"
                                            >
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                <span className="font-bold text-zinc-900 dark:text-white">{reviewsStats.average.toFixed(1)}</span>
                                                <span className="text-zinc-400">({reviewsStats.count} ulasan)</span>
                                                <span className="text-blue-600 dark:text-blue-400 group-hover:underline ml-1">Lihat Ulasan &rarr;</span>
                                            </button>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                                                <Star className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
                                                <span>Belum ada ulasan</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug mb-4">
                                        {product.title}
                                    </h1>
                                    
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                                            Rp {new Intl.NumberFormat('id-ID').format(selectedVariation?.price || 0)}
                                        </span>
                                        <span className="text-xs text-zinc-400">/ lisensi</span>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    {product.variations && product.variations.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
                                                Pilih Lisensi / Varian
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                {product.variations.map(variation => (
                                                    <label 
                                                        key={variation.id}
                                                        className={`relative flex cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 ${
                                                            Number(data.product_variation_id) === variation.id 
                                                                ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-1 ring-blue-600' 
                                                                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="product_variation_id"
                                                            value={variation.id}
                                                            checked={Number(data.product_variation_id) === variation.id}
                                                            onChange={e => setData('product_variation_id', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex flex-col flex-1">
                                                            <div className="flex justify-between items-center mb-0.5">
                                                                <span className={`text-sm font-semibold ${Number(data.product_variation_id) === variation.id ? 'text-blue-900 dark:text-blue-200' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                                    {variation.name}
                                                                </span>
                                                                <span className={`text-sm font-bold ${Number(data.product_variation_id) === variation.id ? 'text-blue-700 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                                    Rp {new Intl.NumberFormat('id-ID').format(variation.price)}
                                                                </span>
                                                            </div>
                                                            {Number(data.product_variation_id) === variation.id && (
                                                                <div className="flex items-center text-blue-600 dark:text-blue-400 text-[11px] font-medium mt-0.5">
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                    Lisensi Aktif
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons: Add to Cart & Direct Checkout */}
                                    <div className="space-y-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleBuyNow}
                                            disabled={isBuyingNow || processing}
                                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 focus-visible:outline-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <Zap className="w-4 h-4 fill-white" />
                                            {isBuyingNow ? 'Memproses Beli...' : 'Beli Langsung Sekarang'}
                                        </button>

                                        <div className={`grid ${product.demo_url ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
                                            <button
                                                type="submit"
                                                disabled={processing || isBuyingNow}
                                                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                {processing ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                                            </button>

                                            {product.demo_url && (
                                                <a
                                                    href={product.demo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/40 px-4 py-3 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-all active:scale-[0.98]"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>

                                        {/* Wishlist Button */}
                                        <button
                                            type="button"
                                            onClick={() => toggleWishlist(product.id, product.title)}
                                            className={`w-full flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                                                isWishlisted(product.id)
                                                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                                                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-rose-500'
                                            }`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                                            <span>{isWishlisted(product.id) ? 'Tersimpan di Wishlist' : 'Simpan ke Wishlist Favorit'}</span>
                                        </button>

                                        {/* In-App Preview / Sample Shortcuts */}
                                        {(product.preview_pdf || product.code_snippet) && (
                                            <div className="pt-2">
                                                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                                                        Cuplikan & Pratinjau Gratis
                                                    </span>
                                                    <div className="flex flex-col gap-1.5">
                                                        {product.preview_pdf && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPdfModal(true)}
                                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-850 transition-all cursor-pointer group"
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <BookOpen className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                                                                    Baca Sampel PDF (Free)
                                                                </span>
                                                                <span className="text-[10px] bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                                                                    Preview
                                                                </span>
                                                            </button>
                                                        )}
                                                        {product.code_snippet && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveTab('code');
                                                                    const el = document.getElementById('product-tabs');
                                                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                                }}
                                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-850 transition-all cursor-pointer group"
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <Code2 className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                                                                    Cuplikan Kode & Sandbox
                                                                </span>
                                                                <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">
                                                                    {product.code_snippet_lang || 'Code'}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>

                                {/* Trust Signals Checklist */}
                                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                                    <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-300">
                                        <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2.5 shrink-0" />
                                        <span>Pengiriman berkas otomatis & instan</span>
                                    </div>
                                    <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-300">
                                        <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 mr-2.5 shrink-0" />
                                        <span>File bersih, bebas malware & terverifikasi</span>
                                    </div>
                                    <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-300">
                                        <DownloadCloud className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2.5 shrink-0" />
                                        <span>Download ulang kapan saja melalui dasbor</span>
                                    </div>
                                </div>
                                
                                {/* Social Share */}
                                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                                        Bagikan Produk
                                    </h4>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors" title="WhatsApp">
                                            <MessageCircle className="h-3.5 w-3.5" />
                                        </a>
                                        <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors" title="Telegram">
                                            <Share2 className="h-3.5 w-3.5" />
                                        </a>
                                        <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/10 text-zinc-900 dark:bg-zinc-100/10 dark:text-zinc-100 hover:bg-zinc-900/20 transition-colors" title="X (Twitter)">
                                            <Twitter className="h-3.5 w-3.5" />
                                        </a>
                                        <button 
                                            type="button"
                                            onClick={copyToClipboard}
                                            className={`inline-flex h-8 px-2.5 items-center justify-center rounded-full border text-xs font-medium transition-colors ${copied ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'}`}
                                            title="Salin Link"
                                        >
                                            {copied ? (
                                                <><CheckCircle2 className="h-3 w-3 mr-1 text-green-600" /> Tersalin</>
                                            ) : (
                                                <><LinkIcon className="h-3 w-3 mr-1" /> Salin Link</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Related Products */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-20 pt-12 border-t border-zinc-200/80 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                        Produk Terkait
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        Aset digital lainnya dalam kategori yang sama.
                                    </p>
                                </div>
                                <Link 
                                    href="/products" 
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedProducts.map((relProduct) => {
                                    const lowestPrice = relProduct.variations?.length > 0 
                                        ? Math.min(...relProduct.variations.map(v => v.price)) 
                                        : 0;

                                    return (
                                        <Link 
                                            key={relProduct.id} 
                                            href={`/products/${relProduct.slug}`}
                                            className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                                                {relProduct.cover_image ? (
                                                    <img 
                                                        src={`/storage/${relProduct.cover_image}`} 
                                                        alt={relProduct.title} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-mono">
                                                        NO IMAGE
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-base text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                                                {relProduct.title}
                                            </h4>
                                            <div className="mt-auto pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                                    Rp {new Intl.NumberFormat('id-ID').format(lowestPrice)}
                                                </span>
                                                <span className="text-xs text-blue-600 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    Detail <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Interactive PDF Preview Modal */}
            {showPdfModal && product.preview_pdf && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
                    <div 
                        className="fixed inset-0" 
                        onClick={() => setShowPdfModal(false)} 
                    />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                                        Cuplikan Sampel: {product.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Pratinjau cuplikan halaman sebelum memutuskan untuk membeli.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`/storage/${product.preview_pdf}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors"
                                    title="Buka PDF di tab baru browser"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Buka di Tab Baru</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setShowPdfModal(false)}
                                    className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                                    aria-label="Tutup Pratinjau"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: PDF Viewer Iframe */}
                        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-2 sm:p-4 overflow-hidden flex flex-col">
                            <iframe
                                src={`/storage/${product.preview_pdf}#toolbar=0`}
                                className="w-full flex-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white shadow-inner"
                                title={`Preview PDF - ${product.title}`}
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Format PDF lengkap beresolusi tinggi akan dikirimkan otomatis setelah transaksi selesai.
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPdfModal(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPdfModal(false);
                                        handleBuyNow();
                                    }}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all active:scale-95 cursor-pointer"
                                >
                                    <Zap className="w-3.5 h-3.5 fill-white" />
                                    Beli Versi Lengkap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
