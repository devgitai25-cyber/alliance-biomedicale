'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ProductCard';
import { getWishlist } from '@/lib/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useParams } from 'next/navigation';

export default function WishlistPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const locale = (params?.locale as string) || 'fr';

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await getWishlist();
                setProducts(data);
            } catch (error) {
                console.error('Failed to load wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWishlist();
    }, [locale]);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero - Premium Clean */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-16">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-display font-light text-teal-dark mb-4">
                            Ma Liste de Souhaits
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Retrouvez tous vos articles préférés en un seul endroit.
                        </p>
                    </div>
                </Container>
            </section>

            <Container className="py-16">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-ultra-light animate-pulse h-96 rounded-luxury border border-gray-light/30" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                comparePrice={product.comparePrice}
                                image={product.images[0]}
                                slug={product.slug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-ultra-light rounded-luxury border border-gray-light/30 max-w-2xl mx-auto">
                        {/* SVG Heart Icon */}
                        <svg className="w-20 h-20 mx-auto mb-6 text-teal-light/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <h2 className="text-2xl font-display font-medium text-teal-dark mb-3">Votre liste est vide</h2>
                        <p className="text-gray-text font-body mb-8 max-w-md mx-auto">
                            Parcourez notre catalogue et ajoutez vos coups de cœur !
                        </p>
                        <Button href="/products" variant="primary" size="lg">
                            Découvrir nos produits
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
}
