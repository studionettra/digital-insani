import { Head, useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, DownloadCloud, Copy, Share2, Link as LinkIcon, MessageCircle, Twitter, Mail, Facebook } from 'lucide-react';
import { add } from '@/routes/cart';

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

export default function Show({ product }: { product: Product }) {
    const { post, processing, data, setData } = useForm({
        product_id: product.id,
        product_variation_id: product.variations?.[0]?.id || '',
    });

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

    return (
        <GuestLayout>
            <Head title={`${product.title} | Digital Insani`} />
            
            <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    
                    <Link href="/products" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Katalog
                    </Link>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-start">
                        {/* Left: Product Image & Description */}
                        <div className="lg:col-span-8 mb-12 lg:mb-0">
                            <div className="relative rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm mb-10 flex items-center justify-center">
                                {product.cover_image ? (
                                    <img src={`/storage/${product.cover_image}`} alt={product.title} className="w-full h-auto max-h-[600px] object-contain" />
                                ) : (
                                    <div className="w-full aspect-[16/9] flex items-center justify-center text-zinc-400 dark:text-zinc-600 font-mono text-sm uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900">
                                        No Image
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Deskripsi Produk</h2>
                                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        </div>

                        {/* Right: Product Info, CTA, Trust & Share (Sticky) */}
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                                <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4 ring-1 ring-inset ring-blue-600/10">
                                        {product.category?.name || 'Kategori'}
                                    </span>
                                    
                                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.2] mb-4">
                                        {product.title}
                                    </h1>
                                    
                                    <div className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                                        Rp {new Intl.NumberFormat('id-ID').format(
                                            product.variations?.find(v => v.id === Number(data.product_variation_id))?.price || 0
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={submit}>
                                    {product.variations && product.variations.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider">Pilih Lisensi / Varian</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {product.variations.map(variation => (
                                                    <label 
                                                        key={variation.id}
                                                        className={`relative flex cursor-pointer rounded-2xl border p-4 shadow-sm transition-all duration-200 focus:outline-none ${
                                                            Number(data.product_variation_id) === variation.id 
                                                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-600' 
                                                                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
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
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className={`block text-sm font-semibold ${Number(data.product_variation_id) === variation.id ? 'text-blue-900 dark:text-blue-100' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                                    {variation.name}
                                                                </span>
                                                                <span className={`block text-sm font-semibold ${Number(data.product_variation_id) === variation.id ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                                    Rp {new Intl.NumberFormat('id-ID').format(variation.price)}
                                                                </span>
                                                            </div>
                                                            {Number(data.product_variation_id) === variation.id && (
                                                                <div className="flex items-center text-blue-600 dark:text-blue-400 mt-1 text-xs font-medium">
                                                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                                                    Terpilih
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-100 px-6 py-4 text-base font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Memproses...' : 'Tambah ke Keranjang'}
                                    </button>
                                </form>

                                {/* Trust Signals */}
                                <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 gap-4">
                                    <div className="flex items-start">
                                        <DownloadCloud className="h-5 w-5 text-zinc-400 mr-3 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Akses Instan</h4>
                                            <p className="text-xs text-zinc-500 mt-1">Unduh langsung setelah pembayaran terverifikasi.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <ShieldCheck className="h-5 w-5 text-zinc-400 mr-3 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Bebas Virus</h4>
                                            <p className="text-xs text-zinc-500 mt-1">File dipindai & 100% aman digunakan.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Social Share */}
                                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                    <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">Bagikan Produk Ini</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors" title="Bagikan ke WhatsApp">
                                            <MessageCircle className="h-4 w-4" />
                                        </a>
                                        <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors" title="Bagikan ke Telegram">
                                            <Share2 className="h-4 w-4" /> {/* Fallback icon for telegram since standard lucide doesn't have it easily */}
                                        </a>
                                        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors" title="Bagikan ke Facebook">
                                            <Facebook className="h-4 w-4" />
                                        </a>
                                        <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/10 text-zinc-900 dark:bg-zinc-100/10 dark:text-zinc-100 hover:bg-zinc-900/20 dark:hover:bg-zinc-100/20 transition-colors" title="Bagikan ke X (Twitter)">
                                            <Twitter className="h-4 w-4" />
                                        </a>
                                        <a href={shareLinks.threads} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors" title="Bagikan ke Threads">
                                            <span className="font-bold text-xs">@</span>
                                        </a>
                                        <a href={shareLinks.email} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200/50 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors" title="Bagikan via Email">
                                            <Mail className="h-4 w-4" />
                                        </a>
                                        
                                        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center"></div>
                                        
                                        <button 
                                            onClick={copyToClipboard}
                                            className={`inline-flex h-9 px-3 items-center justify-center rounded-full border text-xs font-medium transition-colors ${copied ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                                            title="Salin Tautan"
                                        >
                                            {copied ? (
                                                <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Tersalin</>
                                            ) : (
                                                <><LinkIcon className="h-3.5 w-3.5 mr-1.5" /> Salin Link</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
