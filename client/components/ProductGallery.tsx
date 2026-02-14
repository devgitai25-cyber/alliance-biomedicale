'use client';

import { useState } from 'react';
import Image from 'next/image';
import { resolveImageUrl, shouldSkipOptimization } from '@/lib/image';

interface ProductGalleryProps {
    images: string[];
    productName: string;
    comparePrice?: number;
}

export function ProductGallery({ images, productName, comparePrice }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    // Fallback if no images
    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-soft flex items-center justify-center">
                <span className="text-6xl">🌿</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile Carousel (visible on < md) */}
            <div className="md:hidden relative group">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide -mx-4 px-4">
                    {images.map((img, i) => (
                        <div key={i} className="flex-none w-[85vw] aspect-square relative snap-center rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <Image
                                src={resolveImageUrl(img)}
                                alt={`${productName} - Vue ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="85vw"
                                priority={i === 0}
                                unoptimized={shouldSkipOptimization(img)}
                            />
                            {i === 0 && comparePrice && (
                                <div className="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10 uppercase tracking-wide">
                                    Promo
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Scroll Indicator Hint */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === 0 ? 'bg-teal-main' : 'bg-gray-200'}`} // Simplified active state for MVP
                        />
                    ))}
                </div>
            </div>

            {/* Desktop Gallery (visible on >= md) */}
            <div className="hidden md:block space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-ultra-light rounded-2xl overflow-hidden shadow-soft group border border-gray-light/30">
                    <Image
                        src={resolveImageUrl(images[selectedImage])}
                        alt={`${productName}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="50vw"
                        priority
                        unoptimized={shouldSkipOptimization(images[selectedImage])}
                    />
                    {comparePrice && (
                        <div className="absolute top-6 left-6 bg-error text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg z-10 uppercase tracking-widest">
                            Promo
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                                aria-label="Image précédente"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                                aria-label="Image suivante"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-4">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`relative aspect-square bg-gray-ultra-light rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === i
                                    ? 'ring-2 ring-teal-main ring-offset-2 ring-offset-white shadow-md scale-95 opacity-100'
                                    : 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-1 opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={resolveImageUrl(img)}
                                    alt={`${productName} view ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="10vw"
                                    unoptimized={shouldSkipOptimization(img)}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
