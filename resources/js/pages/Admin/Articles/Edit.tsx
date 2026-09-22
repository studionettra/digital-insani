import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import { TrixEditor } from '@/components/ui/trix-editor';
import { FormEvent } from 'react';

export default function ArticleEdit({ article, categories }: { article: any, categories: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: article.title || '',
        content: article.content || '',
        category_id: article.category_id || '',
        is_published: !!article.is_published,
        cover_image: null as File | null,
        excerpt: article.excerpt || '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/articles/${article.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Artikel | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Artikel', href: '/admin/articles' },
                    { title: 'Edit', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/articles" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">Edit Artikel</h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400">Perbarui konten artikel Anda.</p>
                        </div>
                    </div>
                </div>

                <div className="bento-card border-none ring-1 ring-border shadow-sm p-6 lg:p-8">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Top Section: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Judul Artikel</label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                        placeholder="Cara Memulai Bisnis Digital..."
                                    />
                                    {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
                                </div>
                                
                                <div>
                                    <label htmlFor="excerpt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Ringkasan (Excerpt)</label>
                                    <textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={e => setData('excerpt', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 min-h-[100px]"
                                        placeholder="Tulis ringkasan singkat artikel ini..."
                                    />
                                    {errors.excerpt && <p className="mt-2 text-sm text-red-600 font-medium">{errors.excerpt}</p>}
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="cover_image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Cover Gambar</label>
                                    <input
                                        id="cover_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setData('cover_image', e.target.files ? e.target.files[0] : null)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    />
                                    
                                    {/* Preview logic */}
                                    {data.cover_image ? (
                                        <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                            <img src={URL.createObjectURL(data.cover_image)} alt="Preview Baru" className="object-cover w-full h-full" />
                                            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded shadow">Baru</div>
                                        </div>
                                    ) : article.cover_image ? (
                                        <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                            <img src={`/storage/${article.cover_image}`} alt="Cover Saat Ini" className="object-cover w-full h-full" />
                                            <div className="absolute top-2 right-2 bg-zinc-900/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Saat Ini</div>
                                        </div>
                                    ) : null}
                                    
                                    {errors.cover_image && <p className="mt-2 text-sm text-red-600 font-medium">{errors.cover_image}</p>}
                                </div>

                                <div>
                                    <label htmlFor="category_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Kategori</label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="mt-2 text-sm text-red-600 font-medium">{errors.category_id}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Editor */}
                        <div className="trix-editor-container premium-editor">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Konten Artikel</label>
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                                <TrixEditor 
                                    value={data.content}
                                    onChange={(html) => setData('content', html)}
                                    placeholder="Mulai menulis artikel di sini..."
                                />
                            </div>
                            {errors.content && <p className="mt-2 text-sm text-red-600 font-medium">{errors.content}</p>}
                        </div>

                        {/* SEO Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
                            <div>
                                <label htmlFor="meta_title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Meta Title (SEO)</label>
                                <input
                                    id="meta_title"
                                    type="text"
                                    value={data.meta_title}
                                    onChange={e => setData('meta_title', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    placeholder="Opsional: Kustom meta title untuk SEO..."
                                />
                                {errors.meta_title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.meta_title}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="meta_description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Meta Description (SEO)</label>
                                <textarea
                                    id="meta_description"
                                    value={data.meta_description}
                                    onChange={e => setData('meta_description', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3 min-h-[50px]"
                                    placeholder="Opsional: Kustom meta description untuk SEO..."
                                />
                                {errors.meta_description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.meta_description}</p>}
                            </div>
                        </div>

                        {/* Bottom Section: Publish Status */}
                        <div>
                            <div className="inline-flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                <input
                                    id="is_published"
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={e => setData('is_published', e.target.checked)}
                                    className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950 dark:checked:bg-primary transition-colors cursor-pointer"
                                />
                                <label htmlFor="is_published" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none pr-2">
                                    Langsung Publikasikan Artikel Ini
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <Link
                                href="/admin/articles"
                                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Perbarui Artikel'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
