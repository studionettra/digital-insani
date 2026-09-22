import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ArrowLeft, Lock, ShieldCheck, Eye, Cookie } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <GuestLayout>
            <Head title="Kebijakan Privasi | Digital Insani" />

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
                            <Lock className="h-3.5 w-3.5" />
                            <span>Perlindungan Data & Privasi</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Kebijakan Privasi
                        </h1>
                        <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
                            Terakhir diperbarui: 7 September 2026. Menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed text-zinc-600 dark:text-zinc-300">
                        
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">1</span>
                                Informasi yang Kami Kumpulkan
                            </h2>
                            <p className="text-sm sm:text-base">
                                Untuk menyediakan layanan toko digital dan memproses pesanan Anda, kami mengumpulkan data yang mencakup:
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50">
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Data Pelanggan & Pemesanan</h4>
                                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                                        Nama lengkap, alamat email, dan nomor WhatsApp yang diisi saat checkout atau pendaftaran akun.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50">
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Data Teknis & Akses</h4>
                                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                                        Alamat IP, tipe browser, dan riwayat unduhan berkas untuk keperluan audit keamanan lisensi.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">2</span>
                                Penggunaan Informasi
                            </h2>
                            <p className="text-sm sm:text-base">
                                Informasi Anda digunakan semata-mata untuk tujuan operasional berikut:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base">
                                <li>Memproses pembayaran dan mengirimkan invoice resmi serta tautan unduhan via email.</li>
                                <li>Menghubungkan riwayat pesanan dengan akun anggota Anda jika mendaftar dengan email yang sama.</li>
                                <li>Mengirimkan informasi pembaruan versi (*product updates/changelog*) untuk produk yang telah Anda beli.</li>
                                <li>Mencegah aktivitas ilegal, transaksi penipuan, atau pencurian aset digital.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">3</span>
                                Keamanan Data & Gerbang Pembayaran
                            </h2>
                            <p className="text-sm sm:text-base">
                                Kami menerapkan standar keamanan terbaik. Seluruh transaksi pembayaran diproses secara terenkripsi oleh <strong>Midtrans</strong> (berstandar PCI-DSS). Kami tidak menyimpan rincian data nomor kartu kredit atau PIN perbankan Anda di server kami.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">4</span>
                                Penggunaan Cookie & Pelacakan
                            </h2>
                            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
                                    <Cookie className="h-4 w-4 text-amber-500" />
                                    Cookie & Analitik
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    Kami menggunakan cookie esensial untuk mengelola sesi keranjang belanja dan status login. Untuk analitik pemasaran (Google Tag Manager, Google Analytics, dan Meta Pixel), skrip pelacakan <strong>hanya aktif jika Anda menyetujuinya</strong> melalui dialog persetujuan cookie (*Cookie Consent*) yang muncul di layar Anda.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">5</span>
                                Hak Pengguna
                            </h2>
                            <p className="text-sm sm:text-base">
                                Anda memiliki hak untuk mengakses profil Anda, memperbarui informasi kontak, maupun meminta penghapusan akun anggota dengan menghubungi tim dukungan kami.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
