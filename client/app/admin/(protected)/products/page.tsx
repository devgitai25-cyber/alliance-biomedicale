'use client';

import { useState, useEffect } from 'react';
import { ProductTable } from '@/components/admin/ProductTable';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { getAdminProducts, deleteProduct } from '@/lib/api';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            setError('');
            // Fetch all products with admin-specific API (no cache)
            const data = await getAdminProducts();
            setProducts(data);
        } catch (error: any) {
            console.error('Failed to load products:', error);
            setError(error.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error: any) {
                console.error('Failed to delete product:', error);
                setError(error.message || 'Failed to delete product');
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Produits</h2>
                    <p className="text-gray-500">Gérez votre catalogue produit</p>
                </div>
                <Button href="/admin/products/new">
                    + Nouveau Produit
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-600 mb-3">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium">{error}</p>
                    </div>
                    <button
                        onClick={loadProducts}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-20">Chargement...</div>
            ) : !error && (
                <ProductTable products={products} onDelete={handleDelete} />
            )}
        </div>
    );
}
