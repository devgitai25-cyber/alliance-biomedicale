'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { createProduct, updateProduct, getCategories } from '@/lib/api';

interface ProductFormProps {
    initialData?: Partial<Product>;
    isEdit?: boolean;
}

export function ProductForm({ initialData = {}, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        shortDescription: initialData.shortDescription || '',
        ingredients: initialData.ingredients || '',
        usage: initialData.usage || '',
        price: initialData.price || 0,
        comparePrice: initialData.comparePrice || 0,
        stock: initialData.stock || 0,
        categoryId: initialData.categoryId,
        imageUrl: initialData.images?.[0] || '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialData.images?.[0] || '');
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCats = async () => {
            const cats = await getCategories();
            setCategories(cats);
            // Set default category if creating new product and none selected
            if (!isEdit && cats.length > 0 && !formData.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
            }
        };
        fetchCats();
    }, [isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Create local preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('shortDescription', formData.shortDescription);
            data.append('ingredients', formData.ingredients);
            data.append('usage', formData.usage);

            data.append('price', String(formData.price));
            if (formData.comparePrice) {
                data.append('comparePrice', String(formData.comparePrice));
            }
            data.append('stock', String(formData.stock));

            let catId = formData.categoryId;
            if (!catId && categories.length > 0) {
                catId = categories[0].id;
            }

            if (catId) {
                data.append('categoryId', catId);
            } else {
                throw new Error('Veuillez sélectionner une catégorie');
            }

            if (selectedFile) {
                data.append('image', selectedFile);
            }

            if (isEdit && initialData.id) {
                await updateProduct(initialData.id, data);
            } else {
                await createProduct(data);
            }

            // Redirect back to list
            router.push('/admin/products');
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Product Information */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg text-dark border-b pb-2">Informations Produit</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Produit *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="Ex: Crème hydratante bio"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Courte Description</label>
                        <input
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            maxLength={150}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="Description courte pour les listes de produits"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum 150 caractères</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description Complète</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            required
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="Description détaillée du produit, ses avantages, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients</label>
                        <textarea
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="Liste des ingrédients..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conseils d'utilisation</label>
                        <textarea
                            name="usage"
                            value={formData.usage}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="Comment utiliser ce produit..."
                        />
                    </div>
                </div>

                {/* Right Column: Pricing & Media */}
                <div className="space-y-6">
                    <h3 className="font-bold text-lg text-dark border-b pb-2">Prix & Inventaire</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                        >
                            <option value="" disabled>Sélectionner une catégorie</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (TND)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Promo (opt)</label>
                            <input
                                type="number"
                                name="comparePrice"
                                value={formData.comparePrice}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primaryDark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                    >
                                        <span>Télécharger une image</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                            </div>
                        </div>

                        {previewUrl && (
                            <div className="mt-4 relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden border">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewUrl('');
                                        setSelectedFile(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Annuler
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEdit ? 'Mettre à jour' : 'Créer le produit'}
                </Button>
            </div>
        </form>
    );
}
