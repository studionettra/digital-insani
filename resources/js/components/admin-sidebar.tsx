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
import type { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Artikel',
        href: admin.articles.index(),
        icon: FileText,
    },
    {
        title: 'Produk',
        href: admin.products.index(),
        icon: FolderGit2,
    },
    {
        title: 'Pembaruan Produk',
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
    {
        title: 'Pesanan',
        href: admin.orders.index(),
        icon: ShoppingCart,
    },
    {
        title: 'Member',
        href: admin.members.index(),
        icon: Users,
    },
    {
        title: 'Pengaturan',
        href: admin.settings.index(),
        icon: Settings,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={admin.dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
