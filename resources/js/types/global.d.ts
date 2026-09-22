import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

declare namespace JSX {
    interface IntrinsicElements {
        'trix-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            input?: string;
            placeholder?: string;
        };
    }
}
