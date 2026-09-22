import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Package, ShoppingCart } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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

import { usePage } from '@inertiajs/react';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { cartItemCount } = usePage<any>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: member.dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Keranjang',
            href: '/cart',
            icon: ShoppingCart,
            badge: cartItemCount > 0 ? cartItemCount : undefined,
        },
        {
            title: 'Produk Saya',
            href: member.products.index(),
            icon: FolderGit2,
        },
        {
            title: 'Pembaruan Produk',
            href: member.updates.index(),
            icon: Package,
        },
        {
            title: 'Riwayat Pesanan',
            href: member.orders.index(),
            icon: BookOpen,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Kembali ke Toko',
            href: home(),
            icon: LayoutGrid,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={member.dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
