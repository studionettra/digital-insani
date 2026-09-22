import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, Filter, ShoppingBag } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import admin from '@/routes/admin';

export default function OrdersIndex({ orders, filters }: { orders: any; filters: any }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const breadcrumbs = [
        { title: 'Admin Dashboard', href: admin.dashboard() },
        { title: 'Pesanan', href: admin.orders.index() },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/orders',
            { search, status },
            { preserveState: true, replace: true }
        );
    };

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(val));
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pesanan | Admin" />

            <PageHeader
                title="Manajemen Pesanan"
                description="Pantau dan kelola seluruh transaksi pembelian produk digital di platform Anda."
                badge={`${orders.total ?? orders.data?.length ?? 0} Transaksi`}
            />

            {/* Filter & Search Toolbar */}
            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 p-4 shadow-2xs">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="size-4 text-zinc-400" />
                        </div>
                        <input
                            id="search"
                            name="search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari no. pesanan, nama, email pelanggan..."
                            className="block w-full rounded-xl border border-border/70 bg-zinc-50/50 dark:bg-zinc-800/50 py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-primary focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="block w-full sm:w-44 rounded-xl border border-border/70 bg-zinc-50/50 dark:bg-zinc-800/50 py-2 pl-3 pr-8 text-sm text-zinc-900 dark:text-white focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                            <option value="all">Semua Status</option>
                            <option value="paid">Lunas</option>
                            <option value="pending">Tertunda</option>
                            <option value="failed">Gagal</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors shrink-0"
                        >
                            <Filter className="size-3.5" />
                            <span>Filter</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Orders Table Container */}
            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        <thead className="bg-zinc-50/70 dark:bg-zinc-800/40 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-border/60">
                            <tr>
                                <th className="px-6 py-3.5">No. Pesanan</th>
                                <th className="px-6 py-3.5">Pelanggan</th>
                                <th className="px-6 py-3.5">Total</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5">Tanggal</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                                                <ShoppingBag className="size-6" />
                                            </div>
                                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">Tidak ada transaksi ditemukan</p>
                                            <p className="text-xs text-zinc-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-white">
                                                {order.order_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-zinc-900 dark:text-white">
                                                    {order.customer_name || order.user?.name || 'Tamu'}
                                                </span>
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {order.customer_email || order.user?.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                            Rp {formatRupiah(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4">
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
                                        <td className="px-6 py-4 text-xs text-zinc-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-zinc-50/50 dark:bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
                                                title="Lihat Rincian Pesanan"
                                            >
                                                <Eye className="size-3.5" />
                                                <span>Detail</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-border/60 px-6 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/40">
                        <span className="text-xs text-zinc-500">
                            Menampilkan <span className="font-medium text-zinc-900 dark:text-white">{orders.from ?? 0}</span> sampai{' '}
                            <span className="font-medium text-zinc-900 dark:text-white">{orders.to ?? 0}</span> dari{' '}
                            <span className="font-medium text-zinc-900 dark:text-white">{orders.total}</span> data
                        </span>
                        <div className="flex items-center gap-1">
                            {orders.links.map((link: any, i: number) => {
                                if (!link.url && link.label === '...') {
                                    return <span key={i} className="px-2 py-1 text-xs text-zinc-400">...</span>;
                                }
                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                                                : link.url
                                                ? 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                : 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
