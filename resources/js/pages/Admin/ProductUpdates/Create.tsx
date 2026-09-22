import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Mail, Sparkles } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import admin from '@/routes/admin';

export default function ProductUpdatesCreate({ products }: { products: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        version: '',
        changelog: '',
        email_message: '',
        notify_users: false,
        published_at: new Date().toISOString().slice(0, 16),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.productUpdates.store());
    };

    return (
        <AdminLayout>
            <Head title="Buat Pembaruan Produk | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: admin.dashboard() },
                    { title: 'Pembaruan Produk', href: admin.productUpdates.index() },
                    { title: 'Buat Baru', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={admin.productUpdates.index()}
                            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
                                Rilis Pembaruan Baru
                            </h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400">
                                Publikasikan versi terbaru produk dan bagikan catatan perubahan kepada pelanggan.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bento-card border-none ring-1 ring-border shadow-sm p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Top Section: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <label htmlFor="product_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Pilih Produk <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="product_id"
                                        value={data.product_id}
                                        onChange={e => setData('product_id', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                        required
                                    >
                                        <option value="" disabled>Pilih Produk yang Diperbarui</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                    {errors.product_id && <p className="mt-2 text-sm text-red-600 font-medium">{errors.product_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="version" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Nomor Versi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="version"
                                        value={data.version}
                                        onChange={e => setData('version', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 font-mono"
                                        placeholder="Contoh: 1.0.1 atau 2.0.0"
                                        required
                                    />
                                    {errors.version && <p className="mt-2 text-sm text-red-600 font-medium">{errors.version}</p>}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="published_at" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Tanggal & Waktu Rilis
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="published_at"
                                        value={data.published_at}
                                        onChange={e => setData('published_at', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    />
                                    {errors.published_at && <p className="mt-2 text-sm text-red-600 font-medium">{errors.published_at}</p>}
                                </div>

                                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
                                    <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300 text-sm">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        Panduan Versi
                                    </div>
                                    <p className="leading-relaxed">
                                        Disarankan menggunakan penomoran versi SemVer (contoh: <code>1.0.0</code> untuk rilis awal, <code>1.1.0</code> untuk fitur baru, <code>1.0.1</code> untuk patch perbaikan bug).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Changelog */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="changelog" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Catatan Perubahan (Changelog Markdown) <span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full font-medium">
                                    Markdown Didukung
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Tuliskan rincian fitur baru, perbaikan bug, atau instruksi pembaruan yang akan tampil di portal member.
                            </p>
                            <textarea
                                id="changelog"
                                value={data.changelog}
                                onChange={e => setData('changelog', e.target.value)}
                                className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3.5 min-h-[220px] font-mono text-sm leading-relaxed"
                                placeholder={"### Fitur Baru\n- Menambahkan dukungan integrasi API baru\n- Peningkatan kecepatan pemuatan aset\n\n### Perbaikan Bug\n- Memperbaiki masalah validasi formulir checkout"}
                                required
                            />
                            {errors.changelog && <p className="mt-2 text-sm text-red-600 font-medium">{errors.changelog}</p>}
                        </div>

                        {/* Secondary Section: Email Message */}
                        <div className="p-6 lg:p-8 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Pesan Notifikasi Email Pelanggan</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Pesan ekstra atau salam pembuka yang disisipkan ke dalam email notifikasi pembeli produk.</p>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email_message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Pesan Email Tambahan (Opsional)
                                </label>
                                <textarea
                                    id="email_message"
                                    value={data.email_message}
                                    onChange={e => setData('email_message', e.target.value)}
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3 min-h-[100px]"
                                    placeholder="Halo, pembaruan penting telah dirilis untuk produk yang Anda miliki. Silakan akses area member untuk mengunduh versi terbaru..."
                                />
                                {errors.email_message && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email_message}</p>}
                            </div>
                        </div>

                        {/* Bottom Section: Broadcast Email Checkbox */}
                        <div>
                            <label htmlFor="notify_users" className="inline-flex items-start sm:items-center gap-3.5 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors">
                                <input
                                    id="notify_users"
                                    type="checkbox"
                                    checked={data.notify_users}
                                    onChange={e => setData('notify_users', e.target.checked)}
                                    className="w-5 h-5 mt-0.5 sm:mt-0 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950 dark:checked:bg-primary transition-colors cursor-pointer"
                                />
                                <div className="select-none">
                                    <span className="block text-sm font-medium text-zinc-900 dark:text-white">
                                        Kirim Email Notifikasi Otomatis ke Pembeli
                                    </span>
                                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        Sistem akan mengirimkan email blast pengumuman rilis ini kepada semua pembeli produk terkait.
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <Link
                                href={admin.productUpdates.index()}
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
                                {processing ? 'Menyimpan...' : 'Simpan Rilis'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
