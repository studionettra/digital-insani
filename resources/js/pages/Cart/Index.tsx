import { Head, Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { FormEvent, useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Ticket, Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { store as checkoutStore } from '@/routes/checkout';
import { remove as cartRemove } from '@/routes/cart';
import { validate as validateCoupon } from '@/routes/coupon';
import axios from 'axios';

type CartItem = {
    id: number;
    quantity: number;
    bundle_id?: number | null;
    bundle_name?: string | null;
    bundle_discount_percentage?: number;
    effective_price?: number;
    product: {
        id: number;
        title: string;
        slug: string;
        cover_image: string | null;
        category: {
            name: string;
        };
    };
    product_variation: {
        id: number;
        name: string;
        price: number;
    } | null;
};

export default function CartIndex({ cartItems }: { cartItems: CartItem[] }) {
    const total = cartItems.reduce((sum, item) => sum + ((item.effective_price ?? item.product_variation?.price ?? 0) * item.quantity), 0);

    const { auth } = usePage<any>().props;
    const { data, setData, post: checkoutPost, processing: checkoutProcessing, errors } = useForm({
        coupon_code: '',
        customer_name: auth?.user?.name || '',
        customer_email: auth?.user?.email || '',
        customer_phone: auth?.user?.phone || '',
    });
    const { delete: removeDelete, processing: removeProcessing } = useForm();
    const [discount, setDiscount] = useState<number>(0);
    const [couponMessage, setCouponMessage] = useState<string>('');
    const [couponError, setCouponError] = useState<string>('');
    const [validatingCoupon, setValidatingCoupon] = useState<boolean>(false);

    const handleCheckout = (e: FormEvent) => {
        e.preventDefault();
        checkoutPost(checkoutStore.url());
    };

    const handleRemove = (id: number) => {
        removeDelete(cartRemove.url(id));
    };

    const applyCoupon = async () => {
        if (!data.coupon_code) return;
        
        setValidatingCoupon(true);
        setCouponError('');
        setCouponMessage('');
        
        try {
            const response = await axios.post(validateCoupon.url(), {
                coupon_code: data.coupon_code,
                subtotal: total
            });
            
            if (response.data.valid) {
                setDiscount(response.data.discount);
                setCouponMessage(response.data.message);
            }
        } catch (error: any) {
            setDiscount(0);
            if (error.response && error.response.data) {
                setCouponError(error.response.data.message || 'Kupon tidak valid.');
            } else {
                setCouponError('Terjadi kesalahan.');
            }
        } finally {
            setValidatingCoupon(false);
        }
    };

    const finalTotal = Math.max(0, total - discount);

    return (
        <GuestLayout>
            <Head title="Keranjang Belanja | Digital Insani" />
            
            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Keranjang Belanja
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            Selesaikan pembayaran Anda untuk mendapatkan akses instan.
                        </p>
                    </div>
                </div>

                {cartItems.length > 0 ? (
                    <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items and Guest Form */}
                        <div className="lg:w-2/3 flex flex-col gap-8">
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center group">
                                            <div className="w-24 h-24 shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50">
                                                {item.product.cover_image ? (
                                                    <img src={`/storage/${item.product.cover_image}`} alt={item.product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs font-mono uppercase">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mb-1 block uppercase tracking-wider">
                                                    {item.product.category?.name}
                                                </span>
                                                <Link href={`/products/${item.product.slug}`} className="font-semibold text-lg text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">
                                                    {item.product.title}
                                                </Link>
                                                {item.product_variation && (
                                                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-2">
                                                        <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 ring-1 ring-inset ring-zinc-500/10">
                                                            {item.product_variation.name}
                                                        </span>
                                                    </div>
                                                )}
                                                {item.bundle_name && item.bundle_discount_percentage && (
                                                    <div className="mt-2 flex items-center gap-1.5">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold border border-blue-200/60 dark:border-blue-800">
                                                            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                            Paket: {item.bundle_name} (-{item.bundle_discount_percentage}%)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-2">
                                                <div className="text-right">
                                                    {item.bundle_discount_percentage && item.bundle_discount_percentage > 0 && (
                                                        <div className="text-xs text-zinc-400 line-through">
                                                            Rp {new Intl.NumberFormat('id-ID').format((item.product_variation?.price || 0) * item.quantity)}
                                                        </div>
                                                    )}
                                                    <div className="font-semibold text-lg text-zinc-900 dark:text-white whitespace-nowrap">
                                                        Rp {new Intl.NumberFormat('id-ID').format(((item.effective_price ?? item.product_variation?.price) || 0) * item.quantity)}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(item.id)}
                                                    disabled={removeProcessing}
                                                    className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!auth?.user && (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 sm:p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                                            <span className="text-base font-bold">1</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Data Pembeli</h4>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Lengkapi data di bawah ini untuk menerima pesanan Anda.</p>
                                        </div>
                                    </div>

                                    {/* Email Safety Alert */}
                                    <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
                                        <div className="p-1 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                                            <Ticket className="w-4 h-4" />
                                        </div>
                                        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                            <strong>Perhatian:</strong> Pastikan alamat email Anda aktif dan benar. Tautan unduhan berkas dan invoice akan dikirimkan otomatis ke alamat email ini setelah transaksi berhasil.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.customer_name}
                                                onChange={e => setData('customer_name', e.target.value)}
                                                className="block w-full px-4 py-3.5 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
                                                placeholder="Contoh: Budi Santoso"
                                                required
                                            />
                                            {errors.customer_name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.customer_name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">Email (Untuk pengiriman produk)</label>
                                            <input
                                                type="email"
                                                value={data.customer_email}
                                                onChange={e => setData('customer_email', e.target.value)}
                                                className="block w-full px-4 py-3.5 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
                                                placeholder="budi@gmail.com"
                                                required
                                            />
                                            {errors.customer_email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.customer_email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">No WhatsApp</label>
                                            <input
                                                type="text"
                                                value={data.customer_phone}
                                                onChange={e => setData('customer_phone', e.target.value)}
                                                className="block w-full px-4 py-3.5 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
                                                placeholder="081234567890"
                                                required
                                            />
                                            {errors.customer_phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.customer_phone}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {auth?.user && (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <span className="text-xs text-zinc-400 block mb-0.5">Checkout sebagai Member</span>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                                {auth.user.name} ({auth.user.email})
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-400 border border-green-200 dark:border-green-800">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Akun Terverifikasi
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                        <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                                            No. WhatsApp untuk Notifikasi & Unduhan Instan (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.customer_phone}
                                            onChange={e => setData('customer_phone', e.target.value)}
                                            className="block w-full max-w-md px-4 py-2.5 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 transition-colors"
                                            placeholder="Contoh: 081234567890"
                                        />
                                        <p className="text-xs text-zinc-500 mt-1">
                                            Konfirmasi pesanan dan tautan unduhan instan akan dikirimkan otomatis ke WhatsApp Anda setelah transaksi selesai.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Ringkasan Pesanan</h3>
                                
                                <div className="mb-6 space-y-4">
                                    <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                                        <span>Subtotal ({cartItems.length} item)</span>
                                        <span className="font-medium text-zinc-900 dark:text-white">Rp {new Intl.NumberFormat('id-ID').format(total)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                            <span>Diskon Kupon</span>
                                            <span className="font-medium">- Rp {new Intl.NumberFormat('id-ID').format(discount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-zinc-100 dark:border-zinc-800/50 pt-4 mb-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-base font-semibold text-zinc-900 dark:text-white">Total Pembayaran</span>
                                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">Rp {new Intl.NumberFormat('id-ID').format(finalTotal)}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2 uppercase tracking-wider">Punya Kupon?</label>
                                    <div className="flex gap-2 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Ticket className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.coupon_code}
                                            onChange={e => setData('coupon_code', e.target.value)}
                                            placeholder="Ketik kode di sini"
                                            className="block w-full rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 pl-9 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-zinc-900 dark:text-white transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            disabled={validatingCoupon || !data.coupon_code}
                                            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-all disabled:opacity-50"
                                        >
                                            Terapkan
                                        </button>
                                    </div>
                                    {couponMessage && <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> {couponMessage}</p>}
                                    {couponError && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400 flex items-center"><XCircle className="h-3 w-3 mr-1" /> {couponError}</p>}
                                </div>

                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 text-center leading-relaxed">
                                    Dengan melanjutkan, Anda menyetujui{' '}
                                    <Link href="/terms" target="_blank" className="underline hover:text-zinc-900 dark:hover:text-zinc-200">
                                        Syarat & Ketentuan
                                    </Link>
                                    {' '}serta{' '}
                                    <Link href="/refund-policy" target="_blank" className="underline hover:text-zinc-900 dark:hover:text-zinc-200">
                                        Kebijakan Refund
                                    </Link>
                                    {' '}kami.
                                </p>

                                <button
                                    type="submit"
                                    disabled={checkoutProcessing}
                                    className="w-full flex items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {checkoutProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            Lanjutkan Pembayaran
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                {/* Midtrans Payment Badges */}
                                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center space-y-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                        Didukung Pembayaran Resmi
                                    </span>
                                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">QRIS</span>
                                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">BCA VA</span>
                                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">Mandiri</span>
                                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">BNI</span>
                                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">GoPay</span>
                                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">ShopeePay</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                                        Akses unduhan instan langsung setelah pembayaran terverifikasi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 shadow-sm">
                        <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Keranjang Kosong</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">Anda belum menambahkan produk apapun ke dalam keranjang belanja.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98]"
                        >
                            Mulai Belanja
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
