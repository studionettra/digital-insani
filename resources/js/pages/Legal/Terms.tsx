import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Terms() {
    return (
        <GuestLayout>
            <Head title="Syarat & Ketentuan | Digital Insani" />

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
                            <FileText className="h-3.5 w-3.5" />
                            <span>Perjanjian Penggunaan Layanan</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Syarat & Ketentuan Layanan
                        </h1>
                        <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
                            Terakhir diperbarui: 7 September 2026. Harap baca dokumen ini secara saksama sebelum menggunakan situs atau membeli produk kami.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed text-zinc-600 dark:text-zinc-300">
                        
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">1</span>
                                Penerimaan Ketentuan
                            </h2>
                            <p className="text-sm sm:text-base">
                                Selamat datang di <strong>Digital Insani</strong> (<code>digital.insani.id</code>). Dengan mengakses situs, mendaftar akun anggota, maupun melakukan transaksi pembelian sebagai tamu (*guest checkout*), Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat dengan seluruh Syarat & Ketentuan ini.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">2</span>
                                Akun Pengguna & Pendaftaran
                            </h2>
                            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                                <li>Pengguna dapat melakukan pembelian tanpa mendaftar terlebih dahulu (*guest checkout*), dengan kewajiban memberikan alamat email dan nomor WhatsApp aktif yang valid.</li>
                                <li>Jika pelanggan mendaftar akun menggunakan email yang sama dengan transaksi sebelumnya, riwayat pesanan dan hak unduh (*entitlements*) akan otomatis terhubung ke dasbor akun Anda.</li>
                                <li>Anda bertanggung jawab penuh atas kerahasiaan kata sandi dan keamanan akun Anda.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">3</span>
                                Lisensi & Hak Cipta Produk Digital
                            </h2>
                            <p className="text-sm sm:text-base">
                                Seluruh hak cipta, merek dagang, dan hak kekayaan intelektual atas materi produk yang tersedia di Digital Insani tetap dimiliki oleh pembuat produk dan Studio Nettra / Insani Indonesia.
                            </p>
                            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 text-sm space-y-2">
                                <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Hak yang Diberikan:
                                </p>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    Anda memperoleh hak lisensi non-eksklusif dan tidak dapat dipindahtangankan untuk menggunakan, memodifikasi, dan mengintegrasikan berkas produk dalam proyek pribadi maupun komersial klien Anda.
                                </p>
                                <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 pt-2">
                                    <ShieldAlert className="h-4 w-4 text-red-500" />
                                    Larangan Keras:
                                </p>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    Dilarang menjual kembali (*resell*), mendistribusikan ulang, menyewakan, mempublikasikan berkas sumber mentah secara gratis, atau mengklaim kepemilikan cipta atas aset tersebut.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">4</span>
                                Pembayaran & Pemrosesan Transaksi
                            </h2>
                            <p className="text-sm sm:text-base">
                                Semua harga yang tercantum menggunakan mata uang Rupiah (IDR). Pembayaran diproses secara aman melalui gerbang pembayaran terpercaya (Midtrans). Kami tidak menyimpan data sensitif nomor kartu kredit Anda. Bukti pembayaran dan invoice resmi akan dikirimkan otomatis ke alamat email yang Anda masukkan.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">5</span>
                                Batasan Akses & Unduhan
                            </h2>
                            <p className="text-sm sm:text-base">
                                Untuk menjaga keamanan distribusi digital dan mencegah tautan unduhan dibagikan secara tidak sah:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
                                <li>Setiap item pesanan memiliki batas maksimal <strong>5 (lima) kali unduhan</strong>.</li>
                                <li>Tautan unduhan khusus tamu berlaku selama <strong>24 jam</strong> sejak pembayaran berhasil.</li>
                                <li>Pengguna disarankan membuat akun agar berkas produk tetap dapat diakses kapan saja dari area anggota (*Member Area*).</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">6</span>
                                Pembatasan Tanggung Jawab
                            </h2>
                            <p className="text-sm sm:text-base">
                                Produk digital disediakan sebagaimana adanya (*as-is*). Digital Insani tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat penggunaan atau ketidakmampuan menggunakan berkas yang telah dibeli.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">7</span>
                                Hukum yang Berlaku
                            </h2>
                            <p className="text-sm sm:text-base">
                                Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Negara Kesatuan Republik Indonesia.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
