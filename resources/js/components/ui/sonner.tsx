import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="top-right"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:!bg-white/90 group-[.toaster]:dark:!bg-zinc-950/90 group-[.toaster]:!backdrop-blur-2xl group-[.toaster]:!text-zinc-950 group-[.toaster]:dark:!text-zinc-50 group-[.toaster]:!border-zinc-200/50 group-[.toaster]:dark:!border-zinc-800/50 group-[.toaster]:!shadow-xl group-[.toaster]:dark:!shadow-2xl group-[.toaster]:!rounded-2xl',
                    description: 'group-[.toast]:!text-zinc-500 group-[.toast]:dark:!text-zinc-400',
                    actionButton: 'group-[.toast]:!bg-blue-600 group-[.toast]:!text-white group-[.toast]:!rounded-full group-[.toast]:!px-4',
                    cancelButton: 'group-[.toast]:!bg-zinc-100 group-[.toast]:!text-zinc-600 group-[.toast]:dark:!bg-zinc-800 group-[.toast]:dark:!text-zinc-300 group-[.toast]:!rounded-full group-[.toast]:!px-4',
                    success: 'group-[.toaster]:!border-green-500/30 group-[.toaster]:!bg-green-50/90 group-[.toaster]:dark:!bg-green-950/50 group-[.toaster]:!text-green-800 group-[.toaster]:dark:!text-green-300',
                    error: 'group-[.toaster]:!border-red-500/30 group-[.toaster]:!bg-red-50/90 group-[.toaster]:dark:!bg-red-950/50 group-[.toaster]:!text-red-800 group-[.toaster]:dark:!text-red-300',
                    info: 'group-[.toaster]:!border-blue-500/30 group-[.toaster]:!bg-blue-50/90 group-[.toaster]:dark:!bg-blue-950/50 group-[.toaster]:!text-blue-800 group-[.toaster]:dark:!text-blue-300',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
