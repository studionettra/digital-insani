import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/MemberLayout';
import { ChevronLeft, Download, FileText } from 'lucide-react';

type OrderItem = {
    id: number;
    price: number;
    quantity: number;
    product: {
        id: number;
        title: string;
        slug: string;
        cover_image: string | null;
    };
};

type Order = {
    id: number;
    order_number: string;
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    status: string;
    created_at: string;
    paid_at: string | null;
    user: {
        name: string;
        email: string;
        phone: string;
    } | null;
    items: OrderItem[];
};

export default function OrderShow({ order }: { order: Order }) {
    return (
        <MemberLayout>
            <Head title={`Pesanan ${order.order_number} | Digital Insani`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Link href="/member/orders" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Kembali ke Riwayat Pesanan
                        </Link>

                        {order.status === 'paid' && (
                            <a 
                                href={`/member/orders/${order.id}/invoice`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice PDF
                            </a>
                        )}
                    </div>

                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-zinc-400" />
                                    Pesanan {order.order_number}
                                </h1>
                                <p className="text-zinc-500 text-sm mt-1">
                                    Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize shadow-sm
                                    ${order.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30' : 
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30' : 
                                    'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30'}`}>
                                    {order.status === 'paid' ? 'Lunas' : order.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">Informasi Pelanggan</h3>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-200">{order.user?.name || '-'}</p>
                                    <p>{order.user?.email || '-'}</p>
                                    <p>{order.user?.phone || '-'}</p>
                                </div>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">Informasi Pembayaran</h3>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                    <p>Metode Pembayaran: <span className="font-medium text-zinc-900 dark:text-zinc-200">Payment Gateway (Xendit)</span></p>
                                    {order.paid_at && (
                                        <p>Tanggal Lunas: <span className="font-medium text-zinc-900 dark:text-zinc-200">{new Date(order.paid_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Daftar Produk</h3>
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-8">
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {order.items.map(item => (
                                    <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                                                {item.product.cover_image ? (
                                                    <img src={`/storage/${item.product.cover_image}`} alt={item.product.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">IMG</div>
                                                )}
                                            </div>
                                            <div>
                                                <Link href={`/products/${item.product.slug}`} className="font-medium text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base">
                                                    {item.product.title}
                                                </Link>
                                                {order.status === 'paid' && (
                                                    <div className="mt-2">
                                                        <Link href={`/member/products/${item.product.id}`} className="text-xs text-blue-600 hover:underline">Lihat & Download Produk</Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-end border-t border-zinc-200 dark:border-zinc-800 pt-6">
                            <div className="w-full sm:w-1/2 md:w-1/3 space-y-3">
                                <div className="flex justify-between text-sm text-zinc-500">
                                    <span>Subtotal</span>
                                    <span>Rp {new Intl.NumberFormat('id-ID').format(order.subtotal)}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                                        <span>Diskon</span>
                                        <span>- Rp {new Intl.NumberFormat('id-ID').format(order.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg text-zinc-900 dark:text-white pt-3 border-t border-zinc-200 dark:border-zinc-800">
                                    <span>Total</span>
                                    <span>Rp {new Intl.NumberFormat('id-ID').format(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </MemberLayout>
    );
}
