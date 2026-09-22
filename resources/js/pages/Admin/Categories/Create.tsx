import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import { TrixEditor } from '@/components/ui/trix-editor';
import { ArrowLeft, Save } from 'lucide-react';
import admin from '@/routes/admin';

export default function CreateCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        is_active: '1',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    const breadcrumbs = [
        { title: 'Admin Dashboard', href: admin.dashboard() },
        { title: 'Kategori', href: admin.categories.index() },
        { title: 'Tambah', href: '#' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kategori | Admin" />

            <PageHeader
                title="Tambah Kategori Baru"
                description="Buat kategori baru untuk mengelompokkan produk dan artikel Anda."
            >
                <Link
                    href={admin.categories.index()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
                >
                    <ArrowLeft className="size-4" />
                    Kembali
                </Link>
            </PageHeader>

            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs p-6 lg:p-8">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    placeholder="Contoh: Template Presentasi"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Slug Kategori (Opsional)
                                </label>
                                <input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={e => setData('slug', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 font-mono"
                                    placeholder="Dibiarkan kosong akan dibuat otomatis"
                                />
                                {errors.slug && <p className="mt-2 text-sm text-red-600 font-medium">{errors.slug}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="is_active" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Status Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="is_active"
                                    value={data.is_active}
                                    onChange={e => setData('is_active', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                >
                                    <option value="1">Aktif</option>
                                    <option value="0">Tidak Aktif</option>
                                </select>
                                {errors.is_active && <p className="mt-2 text-sm text-red-600 font-medium">{errors.is_active}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Deskripsi Kategori (Opsional)
                                </label>
                                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                                    <TrixEditor
                                        value={data.description}
                                        onChange={(html) => setData('description', html)}
                                        placeholder="Tuliskan deskripsi atau rincian kategori ini..."
                                    />
                                </div>
                                {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <Link
                                href="/admin/categories"
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
                                {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                            </button>
                        </div>
                    </form>
                </div>
        </AdminLayout>
    );
}
