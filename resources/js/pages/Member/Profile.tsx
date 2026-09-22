import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import MemberLayout from '@/layouts/MemberLayout';
import { FormEvent } from 'react';

export default function Profile() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user?.role === 'admin';
    
    const { data, setData, put, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('member.profile.update'), {
            preserveScroll: true,
            onSuccess: () => setData({
                name: data.name,
                email: data.email,
                phone: data.phone,
                current_password: '',
                password: '',
                password_confirmation: '',
            }),
        });
    };

    const content = (
        <>
            <Head title="Profil Saya | Digital Insani" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Pengaturan Profil</h1>
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Perbarui informasi akun dan kata sandi Anda.</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Lengkap</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Alamat Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nomor WhatsApp / HP</label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Ubah Kata Sandi</h3>
                                <p className="text-sm text-zinc-500 mb-6">Kosongkan jika Anda tidak ingin mengubah kata sandi.</p>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="current_password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kata Sandi Saat Ini</label>
                                        <input
                                            id="current_password"
                                            type="password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.current_password && <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kata Sandi Baru</label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Konfirmasi Kata Sandi Baru</label>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                
                                {recentlySuccessful && (
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Berhasil disimpan.</p>
                                )}
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </>
    );

    return isAdmin ? (
        <AdminLayout>
            {content}
        </AdminLayout>
    ) : (
        <MemberLayout>
            {content}
        </MemberLayout>
    );
}
