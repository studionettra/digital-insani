import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShowConsent(true);
        } else if (consent === 'accepted') {
            // trigger GTM tracking initialization manually if needed
            window.dispatchEvent(new Event('cookie_consent_accepted'));
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setShowConsent(false);
        window.dispatchEvent(new Event('cookie_consent_accepted'));
        // We could also push an event to dataLayer
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({ event: 'cookie_consent_update', consent: 'granted' });
        }
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setShowConsent(false);
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({ event: 'cookie_consent_update', consent: 'denied' });
        }
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-safe">
            <div className="max-w-4xl mx-auto bg-zinc-900 dark:bg-zinc-800 text-white p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-zinc-800 dark:border-zinc-700">
                <div className="flex-1 text-sm md:text-base text-zinc-300">
                    <h3 className="text-lg font-semibold text-white mb-2">Pemberitahuan Cookie 🍪</h3>
                    <p>
                        Kami menggunakan cookie untuk menganalisis trafik situs dan mengoptimalkan pengalaman Anda pada situs kami. Dengan menyetujui penggunaan cookie kami, data Anda akan digabungkan dengan data pengguna kami lainnya.
                    </p>
                </div>
                <div className="flex flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0 shrink-0">
                    <Button variant="outline" className="flex-1 md:flex-none text-zinc-900" onClick={handleDecline}>
                        Tolak
                    </Button>
                    <Button variant="default" className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAccept}>
                        Terima Semua
                    </Button>
                </div>
            </div>
        </div>
    );
}
