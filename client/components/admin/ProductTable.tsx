'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';

interface ProductTableProps {
    products: Product[];
    onDelete: (id: string) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Derive unique categories from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    // Helper for accent-insensitive search
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filteredProducts = products.filter(product => {
        const searchNormalized = normalize(searchTerm);
        const matchesSearch =
            normalize(product.name).includes(searchNormalized) ||
            (product.category && normalize(product.category).includes(searchNormalized)) ||
            normalize(product.id).includes(searchNormalized);
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        let matchesStock = true;

        if (stockFilter === 'in_stock') matchesStock = product.stock > 0;
        else if (stockFilter === 'low_stock') matchesStock = product.stock > 0 && product.stock < 10;
        else if (stockFilter === 'out_of_stock') matchesStock = product.stock === 0;

        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header / Search */}
            <div className="p-6 border-b flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Category Tabs (Scrollable) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
                    <button
                        onClick={() => setCategoryFilter('all')}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === 'all'
                                ? 'bg-teal-main text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Tout
                    </button>
                    {uniqueCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat
                                    ? 'bg-teal-main text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Stock Filter (Pills) */}
                <div className="flex gap-2 pb-2">
                    <select
                        className="p-2 border rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-teal-light/50"
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <option value="all">Tous les stocks</option>
                        <option value="in_stock">En stock</option>
                        <option value="low_stock">Stock faible</option>
                        <option value="out_of_stock">Rupture</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Produit</th>
                            <th className="px-4 py-3 hidden md:table-cell">Catégorie</th>
                            <th className="px-4 py-3 text-right">Prix</th>
                            <th className="px-4 py-3 text-center">État</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                                            {product.images && product.images[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized={product.images[0].startsWith('http')}
                                                />
                                            )}
                                            {(!product.images || product.images.length === 0) && (
                                                <div className="w-full h-full flex items-center justify-center text-lg bg-gray-50">
                                                    🌿
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-dark truncate max-w-[200px] group-hover:text-primary transition-colors">
                                                {product.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-mono">
                                                ID: {product.id.slice(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 hidden md:table-cell">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        {product.category || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-sm font-medium text-dark text-right">
                                    {product.price.toFixed(2)} <span className="text-[10px] text-gray-500">TND</span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                                            product.stock > 0 ? 'bg-orange-100 text-orange-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                                            title="Modifier"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                        {deleteConfirm === product.id ? (
                                            <div className="flex items-center gap-2 animate-fade-in bg-white shadow-lg p-1 rounded border absolute right-12 z-10">
                                                <button
                                                    onClick={() => {
                                                        onDelete(product.id);
                                                        setDeleteConfirm(null);
                                                    }}
                                                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Confirmer
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(product.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Supprimer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Mock) */}
            <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
                <span>Affichage de 1 à {filteredProducts.length} sur {filteredProducts.length} produits</span>
                <div className="flex gap-2">
                    <button disabled className="px-3 py-1 border rounded disabled:opacity-50">Précédent</button>
                    <button disabled className="px-3 py-1 border rounded disabled:opacity-50">Suivant</button>
                </div>
            </div>
        </div>
    );
}
