'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Category } from '@/types';
import { resolveImageUrl, shouldSkipOptimization } from '@/lib/image';

interface CategoryTableProps {
    categories: Category[];
    onDelete: (id: string, cascade: boolean) => void;
}

export function CategoryTable({ categories, onDelete }: CategoryTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Helper for accent-insensitive search
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filteredCategories = categories.filter(category => {
        const searchNormalized = normalize(searchTerm);
        return (
            normalize(category.name).includes(searchNormalized) ||
            normalize(category.slug).includes(searchNormalized) ||
            normalize(category.id).includes(searchNormalized)
        );
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header / Search */}
            <div className="p-6 border-b flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Rechercher une catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-4">Catégorie</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Produits</th>
                            <th className="px-6 py-4">Ordre</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Aucune catégorie trouvée.
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                                                {category.image ? (
                                                    <Image
                                                        src={resolveImageUrl(category.image)}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized={shouldSkipOptimization(category.image)}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl bg-gray-50">
                                                        📁
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-dark">{category.name}</p>
                                                <p className="text-xs text-gray-500">ID: {category.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{category.slug}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                                            {category._count?.products ?? 0} produits
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {/* @ts-ignore - displayOrder might be missing in type definition but present in API */}
                                        {category.displayOrder || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-4 text-sm font-medium">
                                            <Link
                                                href={`/admin/categories/${category.id}`}
                                                className="text-primary hover:text-teal-700"
                                            >
                                                Modifier
                                            </Link>
                                            {deleteConfirm === category.id ? (
                                                <div className="flex flex-col items-end gap-2">
                                                    {(category._count?.products ?? 0) > 0 && (
                                                        <span className="text-xs text-red-600 font-medium">
                                                            ⚠️ Contient {category._count?.products} produits
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const hasProducts = (category._count?.products ?? 0) > 0;
                                                                onDelete(category.id, hasProducts);
                                                                setDeleteConfirm(null);
                                                            }}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            {(category._count?.products ?? 0) > 0 ? "Tout supprimer" : "Confirmer"}
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(category.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Mock) */}
            <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
                <span>Affichage de 1 à {filteredCategories.length} sur {filteredCategories.length} catégories</span>
                <div className="flex gap-2">
                    <button disabled className="px-3 py-1 border rounded disabled:opacity-50">Précédent</button>
                    <button disabled className="px-3 py-1 border rounded disabled:opacity-50">Suivant</button>
                </div>
            </div>
        </div>
    );
}
