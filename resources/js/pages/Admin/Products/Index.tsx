import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, CheckCircle, FolderGit2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import admin from '@/routes/admin';

export default function ProductsIndex({ products }: { products: any }) {
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const breadcrumbs = [
        { title: 'Admin Dashboard', href: admin.dashboard() },
        { title: 'Produk', href: admin.products.index() },
    ];

    const confirmDelete = () => {
        if (!productToDelete) return;

        router.delete(`/admin/products/${productToDelete}`, {
            onSuccess: () => {
                setProductToDelete(null);
                setShowSuccess(true);
            },
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Produk | Admin" />

            <PageHeader
                title="Daftar Produk"
                description="Kelola katalog produk digital, harga, dan lisensi Anda."
            >
                <Link
                    href={admin.products.create()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors"
                >
                    <Plus className="size-4" />
                    Tambah Produk
                </Link>
            </PageHeader>

            {/* Products Table Container */}
            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        <thead className="bg-zinc-50/70 dark:bg-zinc-800/40 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-border/60">
                            <tr>
                                <th className="px-6 py-3.5">Judul</th>
                                <th className="px-6 py-3.5">Kategori</th>
                                <th className="px-6 py-3.5">Harga</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                                                <FolderGit2 className="size-6" />
                                            </div>
                                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">Belum ada produk</p>
                                            <p className="text-xs text-zinc-500 mt-1">Mulai tambahkan produk digital pertama Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                                {product.category?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                            {product.variations && product.variations.length > 0
                                                ? `Mulai Rp ${Math.min(...product.variations.map((v: any) => v.price)).toLocaleString('id-ID')}`
                                                : <span className="text-zinc-400 italic font-normal">Belum ada harga</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                    <span className="size-1.5 rounded-full bg-zinc-400"></span>
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-zinc-50/50 dark:bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
                                                >
                                                    <Edit className="size-3.5" />
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setProductToDelete(product.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-zinc-50/50 dark:bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 transition-colors shadow-2xs"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-border/60 px-6 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/40">
                        <span className="text-xs text-zinc-500">
                            Menampilkan <span className="font-medium text-zinc-900 dark:text-white">{products.from ?? 0}</span> sampai{' '}
                            <span className="font-medium text-zinc-900 dark:text-white">{products.to ?? 0}</span> dari{' '}
                            <span className="font-medium text-zinc-900 dark:text-white">{products.total}</span> data
                        </span>
                        <div className="flex items-center gap-1">
                            {products.links.map((link: any, i: number) => (
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
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {productToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setProductToDelete(null)}></div>
                    <div className="relative z-10 flex flex-col gap-3 p-6 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">Peringatan Hapus</h3>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-full transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-sm shadow-red-600/20"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowSuccess(false)}></div>
                    <div className="relative z-10 flex flex-col gap-3 p-6 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">Berhasil</h3>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Produk telah berhasil dihapus dari sistem.
                        </p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-sm shadow-blue-600/20"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
