import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Package, Clock, ArrowRight, Download, Image as ImageIcon, ExternalLink } from 'lucide-react';

type ProductVariation = {
    id: number;
    name: string;
    delivery_type: string;
    file_url: string | null;
    file_path: string | null;
};

type OrderItem = {
    id: number;
    price: number;
    product: {
        id: number;
        title: string;
        slug: string;
        cover_image: string | null;
    };
    productVariation: ProductVariation;
};

type Order = {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: OrderItem[];
};

type Entitlement = {
    id: number;
    product: {
        id: number;
        title: string;
        slug: string;
        cover_image: string | null;
    };
    productVariation: ProductVariation;
};

type Stats = {
    total_orders: number;
    total_products: number;
    latest_order: Order | null;
};

export default function Dashboard({ recentOrders, recentEntitlements, stats }: { recentOrders: Order[], recentEntitlements: Entitlement[], stats: Stats }) {
    return (
        <>
            <Head title="Dashboard | Digital Insani" />

            <div className="py-10 md:py-16">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">
                            Overview
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                            Kelola produk digital Anda, pantau riwayat transaksi, dan unduh file terbaru di satu tempat terpusat.
                        </p>
                    </div>

                    {/* Bento Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <div className="bento-card p-6 flex flex-col justify-between group">
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <h3 className="text-zinc-500 dark:text-zinc-400 font-medium">Total Pesanan</h3>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                                </div>
                            </div>
                            <p className="text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-white relative z-10">
                                {stats.total_orders}
                            </p>
                        </div>
                        
                        <div className="bento-card p-6 flex flex-col justify-between group">
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <h3 className="text-zinc-500 dark:text-zinc-400 font-medium">Produk Aktif</h3>
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <Package className="w-6 h-6 stroke-[1.5]" />
                                </div>
                            </div>
                            <p className="text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-white relative z-10">
                                {stats.total_products}
                            </p>
                        </div>
                        
                        <div className="bg-primary rounded-3xl p-6 shadow-md shadow-primary/20 text-primary-foreground flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 ease-out">
                                <Clock className="w-32 h-32 stroke-1" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-primary-foreground/80 font-medium mb-6">Status Terakhir</h3>
                                {stats.latest_order ? (
                                    <>
                                        <p className="text-2xl font-medium tracking-tight mb-3">
                                            {stats.latest_order.order_number}
                                        </p>
                                        <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-sm font-medium capitalize border border-white/10 shadow-sm">
                                            {stats.latest_order.status}
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-xl font-medium opacity-90">Belum ada pesanan</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products / Entitlements List */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Produk Anda</h2>
                        </div>

                        {recentEntitlements.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recentEntitlements.map(entitlement => (
                                    <div key={entitlement.id} className="bento-card overflow-hidden group flex flex-col p-2">
                                        <div className="aspect-[4/3] rounded-2xl bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                                            {entitlement.product.cover_image ? (
                                                <img src={`/storage/${entitlement.product.cover_image}`} alt={entitlement.product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full">
                                                    <ImageIcon className="w-8 h-8 text-zinc-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl pointer-events-none"></div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1 mt-2">
                                            <h3 className="font-semibold text-lg text-zinc-900 dark:text-white line-clamp-1 mb-1">
                                                {entitlement.product.title}
                                            </h3>
                                            <p className="text-sm text-zinc-500 mb-6">
                                                {entitlement.productVariation?.name}
                                            </p>
                                            
                                            <div className="mt-auto">
                                                <a 
                                                    href={`/member/download/${entitlement.id}`} 
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 transition-all duration-200"
                                                >
                                                    {entitlement.productVariation?.delivery_type === 'url' ? (
                                                        <><ExternalLink className="w-4 h-4 mr-2" /> Buka Akses</>
                                                    ) : (
                                                        <><Download className="w-4 h-4 mr-2" /> Unduh File</>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6 border-none ring-1 ring-border rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50 bento-card">
                                <p className="text-zinc-500 dark:text-zinc-400">Belum ada produk yang Anda miliki.</p>
                            </div>
                        )}
                    </div>

                    {/* Orders List */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Transaksi Terbaru</h2>
                            {recentOrders.length > 0 && (
                                <Link href="/member/orders" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline inline-flex items-center">
                                    Lihat Semua <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            )}
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="space-y-6">
                                {recentOrders.map(order => (
                                    <div key={order.id} className="bento-card overflow-hidden">
                                        
                                        {/* Order Header */}
                                        <div className="bg-zinc-50/80 dark:bg-zinc-800/30 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Tanggal</span>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                                        {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block w-px h-8 bg-zinc-200 dark:bg-zinc-700"></div>
                                                <div>
                                                    <span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Total</span>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                                        Rp {new Intl.NumberFormat('id-ID').format(order.total_amount)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                <span className="text-sm font-mono text-zinc-500 hidden md:block">
                                                    #{order.order_number}
                                                </span>
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide border
                                                    ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' : 
                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' : 
                                                    'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-900/50'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                        order.status === 'paid' ? 'bg-emerald-500' : 
                                                        order.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}></span>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="divide-y divide-border">
                                            {order.items.map(item => (
                                                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                                    <div className="flex items-start sm:items-center gap-5 w-full sm:w-auto">
                                                        <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 ring-1 ring-border flex items-center justify-center">
                                                            {item.product.cover_image ? (
                                                                <img src={`/storage/${item.product.cover_image}`} alt={item.product.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon className="w-6 h-6 text-zinc-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Link href={`/products/${item.product.slug}`} className="text-lg font-medium text-zinc-900 dark:text-zinc-100 hover:text-primary transition-colors line-clamp-1">
                                                                {item.product.title}
                                                            </Link>
                                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                                                {item.productVariation?.name} &bull; Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 px-6 bento-card shadow-sm flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-primary/20">
                                    <ShoppingBag className="w-10 h-10 text-primary stroke-[1.5]" />
                                </div>
                                <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">Belum ada riwayat pesanan</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 text-lg">
                                    Jelajahi berbagai produk digital premium kami dan mulai bangun koleksi Anda hari ini.
                                </p>
                                <Link 
                                    href="/products" 
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                >
                                    Jelajahi Katalog Produk <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
