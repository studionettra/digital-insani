import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import { TrixEditor } from '@/components/ui/trix-editor';
import { ArrowLeft, Save, Plus, Trash2, Layers } from 'lucide-react';
import admin from '@/routes/admin';

export default function CreateProduct({ categories }: { categories: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        description: '',
        cover_image: null as File | null,
        variations: [
            { name: 'Lisensi Personal', price: '', delivery_type: 'file', product_file: null as File | null, file_url: '' }
        ],
    });

    const breadcrumbs = [
        { title: 'Admin Dashboard', href: admin.dashboard() },
        { title: 'Produk', href: admin.products.index() },
        { title: 'Tambah', href: '#' },
    ];

    const addVariation = () => {
        setData('variations', [
            ...data.variations,
            { name: '', price: '', delivery_type: 'file', product_file: null, file_url: '' }
        ]);
    };

    const removeVariation = (index: number) => {
        const newVariations = [...data.variations];
        newVariations.splice(index, 1);
        setData('variations', newVariations);
    };

    const updateVariation = (index: number, field: string, value: any) => {
        const newVariations = [...data.variations];
        (newVariations[index] as any)[field] = value;

        // Clear conflicting fields when switching delivery type
        if (field === 'delivery_type') {
            if (value === 'url') {
                (newVariations[index] as any).product_file = null;
            } else {
                (newVariations[index] as any).file_url = '';
            }
        }

        setData('variations', newVariations);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk | Admin" />

            <PageHeader
                title="Tambah Produk Baru"
                description="Isi detail produk digital, cover gambar, harga, dan file yang akan dijual."
            >
                <Link
                    href={admin.products.index()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
                >
                    <ArrowLeft className="size-4" />
                    Kembali
                </Link>
            </PageHeader>

            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs p-6 lg:p-8">
                <form onSubmit={submit} className="space-y-8">
                    {/* Top Section: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Judul Produk <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    placeholder="Contoh: Template Presentasi Modern"
                                    required
                                />
                                {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Deskripsi Produk
                                </label>
                                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                                    <TrixEditor
                                        value={data.description}
                                        onChange={(html) => setData('description', html)}
                                        placeholder="Tuliskan deskripsi lengkap, fitur, dan spesifikasi produk Anda..."
                                    />
                                </div>
                                {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Kategori Produk <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    required
                                >
                                    <option value="">Pilih Kategori Produk</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-2 text-sm text-red-600 font-medium">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="cover_image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Cover Gambar (Max: 2MB) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="cover_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('cover_image', e.target.files ? e.target.files[0] : null)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    required
                                />
                                {data.cover_image && (
                                    <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                        <img src={URL.createObjectURL(data.cover_image)} alt="Preview" className="object-cover w-full h-full" />
                                    </div>
                                )}
                                {errors.cover_image && <p className="mt-2 text-sm text-red-600 font-medium">{errors.cover_image}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Variasi & File Utama */}
                    <div className="p-6 lg:p-8 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Harga, Lisensi & File Digital</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Atur harga serta tipe pengiriman file untuk variasi lisensi produk ini.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addVariation}
                                className="inline-flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 text-xs font-semibold transition-colors shrink-0"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Tambah Lisensi/Variasi
                            </button>
                        </div>

                        {typeof errors === 'object' && Object.keys(errors).some(k => k.startsWith('variations')) && (
                            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 p-4">
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                    Terdapat kesalahan pada isian variasi di bawah. Harap periksa kolom harga dan nama lisensi.
                                </p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {data.variations.map((variation, index) => (
                                <div key={index} className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
                                    {data.variations.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariation(index)}
                                            className="absolute -top-3 -right-3 h-8 w-8 inline-flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shadow-sm"
                                            title="Hapus variasi ini"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Hapus variasi</span>
                                        </button>
                                    )}

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                Nama Lisensi / Variasi <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={variation.name}
                                                onChange={(e) => updateVariation(index, 'name', e.target.value)}
                                                className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                                placeholder="Contoh: Personal License"
                                                required
                                            />
                                            {(errors as any)[`variations.${index}.name`] && (
                                                <p className="mt-2 text-sm text-red-600 font-medium">{(errors as any)[`variations.${index}.name`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                Harga (Rp) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={variation.price}
                                                onChange={(e) => updateVariation(index, 'price', e.target.value)}
                                                className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                                placeholder="Contoh: 150000"
                                                required
                                            />
                                            {(errors as any)[`variations.${index}.price`] && (
                                                <p className="mt-2 text-sm text-red-600 font-medium">{(errors as any)[`variations.${index}.price`]}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                Tipe Pengiriman Produk <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={variation.delivery_type}
                                                onChange={(e) => updateVariation(index, 'delivery_type', e.target.value)}
                                                className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                            >
                                                <option value="file">Unggah File Fisik (.zip / .rar / .pdf)</option>
                                                <option value="url">Tautan Eksternal (URL Google Drive / Notion / Spreadsheet)</option>
                                            </select>
                                            {(errors as any)[`variations.${index}.delivery_type`] && (
                                                <p className="mt-2 text-sm text-red-600 font-medium">{(errors as any)[`variations.${index}.delivery_type`]}</p>
                                            )}
                                        </div>

                                        {variation.delivery_type === 'file' ? (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                    File Produk (Zip/PDF) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".zip,.rar,.pdf"
                                                    onChange={(e) => updateVariation(index, 'product_file', e.target.files ? e.target.files[0] : null)}
                                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                                    required
                                                />
                                                <p className="text-xs text-zinc-500 mt-2">File utama untuk variasi ini (Maksimal ukuran 50MB).</p>
                                                {(errors as any)[`variations.${index}.product_file`] && (
                                                    <p className="mt-2 text-sm text-red-600 font-medium">{(errors as any)[`variations.${index}.product_file`]}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                                    URL / Tautan Eksternal <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    value={variation.file_url}
                                                    onChange={(e) => updateVariation(index, 'file_url', e.target.value)}
                                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                                    placeholder="Contoh: https://drive.google.com/drive/folders/..."
                                                    required
                                                />
                                                <p className="text-xs text-zinc-500 mt-2">Tautan ini akan langsung dibuka saat pembeli menekan tombol Unduh di area member.</p>
                                                {(errors as any)[`variations.${index}.file_url`] && (
                                                    <p className="mt-2 text-sm text-red-600 font-medium">{(errors as any)[`variations.${index}.file_url`]}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <Link
                            href={admin.products.index()}
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
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
