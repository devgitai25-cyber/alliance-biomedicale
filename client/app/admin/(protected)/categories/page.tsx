'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, deleteCategory } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { CategoryTable } from '@/components/admin/CategoryTable';
import { Category } from '@/types';

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
            alert('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, cascade: boolean) => {
        try {
            await deleteCategory(id, cascade);
            // @ts-ignore - id mismatch potentially in filtered list
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (error: any) {
            alert(error.message || 'Failed to delete category');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Catégories</h2>
                    <p className="text-gray-500">Gérez les catégories de produits</p>
                </div>
                <Button href="/admin/categories/new">
                    + Nouvelle Catégorie
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-20">Chargement...</div>
            ) : (
                <CategoryTable categories={categories} onDelete={handleDelete} />
            )}
        </div>
    );
}
