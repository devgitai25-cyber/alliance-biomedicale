'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
    productsCount: number;
    ordersCount: number;
    usersCount: number;
    totalRevenue: number;
    recentOrders: any[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    if (isLoading) {
        return <div className="text-center py-20">Chargement...</div>;
    }

    if (!stats) {
        return <div className="text-center py-20 text-red-500">Erreur lors du chargement des données.</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-1">Revenu Total</p>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-bold text-dark">{stats.totalRevenue.toFixed(2)} TND</h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-600">
                            Global
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-1">Commandes</p>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-bold text-dark">{stats.ordersCount}</h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                            Total
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-1">Clients</p>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-bold text-dark">{stats.usersCount}</h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-600">
                            Inscrits
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-1">Produits</p>
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-2xl font-bold text-dark">{stats.productsCount}</h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                            Actifs
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-dark text-lg">Dernières Commandes</h3>
                    <Link href="/admin/orders" className="text-primary text-sm font-medium hover:underline">Voir tout</Link>
                </div>
                {stats.recentOrders.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {stats.recentOrders.map((order: any) => (
                            <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-medium text-dark">
                                        Commande #{order.id.slice(0, 8)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.user.firstName} {order.user.lastName} • {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-dark">{parseFloat(order.total).toFixed(2)} TND</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500 py-20">
                        <div className="text-4xl mb-4">📦</div>
                        <p>Aucune commande récente à afficher.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
