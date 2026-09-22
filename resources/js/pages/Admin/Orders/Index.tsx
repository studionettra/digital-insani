import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, Filter } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import { useState } from 'react';

export default function OrdersIndex({ orders, filters }: { orders: any, filters: any }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/orders',
            { search, status },
            { preserveState: true, replace: true }
        );
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            cancelled: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
        };
        const defaultBadge = 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
        const label = status === 'paid' ? 'Lunas' : status === 'pending' ? 'Tertunda' : status === 'failed' ? 'Gagal' : status === 'cancelled' ? 'Dibatalkan' : status;

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[status] || defaultBadge}`}>
                {label}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pesanan | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Pesanan', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="flex flex-col gap-4 max-w-7xl">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">Manajemen Pesanan</h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">Pantau dan kelola seluruh transaksi pembelian di platform Anda.</p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-4 items-end">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-4 w-full">
                            <div className="flex-1 min-w-0">
                                <label htmlFor="search" className="sr-only">Cari</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="search"
                                        name="search"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari no. pesanan, nama, email..."
                                        className="block w-full rounded-md border-0 py-2.5 pl-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:text-white dark:ring-border"
                                    />
                                </div>
                            </div>
                            
                            <div className="w-48 shrink-0">
                                <label htmlFor="status" className="sr-only">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:text-white dark:ring-border"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="paid">Lunas</option>
                                    <option value="pending">Tertunda</option>
                                    <option value="failed">Gagal</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 focus:outline-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bento-card border-none ring-1 ring-border shadow-sm flex flex-col min-h-0 max-w-7xl">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                                <tr>
                                    <th className="px-6 py-5 border-b border-border">No. Pesanan</th>
                                    <th className="px-6 py-5 border-b border-border">Pelanggan</th>
                                    <th className="px-6 py-5 border-b border-border">Total</th>
                                    <th className="px-6 py-5 border-b border-border">Status</th>
                                    <th className="px-6 py-5 border-b border-border">Tanggal</th>
                                    <th className="px-6 py-5 border-b border-border text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                                    <Search className="w-6 h-6" />
                                                </div>
                                                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Pesanan tidak ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-zinc-900 dark:text-zinc-100">{order.order_number}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{order.customer_name}</span>
                                                    <span className="text-xs text-zinc-500">{order.customer_email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium">Rp {new Intl.NumberFormat('id-ID').format(order.total_amount)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-zinc-600 dark:text-zinc-400">
                                                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Minimalist Pagination */}
                    {orders.links && orders.links.length > 3 && (
                        <div className="border-t border-border bg-zinc-50/30 dark:bg-zinc-900/30 p-4">
                            <div className="flex flex-wrap items-center justify-center gap-1 text-sm font-medium">
                                {orders.links.map((link: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3.5 py-2 rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : link.url
                                                ? 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                : 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed opacity-50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
