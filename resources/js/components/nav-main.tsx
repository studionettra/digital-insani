import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className={isCurrentUrl(item.href) ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all duration-300" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"}
                        >
                            <Link href={item.href} prefetch className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    {item.icon && <item.icon className={isCurrentUrl(item.href) ? "text-primary-foreground" : "text-zinc-500 dark:text-zinc-400"} />}
                                    <span className={isCurrentUrl(item.href) ? "font-medium" : ""}>{item.title}</span>
                                </div>
                                {item.badge ? (
                                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold leading-none ${isCurrentUrl(item.href) ? 'bg-primary-foreground text-primary' : 'bg-blue-600 text-white'}`}>
                                        {item.badge}
                                    </span>
                                ) : null}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
