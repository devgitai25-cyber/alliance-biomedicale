'use client';

import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-dark">Ajouter un produit</h2>
                <p className="text-gray-500">Créer une nouvelle fiche produit</p>
            </div>

            <ProductForm />
        </div>
    );
}
