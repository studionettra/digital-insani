import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Package, ShoppingCart, Store, User } from 'lucide-react';
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
import { home } from '@/routes';
import member from '@/routes/member';
import type { NavGroup } from '@/types/navigation';

export function AppSidebar() {
    const { cartItemCount } = usePage<any>().props;

    const memberNavGroups: NavGroup[] = [
        {
            title: 'Aktivitas Utama',
            items: [
                {
                    title: 'Dashboard',
                    href: member.dashboard(),
                    icon: LayoutGrid,
                },
                {
                    title: 'Produk Saya',
                    href: member.products.index(),
                    icon: FolderGit2,
                },
                {
                    title: 'Pembaruan Versi',
                    href: member.updates.index(),
                    icon: Package,
                },
            ],
        },
        {
            title: 'Transaksi & Belanja',
            items: [
                {
                    title: 'Riwayat Pesanan',
                    href: member.orders.index(),
                    icon: BookOpen,
                },
                {
                    title: 'Keranjang',
                    href: '/cart',
                    icon: ShoppingCart,
                    badge: cartItemCount > 0 ? cartItemCount : undefined,
                },
            ],
        },
        {
            title: 'Pengaturan Akun',
            items: [
                {
                    title: 'Profil Pengguna',
                    href: member.profile.edit(),
                    icon: User,
                },
            ],
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-border/60 bg-white dark:bg-zinc-950">
            <SidebarHeader className="border-b border-border/40 pb-3 pt-4 px-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={member.dashboard()} prefetch className="flex items-center gap-3">
                                <AppLogo />
                                <div className="flex flex-col text-left leading-none group-data-[collapsible=icon]:hidden">
                                    <span className="font-semibold tracking-tight text-sm text-zinc-900 dark:text-white">digital.insani</span>
                                    <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 mt-0.5">Area Member</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-2">
                <NavMain groups={memberNavGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-border/40 p-2">
                <div className="px-2 py-1.5 mb-1 group-data-[collapsible=icon]:hidden">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                        <Store className="size-3.5" />
                        <span>Katalog Toko</span>
                    </Link>
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
