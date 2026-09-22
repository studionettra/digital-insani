import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Download, User, Package, Calendar } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';

export default function OrdersShow({ order }: { order: any }) {
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
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badges[status] || defaultBadge}`}>
                {label}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title={`Pesanan ${order.order_number} | Admin`} />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Pesanan', href: '/admin/orders' },
                    { title: order.order_number, href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-5xl">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-zinc-500" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                                Pesanan #{order.order_number}
                                {getStatusBadge(order.status)}
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.created_at).toLocaleString('id-ID', {
                                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items */}
                        <div className="bento-card p-6">
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" /> Produk Dibeli
                            </h3>
                            <div className="divide-y divide-border">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-zinc-900 dark:text-white">{item.product_name}</span>
                                            {item.variation_name && (
                                                <span className="text-sm text-zinc-500">{item.variation_name}</span>
                                            )}
                                        </div>
                                        <span className="font-medium">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 border-t border-border pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                                    <span>Subtotal</span>
                                    <span>Rp {new Intl.NumberFormat('id-ID').format(order.subtotal)}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                                        <span>Diskon {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                                        <span>- Rp {new Intl.NumberFormat('id-ID').format(order.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-medium text-zinc-900 dark:text-white pt-2">
                                    <span>Total Pembayaran</span>
                                    <span>Rp {new Intl.NumberFormat('id-ID').format(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Webhook Events */}
                        <div className="bento-card p-6">
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">Riwayat Pembayaran (Webhook)</h3>
                            {order.webhook_events && order.webhook_events.length > 0 ? (
                                <div className="space-y-4">
                                    {order.webhook_events.map((event: any) => (
                                        <div key={event.id} className="text-sm border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 py-1">
                                            <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                                                <span className="uppercase">{event.event_type}</span>
                                                <span className="text-xs text-zinc-500 font-normal">
                                                    {new Date(event.created_at).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <div className="text-zinc-500 mt-1">Provider: {event.provider} | Status: {event.status}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-500">Belum ada riwayat webhook (transaksi belum diproses payment gateway atau dibayarkan).</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Customer */}
                        <div className="bento-card p-6">
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" /> Data Pelanggan
                            </h3>
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-zinc-500 dark:text-zinc-400">Nama Lengkap</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-white mt-1">{order.customer_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-white mt-1">{order.customer_email}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500 dark:text-zinc-400">No. WhatsApp</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-white mt-1">{order.customer_phone || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500 dark:text-zinc-400">Status Akun</dt>
                                    <dd className="mt-1">
                                        {order.user_id ? (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                                                Terdaftar Member
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400">
                                                Guest
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Payment */}
                        <div className="bento-card p-6">
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Informasi Pembayaran
                            </h3>
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-zinc-500 dark:text-zinc-400">Metode</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-white mt-1 uppercase">
                                        {order.payment_method || 'Midtrans Snap'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500 dark:text-zinc-400">External ID (Midtrans)</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-white mt-1 font-mono text-xs break-all">
                                        {order.external_id || '-'}
                                    </dd>
                                </div>
                                {order.paid_at && (
                                    <div>
                                        <dt className="text-zinc-500 dark:text-zinc-400">Tanggal Lunas</dt>
                                        <dd className="font-medium text-zinc-900 dark:text-white mt-1">
                                            {new Date(order.paid_at).toLocaleString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
