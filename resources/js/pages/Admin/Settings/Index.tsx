import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import admin from '@/routes/admin';

export default function SettingsIndex({ settings }: { settings: any }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        support_email: settings.support_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || '',
        logo: null as File | null,
        flash_sale_active: settings.flash_sale_active ?? true,
        flash_sale_title: settings.flash_sale_title || '',
        flash_sale_ends_at: settings.flash_sale_ends_at || '',
        flash_sale_discount_percentage: settings.flash_sale_discount_percentage ?? 30,
        whatsapp_notification_active: settings.whatsapp_notification_active ?? false,
        whatsapp_provider: settings.whatsapp_provider || 'fonnte',
        whatsapp_api_token: settings.whatsapp_api_token || '',
        whatsapp_message_template: settings.whatsapp_message_template || '',
    });

    const [testPhone, setTestPhone] = useState('');
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSendTest = () => {
        if (!testPhone) return;
        setIsSendingTest(true);
        setTestResult(null);

        router.post('/admin/settings/test-whatsapp', {
            phone: testPhone,
        }, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                const flash = page.props?.flash;
                if (flash?.success) {
                    setTestResult({ success: true, message: flash.success });
                } else if (flash?.error) {
                    setTestResult({ success: false, message: flash.error });
                }
            },
            onError: (err) => {
                setTestResult({ success: false, message: (Object.values(err)[0] as string) || 'Gagal mengirim pesan uji coba.' });
            },
            onFinish: () => setIsSendingTest(false),
        });
    };

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

                    <section className="space-y-6">
                        <Heading
                            variant="small"
                            title="Flash Sale & Urgensi Penjualan"
                            description="Konfigurasi hitung mundur dinamis dan banner promosi kilat di seluruh halaman publik."
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.flash_sale_active)}
                                        onChange={e => setData('flash_sale_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                        Aktifkan Banner & Timer Flash Sale
                                    </span>
                                </label>
                                <p className="text-xs text-zinc-500">Jika dicentang, bar promosi di atas navbar dan indikator urgensi di halaman produk akan menyala.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="flash_sale_title">Judul / Teks Promo</Label>
                                <Input
                                    id="flash_sale_title"
                                    value={data.flash_sale_title}
                                    onChange={e => setData('flash_sale_title', e.target.value)}
                                    placeholder="⚡ Flash Sale Spesial — Diskon Kilat!"
                                />
                                {errors.flash_sale_title && <p className="text-sm text-red-600">{errors.flash_sale_title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="flash_sale_discount_percentage">Persentase Diskon (%)</Label>
                                <Input
                                    id="flash_sale_discount_percentage"
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={data.flash_sale_discount_percentage}
                                    onChange={e => setData('flash_sale_discount_percentage', Number(e.target.value))}
                                />
                                {errors.flash_sale_discount_percentage && <p className="text-sm text-red-600">{errors.flash_sale_discount_percentage}</p>}
                            </div>

                            <div className="grid gap-2 md:col-span-2 max-w-md">
                                <Label htmlFor="flash_sale_ends_at">Waktu Berakhir Flash Sale</Label>
                                <Input
                                    id="flash_sale_ends_at"
                                    type="datetime-local"
                                    value={data.flash_sale_ends_at}
                                    onChange={e => setData('flash_sale_ends_at', e.target.value)}
                                />
                                {errors.flash_sale_ends_at && <p className="text-sm text-red-600">{errors.flash_sale_ends_at}</p>}
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* WhatsApp Gateway Integration */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <Heading
                                    variant="small"
                                    title="Integrasi Notifikasi WhatsApp (Fonnte)"
                                    description="Kirimkan notifikasi konfirmasi lunas, tautan unduhan instan, dan invoice resmi langsung ke WhatsApp pembeli."
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 sm:p-6 space-y-6">
                            {/* Toggle WhatsApp Active */}
                            <div className="grid gap-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.whatsapp_notification_active)}
                                        onChange={e => setData('whatsapp_notification_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                        Aktifkan Pengiriman Notifikasi WhatsApp Otomatis
                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold uppercase">
                                            Fonnte Supported
                                        </span>
                                    </span>
                                </label>
                                <p className="text-xs text-zinc-500">
                                    Jika dicentang, setiap kali webhook pembayaran Midtrans sukses diverifikasi, background queue job akan otomatis mengirim pesan konfirmasi ke nomor WhatsApp pembeli.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Provider Gateway */}
                                <div className="grid gap-2">
                                    <Label htmlFor="whatsapp_provider">Gateway Provider</Label>
                                    <select
                                        id="whatsapp_provider"
                                        value={data.whatsapp_provider}
                                        onChange={e => setData('whatsapp_provider', e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="fonnte">Fonnte (Rekomendasi Utama — fonnte.com)</option>
                                        <option value="wablas">Wablas (wablas.com)</option>
                                        <option value="custom">Custom Webhook / Log Only</option>
                                    </select>
                                    <p className="text-xs text-zinc-500">Pilih provider WhatsApp yang Anda gunakan.</p>
                                    {errors.whatsapp_provider && <p className="text-sm text-red-600">{errors.whatsapp_provider}</p>}
                                </div>

                                {/* API Token */}
                                <div className="grid gap-2">
                                    <Label htmlFor="whatsapp_api_token">Token API Gateway *</Label>
                                    <Input
                                        id="whatsapp_api_token"
                                        type="password"
                                        value={data.whatsapp_api_token}
                                        onChange={e => setData('whatsapp_api_token', e.target.value)}
                                        placeholder="Masukkan token dari dasbor Fonnte"
                                    />
                                    <p className="text-xs text-zinc-500">
                                        Dapatkan token pada menu <strong>API / Device</strong> di dasbor <a href="https://dashboard.fonnte.com" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Fonnte</a>.
                                    </p>
                                    {errors.whatsapp_api_token && <p className="text-sm text-red-600">{errors.whatsapp_api_token}</p>}
                                </div>
                            </div>

                            {/* Template Pesan */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="whatsapp_message_template">Template Pesan WhatsApp</Label>
                                    <span className="text-xs text-zinc-400">Mendukung format teks WhatsApp (*tebal*, _miring_)</span>
                                </div>
                                <textarea
                                    id="whatsapp_message_template"
                                    rows={8}
                                    value={data.whatsapp_message_template}
                                    onChange={e => setData('whatsapp_message_template', e.target.value)}
                                    className="font-mono text-xs leading-relaxed block w-full rounded-md border border-zinc-300 shadow-xs focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white p-3"
                                    placeholder="Format pesan..."
                                />
                                <div className="p-3.5 bg-zinc-100 dark:bg-zinc-850 rounded-xl space-y-2 border border-zinc-200/60 dark:border-zinc-800">
                                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                                        Variabel Dinamis yang Tersedia (Klik untuk Menambahkan ke Pesan):
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            { token: '{customer_name}', label: 'Nama Pembeli' },
                                            { token: '{order_number}', label: 'No. Order' },
                                            { token: '{total_amount}', label: 'Total Nominal' },
                                            { token: '{product_names}', label: 'Daftar Produk' },
                                            { token: '{download_url}', label: 'Link Unduh Berkas' },
                                            { token: '{invoice_url}', label: 'Link Invoice PDF' },
                                            { token: '{site_name}', label: 'Nama Toko' },
                                        ].map(v => (
                                            <button
                                                key={v.token}
                                                type="button"
                                                onClick={() => setData('whatsapp_message_template', data.whatsapp_message_template + ' ' + v.token)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-750 border border-zinc-200 dark:border-zinc-650 text-[11px] font-mono font-medium hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer text-zinc-700 dark:text-zinc-200 transition-colors shadow-2xs"
                                                title={`Klik untuk menambahkan ${v.token}`}
                                            >
                                                <span>{v.token}</span>
                                                <span className="text-zinc-400 text-[10px]">({v.label})</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {errors.whatsapp_message_template && <p className="text-sm text-red-600">{errors.whatsapp_message_template}</p>}
                            </div>

                            {/* Uji Coba Pengiriman Pesan */}
                            <div className="pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40">
                                <Label className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-2">
                                    Uji Coba Pengiriman WhatsApp (Test Sandbox)
                                </Label>
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <Input
                                        type="text"
                                        value={testPhone}
                                        onChange={e => setTestPhone(e.target.value)}
                                        placeholder="Nomor WA tujuan uji coba (0812...)"
                                        className="max-w-xs bg-white dark:bg-zinc-900"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleSendTest}
                                        disabled={isSendingTest || !testPhone}
                                        className="border-emerald-600/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5 mr-1.5" />
                                        {isSendingTest ? 'Mengirim...' : 'Kirim Pesan Uji Coba'}
                                    </Button>
                                </div>
                                {testResult && (
                                    <div className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                                        testResult.success 
                                            ? 'bg-emerald-100/80 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                                            : 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900'
                                    }`}>
                                        {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
                                        <span>{testResult.message}</span>
                                    </div>
                                )}
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
