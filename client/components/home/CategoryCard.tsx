import Link from 'next/link';
import Image from 'next/image';
import { resolveImageUrl, shouldSkipOptimization } from '@/lib/image';

interface CategoryCardProps {
    id: string;
    name: string;
    image?: string;
    index: number;
}

export function CategoryCard({ id, name, image, index }: CategoryCardProps) {
    // Calculate delay based on index for staggered animation
    const delayClass = index === 0 ? '' :
        index === 1 ? 'delay-100' :
            index === 2 ? 'delay-200' :
                'delay-300';

    return (
        <Link
            href={`/products?category=${id}`}
            className={`group block relative overflow-hidden rounded-luxury shadow-elegant hover:shadow-luxury transition-all duration-500 animate-luxury-reveal ${delayClass}`}
        >
            {/* Image Container - Taller 3:4 Aspect Ratio for elegance */}
            <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-100 overflow-hidden">
                {image ? (
                    <Image
                        src={resolveImageUrl(image)}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized={shouldSkipOptimization(image)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-6xl text-teal-light/20">
                        🧴
                    </div>
                )}

                {/* Premium Gradient Overlay - Bottom to Top */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />

                {/* Content - Absolute Positioning */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-display font-medium text-xl md:text-2xl tracking-wide drop-shadow-md">
                        {name}
                    </h3>
                    <div className="h-0.5 w-0 group-hover:w-16 bg-white mx-auto mt-3 transition-all duration-500 ease-out" />
                    <p className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 font-body">
                        Découvrir
                    </p>
                </div>
            </div>
        </Link>
    );
}
