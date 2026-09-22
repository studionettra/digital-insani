import { AdminSidebar } from '@/components/admin-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { BreadcrumbItem } from '@/types';

export default function AdminLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    useFlashToast();
    
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-zinc-50/60 dark:bg-zinc-950 relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent pointer-events-none" />
                
                <AdminSidebar />
                <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <main className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
