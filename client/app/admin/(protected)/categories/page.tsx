'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminCategories, deleteCategory } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { CategoryTable } from '@/components/admin/CategoryTable';
import { Category } from '@/types';

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await getAdminCategories();
            setCategories(data);
        } catch (error: any) {
            console.error('Failed to load categories:', error);
            setError(error.message || 'Failed to load categories');
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
            setError(error.message || 'Failed to delete category');
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

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-600 mb-3">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-medium">{error}</p>
                    </div>
                    <button
                        onClick={loadCategories}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-20">Chargement...</div>
            ) : !error && (
                <CategoryTable categories={categories} onDelete={handleDelete} />
            )}
        </div>
    );
}
