'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * TopLoader — thin progress bar at the top of the page during navigation.
 * Works by intercepting click events on internal links and monitoring
 * the page's loading state.
 */
export function TopLoader() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startLoading = useCallback(() => {
        setLoading(true);
        setProgress(20);

        // Gradually increase progress
        intervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 400);
    }, []);

    const stopLoading = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);

        timeoutRef.current = setTimeout(() => {
            setLoading(false);
            setProgress(0);
        }, 300);
    }, []);

    useEffect(() => {
        // Listen for click events on links
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // Skip external links, hash links, and same-page links
            if (
                href.startsWith('http') ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                anchor.target === '_blank'
            ) {
                return;
            }

            // Skip if current path is the same
            if (href === window.location.pathname + window.location.search) {
                return;
            }

            startLoading();
        };

        // Stop loading when page finishes rendering
        const observer = new MutationObserver(() => {
            if (loading) {
                stopLoading();
            }
        });

        document.addEventListener('click', handleClick, true);

        // Observe DOM changes to detect when new content is rendered
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            document.removeEventListener('click', handleClick, true);
            observer.disconnect();
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [loading, startLoading, stopLoading]);

    if (!loading && progress === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
            <div
                className="h-full bg-teal-main transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,128,128,0.5)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
