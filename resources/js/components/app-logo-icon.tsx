import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props} 
            src="/asset/logo-digital-insani.png" 
            alt="Digital Insani Logo" 
        />
    );
}
