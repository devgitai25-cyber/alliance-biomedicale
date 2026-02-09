import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    isLoading?: boolean;
    href?: string;
    target?: string;
}

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    isLoading = false,
    disabled,
    href,
    ...props
}: ButtonProps) {
    // Premium base styles - no aggressive scaling
    const baseStyles = 'inline-flex items-center justify-center font-medium font-display rounded-lg transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed';

    // Elegant variants with subtle effects
    const variants = {
        primary: 'bg-teal-main hover:bg-teal-dark text-white shadow-soft hover:shadow-elegant',
        secondary: 'bg-white border border-teal-main text-teal-dark hover:bg-teal-soft shadow-whisper hover:shadow-soft',
        outline: 'border border-gray-medium text-gray-text hover:border-teal-main hover:text-teal-dark hover:bg-teal-soft/30',
        ghost: 'text-teal-main hover:bg-teal-soft',
    };

    // Generous padding for premium feel
    const sizes = {
        sm: 'px-5 py-2.5 text-sm',
        md: 'px-7 py-3.5 text-base',
        lg: 'px-9 py-4 text-lg',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...(props as any)}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </span>
            ) : children}
        </button>
    );
}
