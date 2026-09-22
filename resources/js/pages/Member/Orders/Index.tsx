import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/layouts/MemberLayout';

type Order = {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: {
        id: number;
        product: {
            title: string;
        }
    }[];
};

export default function OrdersIndex({ orders }: { orders: Order[] }) {
    return (
        <MemberLayout>
            <Head title="Riwayat Pesanan | Digital Insani" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Riwayat Pesanan</h1>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Daftar semua transaksi yang pernah Anda lakukan di Digital Insani.</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        {orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase text-zinc-900 dark:text-zinc-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 font-medium border-b border-zinc-200 dark:border-zinc-700">Order ID</th>
                                            <th scope="col" className="px-6 py-4 font-medium border-b border-zinc-200 dark:border-zinc-700">Tanggal</th>
                                            <th scope="col" className="px-6 py-4 font-medium border-b border-zinc-200 dark:border-zinc-700">Item</th>
                                            <th scope="col" className="px-6 py-4 font-medium border-b border-zinc-200 dark:border-zinc-700">Total</th>
                                            <th scope="col" className="px-6 py-4 font-medium border-b border-zinc-200 dark:border-zinc-700">Status</th>
                                            <th scope="col" className="px-6 py-4 font-medium border-b border-zinc-200 dark:border-zinc-700 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white font-mono">
                                                    {order.order_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="truncate max-w-[200px]" title={order.items.map(i => i.product.title).join(', ')}>
                                                        {order.items[0]?.product.title} {order.items.length > 1 ? `(+${order.items.length - 1} item)` : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                    Rp {new Intl.NumberFormat('id-ID').format(order.total_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                                                        ${order.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' : 
                                                        'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <Link 
                                                        href={`/member/orders/${order.id}`}
                                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                    >
                                                        Detail &rarr;
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center border-t border-zinc-200 dark:border-zinc-800">
                                <p className="text-zinc-500 dark:text-zinc-400 mb-4">Belum ada riwayat transaksi.</p>
                                <Link href="/products" className="text-blue-600 hover:underline">Mulai belanja produk digital</Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </MemberLayout>
    );
}
