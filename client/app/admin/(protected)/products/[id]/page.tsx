import { ProductForm } from '@/components/admin/ProductForm';
import { getFeaturedProducts } from '@/lib/api';

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    // Verify we have a valid ID
    if (!id) {
        return <div>Error: Invalid Product ID</div>;
    }

    let product;
    try {
        const { getProductById } = await import('@/lib/api');
        product = await getProductById(id);
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return <div>Error: Product not found</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-dark">Modifier le produit</h2>
                <p className="text-gray-500">Mettre à jour les informations du produit</p>
            </div>

            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
