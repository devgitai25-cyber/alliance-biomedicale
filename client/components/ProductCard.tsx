import Link from 'next/link';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/image';

interface ProductCardProps {
    id: string;
    name: string;
    price: number | string;
    comparePrice?: number | string;
    image?: string;
    slug: string;
    featured?: boolean;
}

export function ProductCard({
    id,
    name,
    price,
    comparePrice,
    image,
    slug,
    featured
}: ProductCardProps) {
    const displayPrice = Number(price);
    const displayComparePrice = comparePrice ? Number(comparePrice) : null;
    const hasDiscount = displayComparePrice && displayComparePrice > displayPrice;

    // Calculate percentage if discount exists
    const discountPercent = hasDiscount
        ? Math.round(((displayComparePrice! - displayPrice) / displayComparePrice!) * 100)
        : 0;

    return (
        <Link
            href={`/products/${slug}`}
            className="group bg-white rounded-luxury border border-gray-light/30 hover:border-teal-light/40 overflow-hidden hover-lift hover:shadow-elegant transition-all duration-400 flex flex-col h-full"
        >
            {/* Image Container - Premium 3:4 ratio */}
            <div className="relative aspect-[3/4] bg-white overflow-hidden">
                {image ? (
                    <Image
                        src={resolveImageUrl(image)}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl text-gray-light/50">
                        🌿
                    </div>
                )}

                {/* Refined Badges - Border style, not solid */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {featured && (
                        <span className="bg-white/95 backdrop-blur-sm border border-teal-main text-teal-dark text-xs font-display font-medium px-3 py-1.5 rounded-full shadow-whisper">
                            Populaire
                        </span>
                    )}
                    {hasDiscount && (
                        <span className="bg-white/95 backdrop-blur-sm border border-red-400 text-red-600 text-xs font-display font-medium px-3 py-1.5 rounded-full shadow-whisper">
                            -{discountPercent}%
                        </span>
                    )}
                </div>
            </div>

            {/* Content - Elegant typography */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-medium text-base text-teal-dark mb-2 group-hover:text-teal-main transition-colors duration-300 line-clamp-2 leading-snug">
                    {name}
                </h3>

                <div className="flex items-baseline gap-2.5 mt-auto">
                    <span className="font-display font-semibold text-lg text-teal-main">
                        {displayPrice.toFixed(2)} TND
                    </span>
                    {hasDiscount && (
                        <span className="font-body text-sm text-gray-medium line-through">
                            {displayComparePrice?.toFixed(2)} TND
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
