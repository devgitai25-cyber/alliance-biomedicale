'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface ProductSortProps {
    currentSort?: string;
}

export function ProductSort({ currentSort }: ProductSortProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (newSort) {
            params.set('sort', newSort);
        } else {
            params.delete('sort');
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-neutral">Trier par:</span>
            <select
                value={currentSort || ''}
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
                <option value="">Défaut</option>
                <option value="featured">Populaires</option>
                <option value="name">Nom A-Z</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
            </select>
        </div>
    );
}
