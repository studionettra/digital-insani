import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ArrowLeft, RefreshCw, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export default function RefundPolicy() {
    return (
        <GuestLayout>
            <Head title="Kebijakan Pengembalian Dana | Digital Insani" />

            <div className="min-h-screen py-12 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Navigation Back */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Beranda
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-4 border border-blue-200/50 dark:border-blue-800/50">
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Jaminan & Kebijakan Transaksi</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Kebijakan Pengembalian Dana
                        </h1>
                        <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
                            Terakhir diperbarui: 7 September 2026. Harap baca ketentuan pengembalian dana kami sebelum melakukan pembelian.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed text-zinc-600 dark:text-zinc-300">
                        
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">1</span>
                                Sifat Produk Digital
                            </h2>
                            <p className="text-sm sm:text-base">
                                Seluruh produk yang dijual di <strong>Digital Insani</strong> merupakan produk digital non-fisik (seperti template desain, source code, aset grafis, dan starter kit). Setelah transaksi berhasil diverifikasi melalui gateway pembayaran Midtrans, akses unduhan produk langsung tersedia secara instan bagi Anda.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">2</span>
                                Ketentuan Pembelian Final
                            </h2>
                            <p className="text-sm sm:text-base">
                                Mengingat sifat produk digital yang tidak dapat dikembalikan secara fisik setelah diunduh atau diakses, <strong>semua transaksi pembelian pada dasarnya bersifat final dan tidak dapat dibatalkan</strong>, kecuali memenuhi kondisi khusus yang tercantum pada Bagian 3 di bawah ini.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">3</span>
                                Kondisi yang Memenuhi Syarat Pengembalian Dana
                            </h2>
                            <p className="text-sm sm:text-base">
                                Pengembalian dana (*refund*) dapat kami proses apabila salah satu dari kondisi berikut terbukti terjadi:
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50">
                                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold mb-1">
                                        <AlertCircle className="h-4 w-4 text-amber-500" />
                                        Berkas Rusak / Corrupt
                                    </div>
                                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                                        Berkas yang diunduh terbukti rusak atau tidak lengkap, dan tim dukungan kami tidak dapat menyediakan perbaikan atau link pengganti dalam waktu 3x24 jam kerja.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50">
                                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold mb-1">
                                        <RefreshCw className="h-4 w-4 text-blue-500" />
                                        Transaksi Ganda (Double Charge)
                                    </div>
                                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                                        Terjadi pemotongan saldo lebih dari satu kali untuk nomor pesanan dan produk yang sama akibat kendala teknis pada sistem pembayaran.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">4</span>
                                Hal-Hal yang Tidak Memenuhi Syarat
                            </h2>
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
                                <li>Berubah pikiran setelah melakukan pembayaran atau file berhasil diunduh.</li>
                                <li>Kurangnya keahlian teknis atau perangkat yang tidak memadai untuk menjalankan produk (spesifikasi teknologi telah dicantumkan pada deskripsi produk).</li>
                                <li>Klaim yang diajukan lebih dari 7 (tujuh) hari kalender sejak tanggal transaksi.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">5</span>
                                Tata Cara Pengajuan Refund
                            </h2>
                            <p className="text-sm sm:text-base">
                                Untuk mengajukan klaim pengembalian dana, silakan hubungi tim dukungan kami melalui email dengan melampirkan:
                            </p>
                            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 text-xs sm:text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
                                <p>• Nomor Pesanan (contoh: <code>ORD-xxxxxx</code>)</p>
                                <p>• Alamat email dan nomor WhatsApp yang digunakan saat checkout</p>
                                <p>• Bukti kendala berupa tangkapan layar (*screenshot*) atau rekaman kendala yang dialami</p>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Tim kami akan meninjau pengajuan Anda dalam waktu 1–3 hari kerja. Jika disetujui, dana akan dikembalikan melalui metode pembayaran semula sesuai ketentuan perbankan dan Midtrans.
                            </p>
                        </section>

                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                                <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                                    Punya pertanyaan seputar pengembalian dana?
                                </span>
                            </div>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
                            >
                                Jelajahi Katalog Produk
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
