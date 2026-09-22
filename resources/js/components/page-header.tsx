import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
    title,
    description,
    badge,
    children,
    className,
}: {
    title: ReactNode;
    description?: ReactNode;
    badge?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2',
                className,
            )}
        >
            <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {title}
                    </h1>
                    {badge && (
                        <div className="inline-flex items-center">
                            {typeof badge === 'string' ? (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    {badge}
                                </span>
                            ) : (
                                badge
                            )}
                        </div>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-3xl">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                    {children}
                </div>
            )}
        </div>
    );
}
