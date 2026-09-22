import { Head, Link } from '@inertiajs/react';
import { BadgeDollarSign, ShoppingCart, Users, ArrowRight, TrendingUp } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import admin from '@/routes/admin';

interface Stats {
    revenue: number;
    orders: number;
    members: number;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    customer_name: string;
    user: { name: string } | null;
    created_at: string;
}

export default function Dashboard({ stats, recentOrders }: { stats: Stats; recentOrders: Order[] }) {
    const breadcrumbs = [
        {
            title: 'Admin Dashboard',
            href: admin.dashboard(),
        },
    ];

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(val));
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <PageHeader
                title="Ringkasan Utama"
                description="Pantau statistik performa toko, pendapatan, dan transaksi secara real-time."
                badge="Real-time"
            />

            {/* Metrik Bento Cards (TailAdmin & Modern Style) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Metric 1: Pendapatan */}
                <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Total Pendapatan
                        </span>
                        <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                            <BadgeDollarSign className="size-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl font-semibold text-zinc-400 dark:text-zinc-500">Rp</span>
                        <span className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {formatRupiah(stats.revenue)}
                        </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <TrendingUp className="size-3.5" />
                        <span>Akumulasi transaksi berhasil</span>
                    </div>
                </div>

                {/* Metric 2: Pesanan */}
                <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Total Pesanan
                        </span>
                        <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
                            <ShoppingCart className="size-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {stats.orders}
                        </span>
                        <span className="text-sm font-medium text-zinc-500">transaksi</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Checkout yang diselesaikan</span>
                    </div>
                </div>

                {/* Metric 3: Member */}
                <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Total Member
                        </span>
                        <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20">
                            <Users className="size-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {stats.members}
                        </span>
                        <span className="text-sm font-medium text-zinc-500">pengguna</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Pengguna terdaftar di sistem</span>
                    </div>
                </div>
            </div>

            {/* Pesanan Terbaru Container */}
            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Pesanan Terbaru</h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Daftar transaksi paling mutakhir yang masuk ke toko.</p>
                    </div>
                    <Link
                        href={admin.orders.index()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        <span>Lihat Semua</span>
                        <ArrowRight className="size-3.5" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        <thead className="bg-zinc-50/70 dark:bg-zinc-800/40 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-border/60">
                            <tr>
                                <th className="px-6 py-3.5">Nomor Pesanan</th>
                                <th className="px-6 py-3.5">Pembeli</th>
                                <th className="px-6 py-3.5">Total</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <ShoppingCart className="size-10 text-zinc-300 dark:text-zinc-700 mb-3" />
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Belum ada pesanan terbaru</p>
                                            <p className="text-xs text-zinc-500 mt-1">Transaksi pelanggan akan otomatis tercatat di sini.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-3.5">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-mono text-xs font-semibold text-zinc-900 dark:text-white hover:text-primary transition-colors"
                                            >
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                    {(order.user?.name || order.customer_name || '?').charAt(0)}
                                                </div>
                                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                                    {order.user?.name || order.customer_name || 'Tamu (Guest)'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-white">
                                            Rp {formatRupiah(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            {order.status === 'paid' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Lunas
                                                </span>
                                            )}
                                            {order.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                                                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                                                    Tertunda
                                                </span>
                                            )}
                                            {order.status === 'failed' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                                                    <span className="size-1.5 rounded-full bg-rose-500"></span>
                                                    Gagal
                                                </span>
                                            )}
                                            {order.status === 'cancelled' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                    Dibatalkan
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs text-zinc-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
