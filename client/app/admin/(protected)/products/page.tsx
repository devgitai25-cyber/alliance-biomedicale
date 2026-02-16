'use client';

import { useState, useEffect } from 'react';
import { ProductTable } from '@/components/admin/ProductTable';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { getAdminProducts, deleteProduct } from '@/lib/api';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Fetch all products with admin-specific API (no cache)
                const data = await getAdminProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Erreur lors de la suppression du produit');
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

            {isLoading ? (
                <div className="text-center py-20">Chargement...</div>
            ) : (
                <ProductTable products={products} onDelete={handleDelete} />
            )}
        </div>
    );
}
