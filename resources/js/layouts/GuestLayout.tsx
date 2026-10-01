import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { CookieConsent } from '@/components/CookieConsent';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { 
    ShoppingBag, 
    Moon, 
    Sun, 
    ShieldCheck, 
    Menu, 
    X, 
    Home, 
    Package, 
    FileText, 
    User, 
    ArrowRight,
    LogIn,
    UserPlus,
    LayoutDashboard,
    Sparkles,
    Heart,
} from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CountdownTimer from '@/components/CountdownTimer';

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth, cartItemCount, site_settings } = usePage<any>().props;
    const { wishlistCount } = useWishlist();
    useFlashToast();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [promoDismissed, setPromoDismissed] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isDismissed = localStorage.getItem('di_promo_dismissed_v1');
            if (!isDismissed) {
                setPromoDismissed(false);
            }
        }
    }, []);

    const dismissPromo = () => {
        setPromoDismissed(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('di_promo_dismissed_v1', 'true');
        }
    };

    const rawPhone = site_settings?.contact_phone || '081234567890';
    const digitsOnly = String(rawPhone).replace(/\D/g, '');
    const waNumber = digitsOnly.startsWith('0') ? '62' + digitsOnly.slice(1) : digitsOnly;
    const waMessage = encodeURIComponent(
        `Halo Tim ${site_settings?.site_name || 'Digital Insani'}, saya ingin bertanya seputar produk digital.`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

    return (
        <div className="flex min-h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-800 dark:selection:text-blue-50">
            {/* Top Promo Announcement Bar */}
            {!promoDismissed && (
                <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white text-xs py-2 px-4 shadow-xs z-50 transition-all">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex-1 flex items-center justify-center gap-2.5 text-center flex-wrap">
                            <span className="inline-flex items-center gap-1 font-bold bg-amber-400 text-zinc-950 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-xs">
                                <Sparkles className="w-3 h-3 text-zinc-950 fill-zinc-950" />
                                {site_settings?.flash_sale?.discount_percentage ? `Diskon Kilat ${site_settings.flash_sale.discount_percentage}%` : 'Flash Sale'}
                            </span>
                            <span className="text-white font-medium text-xs hidden sm:inline">
                                {site_settings?.flash_sale?.title || 'Promo Terbatas Digital Insani!'}
                            </span>
                            {site_settings?.flash_sale?.ends_at && (
                                <CountdownTimer targetDate={site_settings.flash_sale.ends_at} variant="banner" />
                            )}
                            <Link 
                                href="/products" 
                                className="underline hover:text-amber-200 font-semibold inline-flex items-center gap-1 transition-colors ml-1 text-xs"
                            >
                                Belanja Sekarang &rarr;
                            </Link>
                        </div>
                        <button
                            type="button"
                            onClick={dismissPromo}
                            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0"
                            aria-label="Tutup promo banner"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Premium Glassmorphism Header */}
            <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo & Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            {site_settings?.logo_url ? (
                                <img src={site_settings.logo_url} alt={site_settings?.site_name || "Digital Insani"} className="h-8 w-auto transition-transform group-hover:scale-105" />
                            ) : (
                                <img src="/asset/logo-digital-insani.png" alt="Digital Insani" className="h-8 w-auto transition-transform group-hover:scale-105" />
                            )}
                            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                                {site_settings?.site_name || 'Digital Insani'}
                            </span>
                        </Link>
                        
                        {/* Main Navigation (Desktop) */}
                        <nav className="hidden md:flex gap-7 items-center">
                            <Link 
                                href="/products" 
                                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            >
                                Katalog Produk
                            </Link>
                            <Link 
                                href="/articles" 
                                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            >
                                Artikel
                            </Link>
                        </nav>
                    </div>

                    {/* Actions: Theme Toggle, Cart, Auth & Mobile Menu Trigger */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Toggle Dark Mode"
                        >
                            {resolvedAppearance === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <Link 
                            href="/wishlist" 
                            className="relative p-2 text-zinc-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Wishlist Produk Favorit"
                        >
                            <Heart className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link 
                            href="/cart" 
                            className="relative p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            aria-label="Keranjang Belanja"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Auth CTA */}
                        <div className="hidden sm:flex items-center gap-3 ml-1">
                            {auth?.user ? (
                                <Link 
                                    href={auth.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'} 
                                    className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                                    Dasbor
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors px-2 py-1">
                                        Log in
                                    </Link>
                                    <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Drawer Trigger (md:hidden) */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    aria-label="Buka Menu"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col justify-between bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
                                <div>
                                    <SheetHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-2.5">
                                            {site_settings?.logo_url ? (
                                                <img src={site_settings.logo_url} alt={site_settings?.site_name || "Digital Insani"} className="h-7 w-auto" />
                                            ) : (
                                                <img src="/asset/logo-digital-insani.png" alt="Digital Insani" className="h-7 w-auto" />
                                            )}
                                            <SheetTitle className="font-bold text-lg text-zinc-900 dark:text-zinc-100 text-left">
                                                {site_settings?.site_name || 'Digital Insani'}
                                            </SheetTitle>
                                        </div>
                                    </SheetHeader>

                                    {/* Mobile Nav Links */}
                                    <div className="px-4 py-6 space-y-1">
                                        <Link 
                                            href="/" 
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Beranda
                                        </Link>
                                        <Link 
                                            href="/products" 
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Katalog Produk
                                        </Link>
                                        <Link 
                                            href="/articles" 
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Artikel & Berita
                                        </Link>
                                        <Link 
                                            href="/wishlist" 
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-between px-3 py-3 rounded-2xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Heart className="w-4 h-4 text-rose-500" />
                                                Wishlist Saya
                                            </div>
                                            {wishlistCount > 0 && (
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500 text-white rounded-full">
                                                    {wishlistCount}
                                                </span>
                                            )}
                                        </Link>
                                        <Link 
                                            href="/cart" 
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-between px-3 py-3 rounded-2xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                Keranjang Belanja
                                            </div>
                                            {cartItemCount > 0 && (
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </div>

                                {/* Mobile Auth & Footer Section */}
                                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                                    {auth?.user ? (
                                        <div className="space-y-2">
                                            <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Masuk sebagai</p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{auth.user.name}</p>
                                            </div>
                                            <Link
                                                href={auth.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                                                onClick={() => setMobileOpen(false)}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Menuju Dasbor
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                href="/login"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                            >
                                                <LogIn className="w-4 h-4" />
                                                Masuk
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                                Daftar
                                            </Link>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            Akses Unduhan Instan
                                        </span>
                                        <button
                                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                            className="font-medium underline hover:text-zinc-900 dark:hover:text-zinc-200"
                                        >
                                            Mode: {resolvedAppearance === 'dark' ? 'Gelap' : 'Terang'}
                                        </button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
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

            {/* Floating WhatsApp Help CTA */}
            <aside aria-label="Customer Support">
                <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 rounded-full bg-[#25D366] text-white p-3.5 sm:px-4 sm:py-3 shadow-xl hover:bg-[#20ba5a] hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                    aria-label="Hubungi kami melalui WhatsApp"
                >
                    <span className="relative flex h-3 w-3 sm:hidden">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span className="hidden sm:inline font-semibold text-xs tracking-wide">
                        Chat WhatsApp
                    </span>
                </a>
            </aside>
        </div>
    );
}
