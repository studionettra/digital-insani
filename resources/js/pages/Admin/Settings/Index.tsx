import { Head, useForm, router } from '@inertiajs/react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import admin from '@/routes/admin';

export default function SettingsIndex({ settings }: { settings: any }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        support_email: settings.support_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || '',
        logo: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.settings.update(), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: admin.dashboard() },
                    { title: 'Pengaturan', href: admin.settings.index() },
                ]}
            />
            
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-4xl">
                <Heading
                    title="Pengaturan Situs"
                    description="Kelola konfigurasi utama aplikasi dan informasi publik toko digital Anda."
                />

                <form onSubmit={submit} className="mt-8 space-y-10" encType="multipart/form-data">
                    
                    <section className="space-y-6">
                        <Heading
                            variant="small"
                            title="Identitas & Brand"
                            description="Informasi ini akan muncul di header, footer, dan email yang dikirim ke pelanggan."
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2 max-w-md">
                                <Label htmlFor="logo">Logo Situs</Label>
                                {settings.logo_url && (
                                    <div className="mb-2 p-4 border rounded-md bg-zinc-50 dark:bg-zinc-900 flex justify-center">
                                        <img src={settings.logo_url} alt="Logo" className="h-12 object-contain" />
                                    </div>
                                )}
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setData('logo', e.target.files ? e.target.files[0] : null)}
                                />
                                <p className="text-xs text-zinc-500">Format PNG/JPG maksimal 2MB. Biarkan kosong jika tidak ingin mengubah.</p>
                                {errors.logo && <p className="text-sm text-red-600">{errors.logo}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="site_name">Nama Toko *</Label>
                                <Input
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={e => setData('site_name', e.target.value)}
                                    required
                                />
                                {errors.site_name && <p className="text-sm text-red-600">{errors.site_name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="support_email">Email Bantuan (Support) *</Label>
                                <Input
                                    id="support_email"
                                    type="email"
                                    value={data.support_email}
                                    onChange={e => setData('support_email', e.target.value)}
                                    required
                                />
                                {errors.support_email && <p className="text-sm text-red-600">{errors.support_email}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact_phone">No. Telepon / WhatsApp</Label>
                                <Input
                                    id="contact_phone"
                                    type="text"
                                    value={data.contact_phone}
                                    onChange={e => setData('contact_phone', e.target.value)}
                                />
                                {errors.contact_phone && <p className="text-sm text-red-600">{errors.contact_phone}</p>}
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="address">Alamat Fisik</Label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                                />
                                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
