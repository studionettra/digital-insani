import { AdminSidebar } from '@/components/admin-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useFlashToast } from '@/hooks/use-flash-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    useFlashToast();
    
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-zinc-50/50 dark:bg-[#09090b] relative overflow-hidden">
                {/* Premium Background Effects */}
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 dark:bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
                
                <AdminSidebar />
                <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
