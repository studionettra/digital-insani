import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import admin from '@/routes/admin';

export default function ProductUpdatesIndex({ updates }: { updates: any }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pembaruan ini?')) {
            router.delete(admin.productUpdates.destroy(id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Pembaruan Produk | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: admin.dashboard() },
                    { title: 'Pembaruan Produk', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">Pembaruan Produk</h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">Kelola riwayat versi produk dan notifikasi changelog ke pelanggan.</p>
                    </div>

                    <Link
                        href={admin.productUpdates.create()}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Buat Pembaruan
                    </Link>
                </div>

                <div className="bento-card border-none ring-1 ring-border shadow-sm flex flex-col min-h-0">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                                <tr>
                                    <th className="px-6 py-5 border-b border-border">Produk</th>
                                    <th className="px-6 py-5 border-b border-border">Versi</th>
                                    <th className="px-6 py-5 border-b border-border">Tanggal Publikasi</th>
                                    <th className="px-6 py-5 border-b border-border text-center">Email Terkirim</th>
                                    <th className="px-6 py-5 border-b border-border text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {updates.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-zinc-500">
                                            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada riwayat pembaruan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    updates.data.map((update: any) => (
                                        <tr key={update.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{update.product?.title || update.product?.name || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 font-mono">
                                                    v{update.version}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {update.published_at ? new Date(update.published_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                }) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {update.is_notified ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <span className="text-zinc-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={admin.productUpdates.edit(update.id)}
                                                        className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(update.id)}
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
                    {updates.links && updates.links.length > 3 && (
                        <div className="border-t border-border bg-zinc-50/30 dark:bg-zinc-900/30 p-4">
                            <div className="flex flex-wrap items-center justify-center gap-1 text-sm font-medium">
                                {updates.links.map((link: any, idx: number) => (
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
