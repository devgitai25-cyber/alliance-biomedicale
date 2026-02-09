'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Mock type for now, strictly enabling UI dev
interface Order {
    id: string;
    createdAt: string;
    total: number;
    status: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/orders`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const [filter, setFilter] = useState('ALL');

    const filteredOrders = orders.filter(order => {
        if (filter === 'ALL') return true;
        return order.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'PAID': return 'bg-blue-100 text-blue-700';
            case 'PROCESSING': return 'bg-indigo-100 text-indigo-700';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700';
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'PENDING': 'En attente',
            'PAID': 'Payée',
            'PROCESSING': 'En préparation',
            'SHIPPED': 'Expédiée',
            'DELIVERED': 'Livrée',
            'CANCELLED': 'Annulée'
        };
        return labels[status] || status;
    };

    const tabs = [
        { label: 'Tous', value: 'ALL' },
        { label: 'En attente', value: 'PENDING' },
        { label: 'Payées', value: 'PAID' },
        { label: 'En préparation', value: 'PROCESSING' },
        { label: 'Expédiées', value: 'SHIPPED' },
        { label: 'Livrées', value: 'DELIVERED' },
        { label: 'Annulées', value: 'CANCELLED' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Commandes</h2>
                    <p className="text-gray-500">Suivi des achats clients</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${filter === tab.value
                            ? 'bg-white border-x border-t border-gray-200 text-primary -mb-px'
                            : 'text-gray-500 hover:text-dark hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full">
                            {tab.value === 'ALL'
                                ? orders.length
                                : orders.filter(o => o.status === tab.value).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden rounded-tl-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-4">ID Commande</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Aucune commande trouvée.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                            #{order.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-dark">{order.firstName} {order.lastName}</p>
                                            <p className="text-xs text-gray-500">{order.email}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-dark">
                                            {order.total.toFixed(3)} TND
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-primary hover:underline text-sm font-medium"
                                            >
                                                Voir détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
