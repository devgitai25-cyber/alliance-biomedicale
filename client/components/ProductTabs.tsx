'use client';

import { useState } from 'react';

interface ProductTabsProps {
    description: string;
    ingredients?: string;
    usage?: string;
}

export function ProductTabs({ description, ingredients, usage }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage'>('description');

    const tabs = [
        { id: 'description' as const, label: 'Description', content: description },
        { id: 'ingredients' as const, label: 'Ingrédients', content: ingredients },
        { id: 'usage' as const, label: "Conseils d'utilisation", content: usage },
    ];

    return (
        <div className="space-y-8">
            {/* Desktop Tabs (>= md) */}
            <div className="hidden md:block">
                <div className="border-b mb-8 border-gray-light">
                    <div className="flex gap-10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 border-b-2 text-lg font-serif font-medium transition-all tracking-wide ${activeTab === tab.id
                                    ? 'border-dark text-dark'
                                    : 'border-transparent text-gray-medium hover:text-dark hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="prose max-w-none text-gray-text leading-relaxed">
                    {activeTab === 'description' && (
                        <div className="whitespace-pre-line animate-fade-in">{description || 'Aucune description disponible.'}</div>
                    )}
                    {activeTab === 'ingredients' && (
                        <div className="whitespace-pre-line animate-fade-in">{ingredients || 'Information sur les ingrédients non disponible.'}</div>
                    )}
                    {activeTab === 'usage' && (
                        <div className="whitespace-pre-line animate-fade-in">{usage || "Conseils d'utilisation non disponibles."}</div>
                    )}
                </div>
            </div>

            {/* Mobile Accordion (< md) */}
            <div className="md:hidden space-y-4">
                {tabs.map((tab) => (
                    <div key={tab.id} className="border border-gray-light/50 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => setActiveTab(activeTab === tab.id ? 'description' : tab.id)} // Toggle behavior
                            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${activeTab === tab.id ? 'bg-gray-ultra-light' : 'bg-white'}`}
                        >
                            <span className={`font-serif font-bold tracking-wide ${activeTab === tab.id ? 'text-dark' : 'text-gray-text'}`}>
                                {tab.label}
                            </span>
                            <span className={`transform transition-transform duration-300 ${activeTab === tab.id ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-gray-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${activeTab === tab.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                            <div className="overflow-hidden">
                                <div className="p-5 pt-0 text-gray-text text-sm leading-relaxed whitespace-pre-line border-t border-gray-light/30">
                                    {tab.content || 'Non disponible.'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
