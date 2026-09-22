import { Head, useForm, Link } from '@inertiajs/react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';

export default function CreateMember() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/members');
    };

    return (
        <AdminLayout>
            <Head title="Tambah Member | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Member', href: '/admin/members' },
                    { title: 'Tambah', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/members"
                            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
                                Tambah Member Baru
                            </h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400">
                                Daftarkan pengguna baru dengan akun dan hak akses sebagai member platform.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bento-card border-none ring-1 ring-border shadow-sm p-6 lg:p-8">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                        placeholder="Contoh: Budi Santoso"
                                        required
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Alamat Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                        placeholder="budi@example.com"
                                        required
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Kata Sandi (Password) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 font-mono"
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                    {errors.password && <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 dark:text-zinc-400 space-y-3">
                                    <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        Keamanan Akun
                                    </div>
                                    <p className="leading-relaxed">
                                        Pastikan kata sandi memiliki panjang minimal 8 karakter dengan kombinasi huruf dan angka.
                                    </p>
                                    <p className="leading-relaxed">
                                        Member yang didaftarkan dapat langsung masuk dan mengakses modul pembelian serta area unduhan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <Link
                                href="/admin/members"
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
                                {processing ? 'Menyimpan...' : 'Simpan Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
