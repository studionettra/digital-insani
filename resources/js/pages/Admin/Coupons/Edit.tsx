import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import admin from '@/routes/admin';

export default function CouponsEdit({ coupon }: { coupon: any }) {
    const formatDateTimeForInput = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16);
    };

    const { data, setData, put, processing, errors } = useForm({
        code: coupon.code,
        description: coupon.description || '',
        discount_type: coupon.discount_type || 'fixed',
        discount_amount: coupon.discount_amount,
        max_uses: coupon.max_uses || '',
        valid_from: formatDateTimeForInput(coupon.valid_from),
        valid_until: formatDateTimeForInput(coupon.valid_until),
        is_active: coupon.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.coupons.update(coupon.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Kupon ${coupon.code} | Admin`} />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: admin.dashboard() },
                    { title: 'Kupon Diskon', href: admin.coupons.index() },
                    { title: 'Edit', href: '#' },
                ]}
            />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="flex items-center gap-4 max-w-3xl">
                    <Link href={admin.coupons.index()} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-zinc-500" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Edit Kupon: {coupon.code}</h1>
                </div>

                <div className="bento-card p-6 md:p-8 max-w-3xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="code" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kode Kupon *</label>
                                <input
                                    type="text"
                                    id="code"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value.toUpperCase())}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm uppercase font-mono"
                                    placeholder="PROMO2026"
                                    required
                                />
                                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Deskripsi</label>
                                <textarea
                                    id="description"
                                    rows={2}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                                    placeholder="Diskon khusus untuk event..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div>
                                <label htmlFor="discount_type" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tipe Diskon *</label>
                                <select
                                    id="discount_type"
                                    value={data.discount_type}
                                    onChange={e => setData('discount_type', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                                >
                                    <option value="fixed">Nominal Tetap (Rp)</option>
                                    <option value="percentage">Persentase (%)</option>
                                </select>
                                {errors.discount_type && <p className="mt-1 text-sm text-red-600">{errors.discount_type}</p>}
                            </div>

                            <div>
                                <label htmlFor="discount_amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nilai Diskon *</label>
                                <input
                                    type="number"
                                    id="discount_amount"
                                    value={data.discount_amount}
                                    onChange={e => setData('discount_amount', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                                    placeholder={data.discount_type === 'percentage' ? '10' : '50000'}
                                    min="0"
                                    step={data.discount_type === 'percentage' ? '0.1' : '1'}
                                    required
                                />
                                {errors.discount_amount && <p className="mt-1 text-sm text-red-600">{errors.discount_amount}</p>}
                            </div>

                            <div>
                                <label htmlFor="max_uses" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Batas Kuota Penggunaan (Opsional)</label>
                                <input
                                    type="number"
                                    id="max_uses"
                                    value={data.max_uses}
                                    onChange={e => setData('max_uses', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                                    placeholder="Biarkan kosong untuk unlimited"
                                    min="1"
                                />
                                {errors.max_uses && <p className="mt-1 text-sm text-red-600">{errors.max_uses}</p>}
                                <p className="mt-1 text-xs text-zinc-500">Kupon ini telah digunakan {coupon.used_count} kali.</p>
                            </div>
                            
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-primary"
                                    />
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Kupon Aktif</span>
                                </label>
                            </div>

                            <div>
                                <label htmlFor="valid_from" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Berlaku Dari (Opsional)</label>
                                <input
                                    type="datetime-local"
                                    id="valid_from"
                                    value={data.valid_from}
                                    onChange={e => setData('valid_from', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                                />
                                {errors.valid_from && <p className="mt-1 text-sm text-red-600">{errors.valid_from}</p>}
                            </div>

                            <div>
                                <label htmlFor="valid_until" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Berlaku Sampai (Opsional)</label>
                                <input
                                    type="datetime-local"
                                    id="valid_until"
                                    value={data.valid_until}
                                    onChange={e => setData('valid_until', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                                />
                                {errors.valid_until && <p className="mt-1 text-sm text-red-600">{errors.valid_until}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end border-t border-border mt-6 pt-6 gap-4">
                            <Link
                                href={admin.coupons.index()}
                                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 focus:outline-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
