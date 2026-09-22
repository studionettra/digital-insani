import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types/navigation';


export function NavMain({
    items,
    groups,
}: {
    items?: NavItem[];
    groups?: NavGroup[];
}) {
    const { isCurrentUrl } = useCurrentUrl();

    // Normalise to groups array
    const navGroups: NavGroup[] = groups || (items ? [{ items }] : []);

    return (
        <div className="flex flex-col gap-1 py-1">
            {navGroups.map((group, groupIdx) => (
                <SidebarGroup key={group.title || groupIdx} className="px-2 py-1">
                    {group.title && (
                        <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 my-1">
                            {group.title}
                        </SidebarGroupLabel>
                    )}
                    <SidebarMenu className="gap-0.5">
                        {group.items.map((item) => {
                            const active = item.isActive ?? isCurrentUrl(item.href);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className={`group relative h-9 px-3 rounded-lg text-sm transition-all duration-150 ${
                                            active
                                                ? 'bg-primary/10 text-primary font-semibold dark:bg-primary/15 dark:text-primary'
                                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60 font-medium'
                                        }`}
                                    >
                                        <Link href={item.href} prefetch className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {item.icon && (
                                                    <item.icon
                                                        className={`size-4 shrink-0 transition-colors ${
                                                            active
                                                                ? 'text-primary'
                                                                : 'text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                                                        }`}
                                                    />
                                                )}
                                                <span className="truncate">{item.title}</span>
                                            </div>
                                            {item.badge !== undefined && (
                                                <span
                                                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                                                        active
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
