'use client';

import { useRef, useEffect, useState } from 'react';
import { CategoryCard } from './CategoryCard';

interface Category {
    id: string;
    name: string;
    image?: string;
}

interface CollectionsCarouselProps {
    categories: Category[];
}

export function CollectionsCarousel({ categories }: CollectionsCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    // Duplicate categories to create a seamless loop buffer
    // We triple it to ensure there's always content before/after for smooth resetting
    const items = [...categories, ...categories, ...categories, ...categories];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animationFrameId: number;

        const animate = () => {
            if (!isPaused && !isDragging && container) {
                // Auto-scroll speed (pixels per frame)
                // Adjust this value to control speed: 0.5 is slow and elegant
                container.scrollLeft += 0.5;

                // Check for reset condition
                // If we've scrolled past the first set (approx width of one set), reset
                // This assumes all items have roughly similar widths. 
                // A more robust check is comparing scrollLeft to scrollWidth / 2
                if (container.scrollLeft >= (container.scrollWidth / 4) * 2) {
                    container.scrollLeft = container.scrollWidth / 4;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        // Start animation
        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, isDragging, categories.length]); // Re-run if categories change

    // Mouse Drag Handling for Desktop "Press and Scroll" feel
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setIsPaused(true);
        startX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        scrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setIsPaused(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsPaused(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        const walk = (x - startX.current) * 2; // Scroll-fast multiplier
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
        }
    };

    return (
        <div className="relative group w-full">
            {/* Gradient Masks */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-gray-ultra-light to-transparent z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-50" />
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-gray-ultra-light to-transparent z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-50" />

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 md:gap-8 overflow-x-auto px-4 py-8 cursor-grab active:cursor-grabbing select-none"
                style={{
                    scrollBehavior: 'auto',
                    scrollbarWidth: 'none',  /* Firefox */
                    msOverflowStyle: 'none'  /* IE and Edge */
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Hide Scrollbar for Chrome/Safari/Opera */}
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {items.map((category, index) => (
                    <div
                        key={`${category.id}-${index}`}
                        className="w-[260px] md:w-[320px] flex-shrink-0 transition-transform duration-500 hover:scale-[1.02]"
                    >
                        <CategoryCard
                            id={category.id}
                            name={category.name}
                            image={category.image}
                            index={index % categories.length}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
