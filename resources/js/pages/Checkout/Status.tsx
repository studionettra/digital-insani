import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import MemberLayout from '@/layouts/MemberLayout';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

export default function CheckoutStatus({ order, purchaseEvent }: { order: any, purchaseEvent?: boolean }) {
    const { auth } = usePage().props as any;
    const isGuest = !order.user_id;

    useEffect(() => {
        if (purchaseEvent && order.status === 'paid') {
            if (typeof window !== 'undefined' && (window as any).dataLayer) {
                (window as any).dataLayer.push({
                    event: 'purchase',
                    ecommerce: {
                        transaction_id: order.order_number,
                        value: order.total_amount,
                        currency: 'IDR',
                        items: order.items?.map((item: any) => ({
                            item_id: item.product.slug,
                            item_name: item.product.title,
                            price: item.price,
                            quantity: 1
                        })) || []
                    }
                });
            }
        }
    }, [purchaseEvent, order]);

    return (
        <MemberLayout>
            <Head title="Status Pesanan | Digital Insani" />
            
            <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"></div>

                    {order.status === 'paid' ? (
                        <>
                            <div className="mx-auto w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50 dark:ring-green-900/10">
                                <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">Pembayaran Berhasil!</h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                                Terima kasih telah berbelanja di Digital Insani. Pesanan <span className="font-semibold text-zinc-900 dark:text-zinc-300">#{order.order_number}</span> Anda telah lunas.
                            </p>

                            {/* Product List */}
                            <div className="mt-8 text-left space-y-4 max-w-lg mx-auto">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <div>
                                            <h4 className="font-semibold text-zinc-900 dark:text-white">{item.product?.title}</h4>
                                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{item.product_variation?.name}</span>
                                        </div>
                                        <a 
                                            href={`/orders/${order.id}/download/${item.id}?token=${order.access_token}`}
                                            className="inline-flex shrink-0 items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                                        >
                                            Download .ZIP
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {/* Next Steps Guide */}
                            <div className="mt-8 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 text-left max-w-lg mx-auto space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                                    Langkah Selanjutnya (Panduan Cepat)
                                </h4>
                                <ol className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 list-decimal list-inside">
                                    <li>Klik tombol <strong>Download .ZIP</strong> di atas untuk menyimpan berkas.</li>
                                    <li>Ekstrak arsip dan baca berkas <code>README.md</code> untuk instruksi instalasi dan konfigurasi.</li>
                                    <li>Salin nomor pesanan <strong>#{order.order_number}</strong> sebagai bukti lisensi Anda.</li>
                                </ol>
                            </div>
                        </>
                    ) : order.status === 'failed' ? (
                        <>
                            <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50 dark:ring-red-900/10">
                                <XCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">Pembayaran Gagal</h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                                Waktu pembayaran untuk pesanan <span className="font-semibold text-zinc-900 dark:text-zinc-300">#{order.order_number}</span> telah habis atau gagal diproses.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-yellow-50/50 dark:ring-yellow-900/10 animate-pulse">
                                <Clock className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">Menunggu Pembayaran</h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
                                Silakan selesaikan pembayaran untuk pesanan <span className="font-semibold text-zinc-900 dark:text-zinc-300">#{order.order_number}</span> Anda.
                            </p>
                            <div className="flex justify-center">
                                {order.payment_url && (
                                    <a
                                        href={order.payment_url}
                                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98] mb-4"
                                    >
                                        Bayar Sekarang
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                )}
                                {order.snap_token && !order.payment_url && (
                                    <button
                                        onClick={() => {
                                            if ((window as any).snap) {
                                                (window as any).snap.pay(order.snap_token);
                                            } else {
                                                alert('Midtrans Snap tidak dimuat.');
                                            }
                                        }}
                                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98] mb-4"
                                    >
                                        Bayar Sekarang
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                    
                    <div className="pt-8 mt-12 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-4 items-center justify-center">
                        {isGuest ? (
                            <div className="w-full max-w-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 text-center">
                                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-2">Buat Akun untuk Menyimpan Pesanan</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-600/80 mb-6">
                                    Pesanan ini belum tersimpan di akun manapun. Buat akun menggunakan email <strong>{order.customer_email}</strong> untuk menyimpan pesanan ini secara permanen agar Anda bisa mendownloadnya kapan saja.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-all active:scale-[0.98]"
                                    >
                                        Buat Akun Sekarang
                                    </Link>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all active:scale-[0.98]"
                                    >
                                        Kembali ke Beranda
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/member/dashboard"
                                className="inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 px-8 py-3 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98]"
                            >
                                Ke Dashboard Member
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
