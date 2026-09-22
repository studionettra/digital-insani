import { Head, useForm, Link } from '@inertiajs/react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrixEditor } from '@/components/ui/trix-editor';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';

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

    return (
        <AdminLayout>
            <Head title="Edit Kategori | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Kategori', href: '/admin/categories' },
                    { title: 'Edit', href: '#' },
                ]}
            />
            
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-5xl mx-auto w-full">
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/admin/categories"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Kembali</span>
                    </Link>
                    <Heading
                        title="Edit Kategori"
                        description="Ubah informasi kategori ini."
                        variant="small"
                    />
                </div>

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
            </div>
        </AdminLayout>
    );
}
