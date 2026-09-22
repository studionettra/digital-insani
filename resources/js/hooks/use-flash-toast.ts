import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useFlashToast(): void {
    const { flash, errors } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.message) {
            toast.info(flash.message);
        }
        if (flash?.status) {
            toast.info(flash.status); // Used by Fortify for things like password reset success
        }
        
        // Optionally, if we have a specific 'error' string in errors, or if we want to alert on validation failed
        // But usually validation errors are shown inline. We could just toast a generic message.
        if (errors && Object.keys(errors).length > 0) {
            // Check if it's not just a specific field error (like login failed)
            // Fortify sets errors.email for login failed
            if (errors.email) {
                toast.error(errors.email);
            } else {
                toast.error('Terjadi kesalahan. Silakan periksa kembali form Anda.');
            }
        }
    }, [flash, errors]);
}
