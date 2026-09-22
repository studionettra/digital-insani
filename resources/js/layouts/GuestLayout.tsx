import { Link, usePage } from '@inertiajs/react';
import { CookieConsent } from '@/components/CookieConsent';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { ShoppingBag, Moon, Sun, ShieldCheck } from 'lucide-react';

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth, cartItemCount, site_settings } = usePage<any>().props;
    useFlashToast();
    const { resolvedAppearance, updateAppearance } = useAppearance();

    return (
        <div className="flex min-h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-800 dark:selection:text-blue-50">
            {/* Premium Glassmorphism Header */}
            <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            {site_settings?.logo_url ? (
                                <img src={site_settings.logo_url} alt={site_settings?.site_name || "Digital Insani"} className="h-8 w-auto transition-transform group-hover:scale-105" />
                            ) : (
                                <img src="/asset/logo-digital-insani.png" alt="Digital Insani" className="h-8 w-auto transition-transform group-hover:scale-105" />
                            )}
                            <span className="hidden sm:inline-block font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                                {site_settings?.site_name || 'Digital Insani'}
                            </span>
                        </Link>
                        
                        {/* Main Navigation (Desktop) */}
                        <nav className="hidden md:flex gap-6 items-center ml-4">
                            <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                                Katalog Produk
                            </Link>
                            <Link href="/articles" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                                Artikel
                            </Link>
                        </nav>
                    </div>

                    {/* Auth / CTA Navigation */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Toggle Dark Mode"
                        >
                            {resolvedAppearance === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <Link href="/cart" className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <ShoppingBag className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        {auth?.user ? (
                            <Link 
                                href={auth.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'} 
                                className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                            >
                                Dasbor
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Modern Fat Footer */}
            <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 sm:pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
                        {/* Brand & Description Column (2 Kolom di Desktop) */}
                        <div className="lg:col-span-2 space-y-4">
                            <Link href="/" className="inline-flex items-center gap-2.5 group">
                                <img src="/asset/logo-digital-insani.png" alt="Digital Insani" className="h-8 w-auto transition-transform group-hover:scale-105" />
                                <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Digital Insani
                                </span>
                            </Link>
                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-sm">
                                Toko produk digital terkurasi untuk developer, kreator, dan profesional. Menyediakan source code, template antarmuka, dan starter kit dengan pengiriman akses instan.
                            </p>
                            <div className="pt-2 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                    Pembayaran Terenkripsi Midtrans
                                </span>
                            </div>
                        </div>

                        {/* Column: Produk & Navigasi */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                Produk
                            </h3>
                            <ul className="space-y-2.5 text-sm">
                                <li>
                                    <Link href="/products" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                        Katalog Lengkap
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cart" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                        Keranjang Belanja
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/articles" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                        Artikel & Berita
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column: Akun & Layanan */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                Akun & Layanan
                            </h3>
                            <ul className="space-y-2.5 text-sm">
                                {auth?.user ? (
                                    <>
                                        <li>
                                            <Link href={auth.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                Dasbor Utama
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/member/products" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                Produk Saya
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/member/orders" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                Riwayat Pesanan
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/member/updates" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                Pembaruan Produk
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                Masuk (Login)
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                Daftar Akun Baru
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/forgot-password" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                Lupa Kata Sandi
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Column: Kebijakan & Legalitas */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                Legalitas
                            </h3>
                            <ul className="space-y-2.5 text-sm">
                                <li>
                                    <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                        Syarat & Ketentuan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                        Kebijakan Privasi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-policy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                        Kebijakan Refund
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Sub-footer / Copyright */}
                    <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                        <div className="flex items-center gap-2">
                            {site_settings?.logo_url ? (
                                <img src={site_settings.logo_url} alt={site_settings?.site_name || "Digital Insani"} className="h-5 w-auto grayscale opacity-60" />
                            ) : (
                                <img src="/asset/logo-digital-insani.png" alt="Digital Insani" className="h-5 w-auto grayscale opacity-60" />
                            )}
                            <span>
                                &copy; {new Date().getFullYear()} {site_settings?.site_name || 'Digital Insani'}. All rights reserved.
                            </span>
                        </div>
                        <p className="text-zinc-400 dark:text-zinc-600">
                            Akses Unduhan Cepat & Lisensi Resmi
                        </p>
                    </div>
                </div>
            </footer>
            
            <CookieConsent />
        </div>
    );
}
