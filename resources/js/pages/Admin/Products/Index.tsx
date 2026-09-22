import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, CheckCircle, FolderGit2 } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';

export default function ProductsIndex({ products }: { products: any }) {
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const confirmDelete = () => {
        if (!productToDelete) return;
        
        router.delete(`/admin/products/${productToDelete}`, {
            onSuccess: () => {
                setProductToDelete(null);
                setShowSuccess(true);
            },
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Produk | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Produk', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">Daftar Produk</h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">Kelola katalog produk digital, harga, dan lisensi Anda.</p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Tambah Produk
                    </Link>
                </div>

                {/* State handled via Component level useState */}

                        <div className="bento-card border-none ring-1 ring-border shadow-sm flex flex-col min-h-0">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                                <tr>
                                    <th className="px-6 py-5 border-b border-border">Judul</th>
                                    <th className="px-6 py-5 border-b border-border">Kategori</th>
                                    <th className="px-6 py-5 border-b border-border">Harga</th>
                                    <th className="px-6 py-5 border-b border-border">Status</th>
                                    <th className="px-6 py-5 border-b border-border text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-zinc-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                                    <FolderGit2 className="w-6 h-6" />
                                                </div>
                                                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada produk</p>
                                                <p className="text-zinc-500 mt-1">Mulai tambahkan produk digital pertama Anda.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product: any) => (
                                        <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
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
                                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-2"></span>
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="p-2 text-zinc-400 hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setProductToDelete(product.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    {products.links && products.links.length > 3 && (
                        <div className="border-t border-border bg-zinc-50/30 dark:bg-zinc-900/30 p-4">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium">
                                {products.links.map((link: any, idx: number) => (
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
