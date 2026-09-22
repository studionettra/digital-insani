import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import admin from '@/routes/admin';

export default function ArticlesIndex({ articles }: { articles: any }) {
    const breadcrumbs = [
        { title: 'Admin Dashboard', href: admin.dashboard() },
        { title: 'Artikel SEO', href: admin.articles.index() },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Artikel | Admin" />

            <PageHeader
                title="Daftar Artikel SEO"
                description="Kelola postingan artikel dan panduan Anda di sini."
            >
                <Link
                    href="/admin/articles/create"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors"
                >
                    <Plus className="size-4" />
                    Tambah Artikel
                </Link>
            </PageHeader>

            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
                            <thead className="bg-zinc-50/50 text-xs uppercase text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Judul</th>
                                    <th className="px-6 py-4 font-medium">Kategori</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                            Belum ada artikel.
                                        </td>
                                    </tr>
                                ) : (
                                    articles.data.map((article: any) => (
                                        <tr key={article.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                                {article.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                {article.category?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${article.is_published ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-500/20'}`}>
                                                    {article.is_published ? 'Publik' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                        className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
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
                    {articles.links && articles.links.length > 3 && (
                        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
                            <div className="flex items-center justify-center gap-1 text-sm">
                                {articles.links.map((link: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-md ${
                                            link.active
                                                ? 'bg-zinc-900 text-zinc-50 font-medium'
                                                : link.url
                                                ? 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                : 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
        </AdminLayout>
    );
}
