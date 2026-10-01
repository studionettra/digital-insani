import { Head, useForm, Link } from '@inertiajs/react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrixEditor } from '@/components/ui/trix-editor';
import { ArrowLeft, Save, Plus, Trash2, BookOpen, Code2, ExternalLink } from 'lucide-react';
import InputError from '@/components/input-error';

export default function EditProduct({ product, categories }: { product: any, categories: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: product.title || '',
        category_id: product.category_id?.toString() || '',
        description: product.description || '',
        demo_url: product.demo_url || '',
        cover_image: null as File | null,
        preview_pdf: null as File | null,
        code_snippet: product.code_snippet || '',
        code_snippet_lang: product.code_snippet_lang || 'php',
        variations: product.variations && product.variations.length > 0 
            ? product.variations.map((v: any) => ({
                id: v.id,
                name: v.name,
                price: v.price.toString(),
                delivery_type: v.delivery_type || 'file',
                product_file: null as File | null,
                file_url: v.file_url || '',
                existing_file_path: v.file_path,
            }))
            : [{ name: 'Lisensi Personal', price: '', delivery_type: 'file', product_file: null as File | null, file_url: '', existing_file_path: null }],
    });

    const addVariation = () => {
        setData('variations', [
            ...data.variations,
            { id: null, name: '', price: '', delivery_type: 'file', product_file: null, file_url: '', existing_file_path: null }
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
        post(`/admin/products/${product.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Produk | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Produk', href: '/admin/products' },
                    { title: 'Edit', href: '#' },
                ]}
            />
            
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-5xl mx-auto w-full">
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Kembali</span>
                    </Link>
                    <Heading
                        title="Edit Produk"
                        description={`Memperbarui detail untuk produk: ${product.title}`}
                        variant="small"
                    />
                </div>

                <form onSubmit={submit} className="mt-8 space-y-10">
                    
                    {/* Informasi Dasar */}
                    <section className="space-y-6">
                        <Heading
                            variant="small"
                            title="Informasi Dasar"
                            description="Tentukan nama, kategori, dan deskripsi produk Anda."
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="title">Judul Produk <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Contoh: Template Presentasi Modern"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2 md:col-span-2 md:max-w-md">
                                <Label htmlFor="category_id">Kategori <span className="text-red-500">*</span></Label>
                                <Select 
                                    defaultValue={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger id="category_id">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="demo_url">URL Live Demo (Opsional)</Label>
                                <Input
                                    id="demo_url"
                                    type="url"
                                    value={data.demo_url}
                                    onChange={(e) => setData('demo_url', e.target.value)}
                                    placeholder="https://preview.digitalinsani.com/demo"
                                />
                                <p className="text-xs text-muted-foreground">Tautan live demo atau preview interaktif.</p>
                                <InputError message={errors.demo_url} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label>Deskripsi Produk</Label>
                                <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950">
                                    <TrixEditor
                                        value={data.description}
                                        onChange={(html) => setData('description', html)}
                                    />
                                </div>
                                <InputError message={errors.description} />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Media */}
                    <section className="space-y-6">
                        <Heading
                            variant="small"
                            title="Gambar Sampul"
                            description="Unggah gambar utama baru jika ingin mengganti yang lama."
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            {product.cover_image && (
                                <div className="grid gap-2">
                                    <Label>Gambar Saat Ini</Label>
                                    <div className="h-40 w-40 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                                        <img src={`/storage/${product.cover_image}`} alt={product.title} className="h-full w-full object-cover" />
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2 md:max-w-md">
                                <Label htmlFor="cover_image">Ganti Gambar Cover (Max: 2MB)</Label>
                                <Input
                                    id="cover_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('cover_image', e.target.files ? e.target.files[0] : null)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Kosongkan jika tidak ingin mengubah gambar.</p>
                                <InputError message={errors.cover_image} />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Preview Assets: Cuplikan Sampel PDF & Code Sandbox */}
                    <section className="space-y-6">
                        <Heading
                            variant="small"
                            title="Cuplikan Sampel & Code Sandbox (Opsional)"
                            description="Tampilkan cuplikan dokumen atau kode arsitektur di halaman produk tanpa harus meninggalkan website."
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Sampel PDF */}
                            <div className="space-y-3">
                                <Label htmlFor="preview_pdf">Unggah Berkas Sampel PDF (Excerpt)</Label>
                                {product.preview_pdf && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs">
                                        <BookOpen className="w-4 h-4 text-rose-500 shrink-0" />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                            {product.preview_pdf}
                                        </span>
                                        <a
                                            href={`/storage/${product.preview_pdf}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-auto inline-flex items-center gap-1 text-blue-600 hover:underline shrink-0"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Lihat
                                        </a>
                                    </div>
                                )}
                                <Input
                                    id="preview_pdf"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => setData('preview_pdf', e.target.files ? e.target.files[0] : null)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {product.preview_pdf ? 'Unggah file PDF baru jika ingin mengganti sampel yang sudah ada (Max 10MB).' : 'Maksimal 10MB (.pdf). Calon pembeli dapat membaca sampel beberapa halaman lewat popup viewer interaktif.'}
                                </p>
                                <InputError message={errors.preview_pdf} />
                            </div>

                            {/* Bahasa Cuplikan Kode */}
                            <div className="space-y-3">
                                <Label htmlFor="code_snippet_lang">Bahasa Pemrograman Cuplikan</Label>
                                <select
                                    id="code_snippet_lang"
                                    value={data.code_snippet_lang}
                                    onChange={(e) => setData('code_snippet_lang', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-zinc-950"
                                >
                                    <option value="php">PHP</option>
                                    <option value="typescript">TypeScript</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="bash">Bash / Shell</option>
                                    <option value="html">HTML / Blade</option>
                                    <option value="sql">SQL</option>
                                    <option value="json">JSON</option>
                                </select>
                                <p className="text-xs text-muted-foreground">Label bahasa yang akan ditampilkan pada terminal sandbox.</p>
                                <InputError message={errors.code_snippet_lang} />
                            </div>
                        </div>

                        {/* Cuplikan Kode Textarea */}
                        <div className="space-y-2">
                            <Label htmlFor="code_snippet">Isi Cuplikan Kode (Code Sandbox Demo)</Label>
                            <textarea
                                id="code_snippet"
                                rows={6}
                                value={data.code_snippet}
                                onChange={(e) => setData('code_snippet', e.target.value)}
                                className="w-full font-mono text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 leading-relaxed shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="// Contoh struktur class, cuplikan fungsi penting, atau integrasi API..."
                            />
                            <p className="text-xs text-muted-foreground">Akan dirender dalam terminal mockup dengan tombol 1-klik salin kode.</p>
                            <InputError message={errors.code_snippet} />
                        </div>
                    </section>

                    <Separator />

                    {/* Variasi & File Utama */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Heading
                                variant="small"
                                title="Harga & Variasi File Digital"
                                description="Atur harga dan unggah file untuk berbagai lisensi/variasi produk."
                            />
                            <Button type="button" variant="outline" size="sm" onClick={addVariation}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Variasi
                            </Button>
                        </div>

                        {typeof errors === 'object' && Object.keys(errors).some(k => k.startsWith('variations')) && (
                            <div className="rounded-md bg-red-50 p-4 mb-4">
                                <p className="text-sm font-medium text-red-800">Terdapat kesalahan pada isian variasi. Harap periksa kolom di bawah.</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {data.variations.map((variation, index) => (
                                <div key={index} className="relative rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    {data.variations.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariation(index)}
                                            className="absolute -top-3 -right-3 h-8 w-8 inline-flex items-center justify-center rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Hapus variasi</span>
                                        </button>
                                    )}
                                    
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label>Nama Variasi / Lisensi <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={variation.name}
                                                onChange={(e) => updateVariation(index, 'name', e.target.value)}
                                                placeholder="Contoh: Personal License"
                                                required
                                            />
                                            <InputError message={(errors as any)[`variations.${index}.name`]} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Harga (Rp) <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={variation.price}
                                                onChange={(e) => updateVariation(index, 'price', e.target.value)}
                                                placeholder="0"
                                                required
                                            />
                                            <InputError message={(errors as any)[`variations.${index}.price`]} />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label>Tipe Pengiriman <span className="text-red-500">*</span></Label>
                                            <Select 
                                                value={variation.delivery_type}
                                                onValueChange={(value) => updateVariation(index, 'delivery_type', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Tipe Pengiriman" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="file">Unggah File Fisik (Google Drive)</SelectItem>
                                                    <SelectItem value="url">Tautan Eksternal (URL / GDrive / GSheet)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={(errors as any)[`variations.${index}.delivery_type`]} />
                                        </div>

                                        {variation.delivery_type === 'file' ? (
                                            <div className="grid gap-2 md:col-span-2 md:max-w-md">
                                                <Label>
                                                    {variation.existing_file_path ? 'Ganti File Produk (Zip/PDF)' : 'File Produk (Zip/PDF)'} 
                                                    {!variation.existing_file_path && <span className="text-red-500"> *</span>}
                                                </Label>
                                                <Input
                                                    type="file"
                                                    accept=".zip,.rar,.pdf"
                                                    onChange={(e) => updateVariation(index, 'product_file', e.target.files ? e.target.files[0] : null)}
                                                    required={!variation.existing_file_path}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {variation.existing_file_path 
                                                        ? 'Kosongkan jika tidak ingin mengubah file (File sudah dilampirkan).' 
                                                        : 'File untuk variasi ini (Max: 50MB).'}
                                                </p>
                                                <InputError message={(errors as any)[`variations.${index}.product_file`]} />
                                            </div>
                                        ) : (
                                            <div className="grid gap-2 md:col-span-2">
                                                <Label>URL / Tautan Eksternal <span className="text-red-500">*</span></Label>
                                                <Input
                                                    type="url"
                                                    value={variation.file_url}
                                                    onChange={(e) => updateVariation(index, 'file_url', e.target.value)}
                                                    placeholder="Contoh: https://docs.google.com/spreadsheets/d/..."
                                                    required
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {variation.existing_file_path && 'Peringatan: Jika Anda mengubah ke tipe URL, file fisik lama akan dihapus.'} 
                                                    Tautan ini akan langsung dibuka saat pembeli menekan tombol Unduh.
                                                </p>
                                                <InputError message={(errors as any)[`variations.${index}.file_url`]} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex items-center justify-end gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
