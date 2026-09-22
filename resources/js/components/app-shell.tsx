import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <div className="flex min-h-screen w-full bg-zinc-50/50 dark:bg-[#09090b] relative overflow-hidden">
                {/* Premium Background Effects */}
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 dark:bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
                {children}
            </div>
        </SidebarProvider>
    );
}
