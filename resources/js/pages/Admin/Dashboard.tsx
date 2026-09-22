import { Head } from '@inertiajs/react';
import { BadgeDollarSign, ShoppingCart, Users } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';

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

export default function Dashboard({ stats, recentOrders }: { stats: Stats, recentOrders: Order[] }) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <AppSidebarHeader
                breadcrumbs={[
                    {
                        title: 'Admin Dashboard',
                        href: '#',
                    },
                ]}
            />
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="mb-2 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">Ringkasan Utama</h1>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400">Pantau statistik performa toko bulan ini secara real-time.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Stat Card 1 */}
                    <div className="bento-card relative overflow-hidden group p-6">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                            <BadgeDollarSign className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/20">
                                    <BadgeDollarSign className="size-6" />
                                </div>
                                <h3 className="font-medium text-zinc-500 dark:text-zinc-400">Total Pendapatan</h3>
                            </div>
                            <div>
                                <div className="text-4xl font-semibold tracking-tighter text-zinc-900 dark:text-white">
                                    <span className="text-2xl text-zinc-400 font-medium mr-1">Rp</span>
                                    {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(stats.revenue))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bento-card relative overflow-hidden group p-6">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                            <ShoppingCart className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
                                    <ShoppingCart className="size-6" />
                                </div>
                                <h3 className="font-medium text-zinc-500 dark:text-zinc-400">Total Pesanan</h3>
                            </div>
                            <div>
                                <div className="text-4xl font-semibold tracking-tighter text-zinc-900 dark:text-white">
                                    {stats.orders} <span className="text-lg font-medium text-zinc-500 dark:text-zinc-500 tracking-normal">berhasil</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bento-card relative overflow-hidden group p-6">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                            <Users className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-3 text-zinc-600 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700">
                                    <Users className="size-6" />
                                </div>
                                <h3 className="font-medium text-zinc-500 dark:text-zinc-400">Total Member</h3>
                            </div>
                            <div>
                                <div className="text-4xl font-semibold tracking-tighter text-zinc-900 dark:text-white">
                                    {stats.members} <span className="text-lg font-medium text-zinc-500 dark:text-zinc-500 tracking-normal">terdaftar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Pesanan Terbaru</h2>
                    </div>
                    <div className="bento-card border-none ring-1 ring-border shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                                <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                                    <tr>
                                        <th className="px-6 py-5 border-b border-border">Nomor Pesanan</th>
                                        <th className="px-6 py-5 border-b border-border">Pembeli</th>
                                        <th className="px-6 py-5 border-b border-border">Total</th>
                                        <th className="px-6 py-5 border-b border-border">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center text-zinc-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <ShoppingCart className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                                                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada pesanan</p>
                                                    <p className="text-zinc-500 mt-1">Pesanan terbaru akan muncul di sini.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{order.order_number}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                            {(order.user?.name || order.customer_name || '?').charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{order.user?.name || order.customer_name || 'Guest'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                                    Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(order.total_amount))}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.status === 'paid' && (
                                                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                                            Berhasil
                                                        </span>
                                                    )}
                                                    {order.status === 'pending' && (
                                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span>
                                                            Menunggu
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
