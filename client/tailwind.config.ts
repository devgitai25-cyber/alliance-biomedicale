import type { Config } from 'tailwindcss';

export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Premium Typography
            fontFamily: {
                display: ['Montserrat', 'sans-serif'],
                body: ['Lato', 'sans-serif'],
            },

            // Refined Color Palette - White Dominance with Teal Accents
            colors: {
                // Core whites and neutrals
                white: '#FFFFFF',
                'gray-ultra-light': '#FAFBFC',
                'gray-light': '#F5F6F7',
                'gray-medium': '#86888A',
                'gray-text': '#4A4A4A',

                // Teal palette (used sparingly)
                'teal-soft': '#E6F7F7',
                'teal-light': '#B3E5E3',
                'teal-main': '#1FA7A0',
                'teal-dark': '#2C6F6D',

                // Legacy aliases for compatibility
                primary: '#1FA7A0',
                dark: '#2C6F6D',
                highlight: '#E6F7F7',
                neutral: '#86888A',
                background: '#FFFFFF',
                surface: '#FAFBFC',
                border: '#E5E7EB',

                // Feedback colors (kept subtle)
                success: '#10B981',
                error: '#EF4444',
                warning: '#F59E0B',
                info: '#3B82F6',
            },

            // Ultra-Subtle Luxury Shadows
            boxShadow: {
                'whisper': '0 1px 3px rgba(0, 0, 0, 0.02)',
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'elegant': '0 4px 16px rgba(0, 0, 0, 0.06)',
                'luxury': '0 8px 32px rgba(0, 0, 0, 0.08)',
                'elevated': '0 12px 48px rgba(0, 0, 0, 0.1)',
            },

            // Generous Spacing for Breathing Room
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
                '34': '8.5rem',
            },

            // Elegant Animations (Slower, Subtler)
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'elegant-zoom': 'elegantZoom 0.5s ease-out',
                'soft-slide': 'softSlide 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },

            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                elegantZoom: {
                    '0%': { opacity: '0', transform: 'scale(0.98)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                softSlide: {
                    '0%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.97)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },

            // Refined Border Radius
            borderRadius: {
                'luxury': '12px',
                'premium': '16px',
            },

            // Letter Spacing for Premium Feel
            letterSpacing: {
                'luxury': '0.025em',
                'premium': '0.05em',
            },

            // Subtle Transform Scales
            scale: {
                '103': '1.03',
            },
        },
    },
    plugins: [],
} satisfies Config;
