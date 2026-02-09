'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCategory } from '@/lib/api';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function EditCategoryPage() {
    const params = useParams();
    const [category, setCategory] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategory = async () => {
            if (!params.id) {
                setIsLoading(false);
                return;
            }

            try {
                const id = typeof params.id === 'string' ? params.id : params.id[0];
                const data = await getCategory(id);
                setCategory(data);
            } catch (error) {
                console.error('Failed to load category:', error);
                alert('Failed to load category');
            } finally {
                setIsLoading(false);
            }
        };

        loadCategory();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="text-center">Loading category...</div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="p-8">
                <div className="text-center text-red-600">Category not found</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
            {category._count?.products > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    ⚠️ This category has {category._count.products} product(s).
                </div>
            )}
            <CategoryForm initialData={category} isEdit />
        </div>
    );
}
