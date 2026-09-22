import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    FolderGit2,
    Tags,
    Users,
    Settings,
    ShoppingCart,
    Ticket,
    History,
    Store,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import admin from '@/routes/admin';
import { home } from '@/routes';
import type { NavGroup } from '@/types/navigation';

const adminNavGroups: NavGroup[] = [
    {
        title: 'Utama',
        items: [
            {
                title: 'Dashboard',
                href: admin.dashboard(),
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: 'Toko & Transaksi',
        items: [
            {
                title: 'Pesanan',
                href: admin.orders.index(),
                icon: ShoppingCart,
            },
            {
                title: 'Produk',
                href: admin.products.index(),
                icon: FolderGit2,
            },
            {
                title: 'Pembaruan Versi',
                href: admin.productUpdates.index(),
                icon: History,
            },
            {
                title: 'Kategori',
                href: admin.categories.index(),
                icon: Tags,
            },
            {
                title: 'Kupon Diskon',
                href: admin.coupons.index(),
                icon: Ticket,
            },
        ],
    },
    {
        title: 'Konten & Pemasaran',
        items: [
            {
                title: 'Artikel SEO',
                href: admin.articles.index(),
                icon: FileText,
            },
        ],
    },
    {
        title: 'Pengguna & Sistem',
        items: [
            {
                title: 'Data Member',
                href: admin.members.index(),
                icon: Users,
            },
            {
                title: 'Pengaturan Toko',
                href: admin.settings.index(),
                icon: Settings,
            },
        ],
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-border/60 bg-white dark:bg-zinc-950">
            <SidebarHeader className="border-b border-border/40 pb-3 pt-4 px-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={admin.dashboard()} prefetch className="flex items-center gap-3">
                                <AppLogo />
                                <div className="flex flex-col text-left leading-none group-data-[collapsible=icon]:hidden">
                                    <span className="font-semibold tracking-tight text-sm text-zinc-900 dark:text-white">digital.insani</span>
                                    <span className="text-[10px] font-semibold tracking-wider uppercase text-primary mt-0.5">Admin Portal</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-2">
                <NavMain groups={adminNavGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-border/40 p-2">
                <div className="px-2 py-1.5 mb-1 group-data-[collapsible=icon]:hidden">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                        <Store className="size-3.5" />
                        <span>Lihat Toko Publik</span>
                    </Link>
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
