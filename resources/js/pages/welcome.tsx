import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ArrowRight, Box, Zap, Shield, Sparkles } from 'lucide-react';

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

export default function Welcome({ featuredProducts }: { featuredProducts: Product[] }) {
    return (
        <GuestLayout>
            <Head title="Premium Digital Assets | Digital Insani" />
            
            {/* Hero Section (Split Layout) */}
            <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-24 pb-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                        <div className="sm:text-center md:mx-auto lg:col-span-6 lg:text-left">
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20 dark:text-blue-400 dark:ring-blue-400/20 mb-6">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Katalog Baru 2026 Tersedia
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                                Karya digital instan untuk <span className="text-blue-600 dark:text-blue-500">kreator modern.</span>
                            </h1>
                            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg sm:mx-auto lg:mx-0">
                                Tingkatkan produktivitas Anda tanpa kompromi kualitas. Unduh script, plugin, dan template UI/UX premium yang siap diintegrasikan dalam hitungan menit.
                            </p>
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                                <Link 
                                    href="/products" 
                                    className="group inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                                >
                                    Eksplorasi Katalog
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link 
                                    href="/articles" 
                                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800/50 transition-all"
                                >
                                    Baca Panduan
                                </Link>
                            </div>
                        </div>
                        
                        <div className="relative mt-16 sm:mt-24 lg:col-span-6 lg:mt-0">
                            <div className="relative mx-auto w-full max-w-lg lg:max-w-none rounded-2xl bg-zinc-900/5 ring-1 ring-zinc-900/10 p-2 dark:bg-white/5 dark:ring-white/10 backdrop-blur-2xl">
                                <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-zinc-900/10 dark:bg-zinc-900">
                                    <img src="/asset/logo-digital-insani.png" alt="Digital Insani Preview" className="w-full object-cover aspect-video opacity-90 p-12 object-contain bg-zinc-50 dark:bg-zinc-900" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dirancang untuk skala.</h2>
                        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Tidak ada lagi aset digital yang usang. Kami memastikan setiap produk diperbarui secara berkala.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-2 rounded-3xl bg-zinc-50 dark:bg-zinc-900 p-8 ring-1 ring-zinc-200 dark:ring-zinc-800">
                            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-500 mb-6" />
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Instan & Siap Pakai</h3>
                            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Begitu transaksi selesai, file langsung tersedia di dasbor Anda. Tanpa menunggu, tanpa proses manual.</p>
                        </div>
                        <div className="col-span-1 rounded-3xl bg-zinc-50 dark:bg-zinc-900 p-8 ring-1 ring-zinc-200 dark:ring-zinc-800">
                            <Box className="h-8 w-8 text-blue-600 dark:text-blue-500 mb-6" />
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Format Universal</h3>
                            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Mendukung platform populer seperti Figma, React, dan Laravel.</p>
                        </div>
                        <div className="col-span-1 md:col-span-3 rounded-3xl bg-blue-600 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between z-10">
                                <div className="max-w-xl">
                                    <Shield className="h-8 w-8 text-blue-200 mb-6" />
                                    <h3 className="text-2xl font-semibold text-white">Lisensi Aman & Pembaruan Gratis</h3>
                                    <p className="mt-2 text-blue-100">Satu kali pembelian memberikan Anda hak pembaruan minor secara gratis seumur hidup, tanpa biaya tersembunyi.</p>
                                </div>
                                <div className="mt-8 md:mt-0">
                                    <Link href="/register" className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-zinc-50 transition-colors">
                                        Bergabung Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
                                Kurasi Pilihan
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Aset digital terbaik yang paling banyak diunduh bulan ini.</p>
                        </div>
                        <Link href="/products" className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors group">
                            Lihat Semua <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {featuredProducts && featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product) => {
                                const lowestPrice = product.variations?.length > 0 
                                    ? Math.min(...product.variations.map(v => v.price)) 
                                    : 0;

                                return (
                                    <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col">
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-4 ring-1 ring-zinc-900/5 dark:ring-white/10">
                                            {product.cover_image ? (
                                                <img src={`/storage/${product.cover_image}`} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-mono">NO IMAGE</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {product.title}
                                            </h3>
                                            <div className="mt-auto pt-2">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                    Rp {new Intl.NumberFormat('id-ID').format(lowestPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-24 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <p className="text-zinc-500 dark:text-zinc-400">Belum ada kurasi produk saat ini.</p>
                        </div>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}
