import { Head, useForm, Link, router } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { FormEvent, useEffect, useState } from 'react';
import { 
    ArrowLeft, 
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
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import { add } from '@/routes/cart';

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
    category: {
        name: string;
    };
    variations: ProductVariation[];
    updates?: ProductUpdate[];
};

type Props = {
    product: Product;
    relatedProducts?: Product[];
};

export default function Show({ product, relatedProducts = [] }: Props) {
    const { post, processing, data, setData } = useForm({
        product_id: product.id,
        product_variation_id: product.variations?.[0]?.id || '',
    });

    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'updates'>('desc');
    const [copied, setCopied] = useState(false);
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';

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

                                {product.demo_url && (
                                    <a
                                        href={product.demo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-zinc-900/90 hover:bg-zinc-950 text-white dark:bg-white/95 dark:hover:bg-white dark:text-zinc-900 px-4 py-2.5 text-xs font-semibold backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 z-10"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
                                        <span>Lihat Live Demo</span>
                                    </a>
                                )}
                            </div>
                            
                            {/* Structured Tabs Bar */}
                            <div className="border-b border-zinc-200 dark:border-zinc-800 mb-8 flex gap-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('desc')}
                                    className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
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
                                    className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
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
                                    className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
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
                        </div>

                        {/* Right Column: Checkout Card, Variation Selector & Trust Signals (Sticky) */}
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs border border-zinc-200/80 dark:border-zinc-800">
                                <div className="mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 ring-1 ring-inset ring-blue-600/10">
                                        {product.category?.name || 'Aset Digital'}
                                    </span>
                                    
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
        </GuestLayout>
    );
}
