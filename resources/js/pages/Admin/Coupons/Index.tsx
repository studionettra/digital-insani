import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import { useState } from 'react';
import admin from '@/routes/admin';

export default function CouponsIndex({ coupons, filters }: { coupons: any, filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            admin.coupons.index(),
            { search },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kupon ini?')) {
            router.delete(admin.coupons.destroy(id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Kupon Diskon | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: admin.dashboard() },
                    { title: 'Kupon Diskon', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-7xl">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">Kupon Diskon</h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">Kelola kupon promosi dan potongan harga pelanggan.</p>
                    </div>

                    <Link
                        href={admin.coupons.create()}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Buat Kupon
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-end max-w-7xl mt-4">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-4 w-full">
                        <div className="flex-1 min-w-0">
                            <label htmlFor="search" className="sr-only">Cari</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="h-5 w-5 text-zinc-400" />
                                </div>
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari kode kupon atau deskripsi..."
                                    className="block w-full rounded-md border-0 py-2.5 pl-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:text-white dark:ring-border"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                <div className="bento-card border-none ring-1 ring-border shadow-sm flex flex-col min-h-0 max-w-7xl">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                                <tr>
                                    <th className="px-6 py-5 border-b border-border">Kode</th>
                                    <th className="px-6 py-5 border-b border-border">Deskripsi</th>
                                    <th className="px-6 py-5 border-b border-border">Tipe / Nilai</th>
                                    <th className="px-6 py-5 border-b border-border">Kuota & Pemakaian</th>
                                    <th className="px-6 py-5 border-b border-border">Status</th>
                                    <th className="px-6 py-5 border-b border-border text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {coupons.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                                            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada kupon diskon</p>
                                        </td>
                                    </tr>
                                ) : (
                                    coupons.data.map((coupon: any) => (
                                        <tr key={coupon.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-zinc-100">
                                                {coupon.code}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500 max-w-[200px] truncate">
                                                {coupon.description || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {coupon.discount_type === 'percentage' 
                                                    ? `${coupon.discount_amount}%` 
                                                    : `Rp ${new Intl.NumberFormat('id-ID').format(coupon.discount_amount)}`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>Terpakai: {coupon.used_count}</span>
                                                    <span className="text-xs text-zinc-400">Max: {coupon.max_uses ? coupon.max_uses : 'Unlimited'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    coupon.is_active 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {coupon.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={admin.coupons.edit(coupon.id)}
                                                        className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(coupon.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Minimalist Pagination */}
                    {coupons.links && coupons.links.length > 3 && (
                        <div className="border-t border-border bg-zinc-50/30 dark:bg-zinc-900/30 p-4">
                            <div className="flex flex-wrap items-center justify-center gap-1 text-sm font-medium">
                                {coupons.links.map((link: any, idx: number) => (
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
