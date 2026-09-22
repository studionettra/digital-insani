import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrixEditor } from '@/components/ui/trix-editor';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
};

export default function EditCategory({ category }: { category: Category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        is_active: category.is_active ? '1' : '0',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    const breadcrumbs = [
        { title: 'Admin Dashboard', href: admin.dashboard() },
        { title: 'Kategori', href: admin.categories.index() },
        { title: 'Edit', href: '#' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kategori | Admin" />

            <PageHeader
                title="Edit Kategori"
                description="Ubah informasi kategori ini."
            >
                <Link
                    href={admin.categories.index()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
                >
                    <ArrowLeft className="size-4" />
                    Kembali
                </Link>
            </PageHeader>

            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs p-6 lg:p-8 max-w-3xl">

                <form onSubmit={submit} className="mt-8 space-y-10">
                    
                    <section className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Kategori <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="is_active">Status <span className="text-red-500">*</span></Label>
                                <Select 
                                    value={data.is_active}
                                    onValueChange={(value) => setData('is_active', value)}
                                >
                                    <SelectTrigger id="is_active">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Aktif</SelectItem>
                                        <SelectItem value="0">Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.is_active} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label>Deskripsi Kategori</Label>
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
        </AdminLayout>
    );
}
