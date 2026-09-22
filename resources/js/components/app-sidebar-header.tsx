import { Link } from '@inertiajs/react';
import { Store } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { home } from '@/routes';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 lg:px-6 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="-ml-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" />
                <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href={home()}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-white/50 dark:bg-zinc-900/50 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 transition-colors shadow-2xs"
                    title="Buka Website Toko"
                >
                    <Store className="size-3.5 text-zinc-500" />
                    <span>Lihat Toko</span>
                </Link>
                <ThemeToggle />
            </div>
        </header>
    );
}

