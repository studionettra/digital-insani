import { Head, useForm, Link } from '@inertiajs/react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';

type Member = {
    id: number;
    name: string;
    email: string;
};

export default function EditMember({ member }: { member: Member }) {
    const { data, setData, put, processing, errors } = useForm({
        name: member.name || '',
        email: member.email || '',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/members/${member.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Member | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Member', href: '/admin/members' },
                    { title: 'Edit', href: '#' },
                ]}
            />
            
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-5xl mx-auto w-full">
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/admin/members"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Kembali</span>
                    </Link>
                    <Heading
                        title="Edit Member"
                        description="Ubah informasi profil pengguna."
                        variant="small"
                    />
                </div>

                <form onSubmit={submit} className="mt-8 space-y-10">
                    
                    <section className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="password">Password (Opsional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                />
                                <InputError message={errors.password} />
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
