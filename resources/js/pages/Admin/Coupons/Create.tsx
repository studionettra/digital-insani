import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Sparkles, Tag } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import admin from '@/routes/admin';

export default function CouponsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        description: '',
        discount_type: 'fixed',
        discount_amount: '',
        max_uses: '',
        valid_from: '',
        valid_until: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.coupons.store());
    };

    return (
        <AdminLayout>
            <Head title="Buat Kupon Diskon | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: admin.dashboard() },
                    { title: 'Kupon Diskon', href: admin.coupons.index() },
                    { title: 'Buat Baru', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={admin.coupons.index()}
                            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
                                Buat Kupon Baru
                            </h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400">
                                Atur kode kupon promosi, besaran diskon, dan batas kuota penggunaan.
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
                                    <label htmlFor="code" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Kode Kupon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value.toUpperCase())}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 uppercase font-mono tracking-wider font-semibold"
                                        placeholder="PROMO2026"
                                        required
                                    />
                                    {errors.code && <p className="mt-2 text-sm text-red-600 font-medium">{errors.code}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Deskripsi Kupon (Opsional)
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white px-4 py-3 min-h-[90px]"
                                        placeholder="Diskon khusus untuk event peluncuran..."
                                    />
                                    {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 dark:text-zinc-400 space-y-3">
                                    <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        Tips Kupon Diskon
                                    </div>
                                    <p className="leading-relaxed">
                                        Gunakan kode yang mudah diingat seperti <strong>HEMAT10</strong> atau <strong>DISKON50K</strong>.
                                    </p>
                                    <p className="leading-relaxed">
                                        Batas kuota dan masa berlaku dapat dikosongkan jika kupon berlaku selamanya tanpa batas pengguna.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Discount Rules */}
                        <div className="p-6 lg:p-8 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Ketentuan & Besaran Diskon</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Tentukan persentase potongan harga atau nilai nominal tetap.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="discount_type" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Tipe Diskon <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="discount_type"
                                        value={data.discount_type}
                                        onChange={e => setData('discount_type', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    >
                                        <option value="fixed">Nominal Tetap (Rp)</option>
                                        <option value="percentage">Persentase (%)</option>
                                    </select>
                                    {errors.discount_type && <p className="mt-2 text-sm text-red-600 font-medium">{errors.discount_type}</p>}
                                </div>

                                <div>
                                    <label htmlFor="discount_amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Nilai Diskon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="discount_amount"
                                        value={data.discount_amount}
                                        onChange={e => setData('discount_amount', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                        placeholder={data.discount_type === 'percentage' ? 'Contoh: 10' : 'Contoh: 50000'}
                                        min="0"
                                        step={data.discount_type === 'percentage' ? '0.1' : '1'}
                                        required
                                    />
                                    {errors.discount_amount && <p className="mt-2 text-sm text-red-600 font-medium">{errors.discount_amount}</p>}
                                </div>

                                <div>
                                    <label htmlFor="max_uses" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Batas Kuota Penggunaan (Opsional)
                                    </label>
                                    <input
                                        type="number"
                                        id="max_uses"
                                        value={data.max_uses}
                                        onChange={e => setData('max_uses', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                        placeholder="Biarkan kosong untuk tanpa batas (unlimited)"
                                        min="1"
                                    />
                                    {errors.max_uses && <p className="mt-2 text-sm text-red-600 font-medium">{errors.max_uses}</p>}
                                </div>

                                <div>
                                    <label htmlFor="valid_from" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Berlaku Mulai (Opsional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="valid_from"
                                        value={data.valid_from}
                                        onChange={e => setData('valid_from', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    />
                                    {errors.valid_from && <p className="mt-2 text-sm text-red-600 font-medium">{errors.valid_from}</p>}
                                </div>

                                <div>
                                    <label htmlFor="valid_until" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Berlaku Sampai (Opsional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="valid_until"
                                        value={data.valid_until}
                                        onChange={e => setData('valid_until', e.target.value)}
                                        className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors bg-white hover:bg-zinc-50 focus:bg-white px-4 py-3"
                                    />
                                    {errors.valid_until && <p className="mt-2 text-sm text-red-600 font-medium">{errors.valid_until}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Active Status Checkbox */}
                        <div>
                            <label htmlFor="is_active" className="inline-flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950 dark:checked:bg-primary transition-colors cursor-pointer"
                                />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none pr-2">
                                    Aktifkan Kupon Ini Sekarang
                                </span>
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <Link
                                href={admin.coupons.index()}
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
                                {processing ? 'Menyimpan...' : 'Simpan Kupon'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
