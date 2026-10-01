import { useState } from 'react';
import { Star } from 'lucide-react';

type Props = {
    rating: number;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
};

export default function StarRating({
    rating,
    maxStars = 5,
    size = 'md',
    interactive = false,
    onChange,
    className = '',
}: Props) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const sizeClasses = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-6 h-6',
    };

    const currentScore = hoverRating !== null ? hoverRating : rating;

    return (
        <div className={`inline-flex items-center gap-1 ${className}`}>
            {Array.from({ length: maxStars }, (_, i) => {
                const starIndex = i + 1;
                const isFilled = starIndex <= Math.round(currentScore);

                return (
                    <button
                        key={starIndex}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onChange && onChange(starIndex)}
                        onMouseEnter={() => interactive && setHoverRating(starIndex)}
                        onMouseLeave={() => interactive && setHoverRating(null)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform focus:outline-hidden' : 'cursor-default pointer-events-none'}`}
                        aria-label={`Rating ${starIndex} dari ${maxStars}`}
                    >
                        <Star
                            className={`${sizeClasses[size]} transition-colors ${
                                isFilled
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-zinc-200 dark:text-zinc-700'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}
