import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-zinc-50 overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-[440px] z-10">
                <div className="glass-effect rounded-3xl p-8 sm:p-10 border border-zinc-200/60 dark:border-zinc-800/60">
                    <div className="flex flex-col items-center gap-6 mb-8">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-4 font-medium group"
                        >
                            <div className="flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-transform duration-300 group-hover:scale-105">
                                <img src="/asset/logo-digital-insani.png" alt="Digital Insani" className="h-10 w-auto" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
            
            {/* Footer Links */}
            <div className="mt-8 text-center text-sm text-zinc-500 z-10">
                &copy; {new Date().getFullYear()} Digital Insani. All rights reserved.
            </div>
        </div>
    );
}
