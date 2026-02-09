import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Container({ children, className = '', size = 'lg' }: ContainerProps) {
    const sizes = {
        sm: 'max-w-3xl',
        md: 'max-w-5xl',
        lg: 'max-w-7xl',
        full: 'max-w-full',
    };

    // More generous padding for premium feel
    return (
        <div className={`mx-auto px-6 sm:px-8 lg:px-12 ${sizes[size]} ${className}`}>
            {children}
        </div>
    );
}
