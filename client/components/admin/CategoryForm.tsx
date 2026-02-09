'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface CategoryFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

    const [formData, setFormData] = useState({
        slug: initialData?.slug || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        displayOrder: initialData?.displayOrder || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'displayOrder' ? parseInt(value) || 0 : value
        }));

        // Auto-generate slug from name
        if (name === 'name' && !isEdit) {
            const slug = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // For now, we'll store image as base64 if uploaded
            // In production, you'd want to upload to Cloudinary via backend
            let imageUrl = initialData?.image || '';

            if (imageFile) {
                // Convert to base64 for simple storage
                // TODO: Implement proper image upload via backend
                const reader = new FileReader();
                imageUrl = await new Promise<string>((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(imageFile);
                });
            }

            const data = {
                slug: formData.slug,
                name: formData.name,
                description: formData.description,
                displayOrder: formData.displayOrder,
                image: imageUrl || undefined,
            };

            const { createCategory, updateCategory } = await import('@/lib/api');

            if (isEdit && initialData?.id) {
                await updateCategory(initialData.id, data);
            } else {
                await createCategory(data);
            }

            router.push('/admin/categories');
            router.refresh();
        } catch (error: any) {
            setError(error.message || 'Failed to save category');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            {/* Slug */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                </label>
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    pattern="[a-z0-9-]+"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="my-category-slug"
                />
                <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and hyphens only</p>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {imagePreview && (
                    <div className="mt-4">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>

            {/* Display Order */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                </label>
                <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
                <Button type="submit" isLoading={isLoading}>
                    {isEdit ? 'Update Category' : 'Create Category'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
