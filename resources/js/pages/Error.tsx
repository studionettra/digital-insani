import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ShieldAlert,
    Lock,
    Ghost,
    Clock,
    ServerCrash,
    Network,
    CloudOff,
    TimerOff,
    ArrowLeft,
    Home
} from 'lucide-react';

interface ErrorProps {
    status: number;
}

export default function ErrorPage({ status }: ErrorProps) {
    const getErrorContent = (code: number) => {
        switch (code) {
            case 400:
                return {
                    title: 'Permintaan Tidak Valid',
                    description: 'Sistem tidak dapat memproses permintaan Anda karena format yang salah atau data yang tidak sesuai.',
                    icon: AlertCircle,
                    color: 'text-amber-500',
                    bg: 'bg-amber-500/10'
                };
            case 401:
                return {
                    title: 'Akses Ditolak',
                    description: 'Anda harus masuk (login) terlebih dahulu untuk mengakses halaman ini.',
                    icon: ShieldAlert,
                    color: 'text-rose-500',
                    bg: 'bg-rose-500/10'
                };
            case 403:
                return {
                    title: 'Akses Terlarang',
                    description: 'Anda tidak memiliki izin yang cukup untuk melihat halaman ini atau melakukan tindakan tersebut.',
                    icon: Lock,
                    color: 'text-rose-500',
                    bg: 'bg-rose-500/10'
                };
            case 404:
                return {
                    title: 'Halaman Tidak Ditemukan',
                    description: 'Tampaknya Anda tersesat. Halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.',
                    icon: Ghost,
                    color: 'text-zinc-500 dark:text-zinc-400',
                    bg: 'bg-zinc-100 dark:bg-zinc-800'
                };
            case 408:
                return {
                    title: 'Waktu Habis',
                    description: 'Permintaan membutuhkan waktu terlalu lama untuk diselesaikan. Silakan coba beberapa saat lagi.',
                    icon: Clock,
                    color: 'text-amber-500',
                    bg: 'bg-amber-500/10'
                };
            case 500:
                return {
                    title: 'Kesalahan Server Terjadi',
                    description: 'Ups, ada sesuatu yang salah di sisi kami. Tim teknis telah diberitahu dan sedang memperbaikinya.',
                    icon: ServerCrash,
                    color: 'text-rose-500',
                    bg: 'bg-rose-500/10'
                };
            case 502:
                return {
                    title: 'Bad Gateway',
                    description: 'Server menerima respons yang tidak valid dari server hulu saat memproses permintaan.',
                    icon: Network,
                    color: 'text-indigo-500',
                    bg: 'bg-indigo-500/10'
                };
            case 503:
                return {
                    title: 'Layanan Sedang Perbaikan',
                    description: 'Sistem kami sedang menjalani pemeliharaan rutin atau kewalahan. Silakan periksa kembali sebentar lagi.',
                    icon: CloudOff,
                    color: 'text-indigo-500',
                    bg: 'bg-indigo-500/10'
                };
            case 504:
                return {
                    title: 'Gateway Timeout',
                    description: 'Server kami tidak dapat terhubung ke layanan yang diperlukan tepat waktu.',
                    icon: TimerOff,
                    color: 'text-amber-500',
                    bg: 'bg-amber-500/10'
                };
            default:
                return {
                    title: 'Terjadi Kesalahan',
                    description: 'Maaf, terjadi kesalahan yang tidak terduga pada sistem kami.',
                    icon: AlertCircle,
                    color: 'text-zinc-500',
                    bg: 'bg-zinc-100 dark:bg-zinc-800'
                };
        }
    };

    const content = getErrorContent(status);
    const Icon = content.icon;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col relative overflow-hidden selection:bg-blue-600 selection:text-white">
            <Head title={`${content.title} - ${status} | Digital Insani`} />

            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/5 blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
                {/* Brand Logo */}
                <Link href="/" className="mb-8 block transition-transform hover:scale-105">
                    <img 
                        src="/asset/logo-digital-insani.png" 
                        alt="Digital Insani" 
                        className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" 
                    />
                </Link>

                {/* Glassmorphism Card */}
                <div className="max-w-md w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 text-center relative overflow-hidden group">
                    
                    {/* Status Code Watermark */}
                    <div className="absolute -right-8 -top-8 text-[120px] font-black text-zinc-100 dark:text-zinc-800/50 opacity-50 pointer-events-none select-none z-0 transform group-hover:scale-105 transition-transform duration-500">
                        {status}
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`p-4 rounded-2xl ${content.bg} mb-6 ring-1 ring-inset ring-zinc-900/5 dark:ring-white/5`}>
                            <Icon className={`w-10 h-10 ${content.color}`} strokeWidth={1.5} />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
                            {content.title}
                        </h1>
                        
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                            {content.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                            <button 
                                onClick={() => window.history.back()}
                                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white dark:text-zinc-300 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </button>
                            <Link 
                                href="/" 
                                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-full shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Beranda
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Minimal Footer */}
                <p className="mt-12 text-sm text-zinc-500 dark:text-zinc-500 font-medium tracking-wide">
                    {status} &mdash; Digital Insani Error Handler
                </p>
            </main>
        </div>
    );
}
