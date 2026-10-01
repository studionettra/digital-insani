import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    targetDate: string | Date;
    variant?: 'compact' | 'banner' | 'card';
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

function calculateTimeLeft(target: Date): TimeLeft {
    const difference = target.getTime() - new Date().getTime();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
    };
}

export default function CountdownTimer({ 
    targetDate, 
    variant = 'banner', 
    className = '' 
}: CountdownTimerProps) {
    const target = new Date(targetDate);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(target));

    useEffect(() => {
        const interval = setInterval(() => {
            const nextTime = calculateTimeLeft(target);
            setTimeLeft(nextTime);
            if (nextTime.isExpired) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (timeLeft.isExpired) {
        return (
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 ${className}`}>
                <Clock className="w-3.5 h-3.5" />
                Promo Berakhir
            </span>
        );
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    if (variant === 'compact') {
        return (
            <div className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-500 dark:text-amber-400 ${className}`}>
                <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                {timeLeft.days > 0 && <span>{timeLeft.days}h : </span>}
                <span>{pad(timeLeft.hours)}</span>
                <span className="animate-pulse">:</span>
                <span>{pad(timeLeft.minutes)}</span>
                <span className="animate-pulse">:</span>
                <span>{pad(timeLeft.seconds)}</span>
            </div>
        );
    }

    if (variant === 'card') {
        return (
            <div className={`flex items-center gap-1.5 ${className}`}>
                {timeLeft.days > 0 && (
                    <div className="flex flex-col items-center justify-center min-w-[38px] p-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 border border-zinc-700 shadow-xs">
                        <span className="text-xs font-mono font-bold leading-none">{pad(timeLeft.days)}</span>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-0.5">Hari</span>
                    </div>
                )}
                <div className="flex flex-col items-center justify-center min-w-[38px] p-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 border border-zinc-700 shadow-xs">
                    <span className="text-xs font-mono font-bold leading-none">{pad(timeLeft.hours)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-0.5">Jam</span>
                </div>
                <span className="font-bold text-zinc-400 text-xs animate-pulse">:</span>
                <div className="flex flex-col items-center justify-center min-w-[38px] p-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 border border-zinc-700 shadow-xs">
                    <span className="text-xs font-mono font-bold leading-none">{pad(timeLeft.minutes)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-0.5">Mnt</span>
                </div>
                <span className="font-bold text-zinc-400 text-xs animate-pulse">:</span>
                <div className="flex flex-col items-center justify-center min-w-[38px] p-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 border border-zinc-700 shadow-xs">
                    <span className="text-xs font-mono font-bold leading-none text-amber-400">{pad(timeLeft.seconds)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-0.5">Dtk</span>
                </div>
            </div>
        );
    }

    // Default 'banner' variant
    return (
        <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold ${className}`}>
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span className="font-sans text-[10px] uppercase tracking-wider opacity-80 mr-0.5">Sisa:</span>
            {timeLeft.days > 0 && (
                <>
                    <span className="px-1.5 py-0.5 rounded bg-black/25 text-white shadow-inner">{pad(timeLeft.days)}h</span>
                    <span>:</span>
                </>
            )}
            <span className="px-1.5 py-0.5 rounded bg-black/25 text-white shadow-inner">{pad(timeLeft.hours)}j</span>
            <span className="animate-pulse">:</span>
            <span className="px-1.5 py-0.5 rounded bg-black/25 text-white shadow-inner">{pad(timeLeft.minutes)}m</span>
            <span className="animate-pulse">:</span>
            <span className="px-1.5 py-0.5 rounded bg-black/35 text-amber-300 shadow-inner">{pad(timeLeft.seconds)}d</span>
        </div>
    );
}
