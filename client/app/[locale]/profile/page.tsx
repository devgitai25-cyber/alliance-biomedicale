'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button'; // Assuming Button component exists

// Order Interface matching backend schema
interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            slug: string;
        };
    }[];
}

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const view = searchParams.get('view') || 'orders';
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError('');

                // Load user from localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                // Fetch real orders from API
                const token = localStorage.getItem('token');
                if (token) {
                    const { getMyOrders } = await import('@/lib/api');
                    const ordersData = await getMyOrders();
                    setOrders(ordersData);
                } else {
                    setOrders([]);
                }
            } catch (error: any) {
                console.error('Error fetching orders:', error);
                setError(error.message || 'Failed to load orders');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Helper functions for status display
    const getStatusStyle = (status: Order['status']) => {
        const styles = {
            'PENDING': 'bg-amber-50 text-amber-700 border-amber-100',
            'PAID': 'bg-teal-soft text-dark border-teal-light',
            'PROCESSING': 'bg-blue-50 text-blue-700 border-blue-100',
            'SHIPPED': 'bg-purple-50 text-purple-700 border-purple-100',
            'DELIVERED': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'CANCELLED': 'bg-red-50 text-red-700 border-red-100'
        };
        return styles[status] || 'bg-gray-50 text-gray-600 border-gray-100';
    };

    const getStatusLabel = (status: Order['status']) => {
        const labels = {
            'PENDING': 'En attente',
            'PAID': 'Payée',
            'PROCESSING': 'En préparation',
            'SHIPPED': 'Expédiée',
            'DELIVERED': 'Livrée',
            'CANCELLED': 'Annulée'
        };
        return labels[status] || status;
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-2 border-dark border-t-transparent animate-spin mb-4"></div>
                <p className="text-gray-medium font-serif">Chargement de votre profil...</p>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-dark mb-2">Une erreur est survenue</h3>
                <p className="text-gray-medium mb-6">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-dark text-white hover:bg-teal-dark">Réessayer</Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
            {view === 'orders' ? (
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-light pb-6">
                        <h2 className="text-2xl font-serif font-bold text-dark tracking-wide">Mes Commandes</h2>
                        <span className="text-sm text-gray-medium">{orders.length} commande{orders.length !== 1 ? 's' : ''}</span>
                    </div>

                    {orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-light">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-medium uppercase tracking-widest">Référence</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-medium uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-medium uppercase tracking-widest">Total</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-medium uppercase tracking-widest text-right">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-light">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-teal-soft/10 transition-colors group cursor-default">
                                            <td className="px-6 py-5 font-serif font-bold text-dark group-hover:text-primary transition-colors">
                                                {order.orderNumber}
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-text">
                                                {new Date(order.createdAt).toLocaleDateString('fr-TN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-5 font-medium text-dark">
                                                {order.total.toFixed(2)} <span className="text-xs text-gray-medium">TND</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-ultra-light rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">🛍️</div>
                            <h3 className="text-lg font-serif font-bold text-dark mb-2">Aucune commande pour le moment</h3>
                            <p className="text-gray-medium mb-6 text-sm max-w-md mx-auto">Explorez notre collection et laissez-vous tenter par nos produits d'exception.</p>
                            <Button href="/products" className="bg-dark text-white hover:bg-teal-dark px-8 py-3 rounded-xl uppercase tracking-wider text-xs font-bold shadow-lg hover:shadow-xl transition-all">
                                Découvrir la collection
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center border-b border-gray-light pb-8">
                        <div className="w-24 h-24 bg-gray-ultra-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                            <span className="text-3xl font-serif text-dark font-bold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </span>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-dark tracking-wide mb-2">Mon Profil</h2>
                        <p className="text-gray-medium text-sm">Gérez vos informations personnelles</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Prénom</label>
                                <input
                                    type="text"
                                    defaultValue={user?.firstName}
                                    className="w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-dark placeholder-gray-400"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Nom</label>
                                <input
                                    type="text"
                                    defaultValue={user?.lastName}
                                    className="w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-dark placeholder-gray-400"
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email"
                                defaultValue={user?.email}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 text-gray-400 cursor-not-allowed rounded-t-lg"
                            />
                            <p className="mt-1 text-xs text-gray-400">L'adresse email ne peut pas être modifiée.</p>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Téléphone</label>
                            <input
                                type="tel"
                                defaultValue={user?.phone}
                                placeholder="+216 ..."
                                className="w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-dark placeholder-gray-400"
                            />
                        </div>
                        <div className="pt-6 flex justify-end">
                            <Button type="submit" className="bg-dark text-white hover:bg-teal-dark px-8 py-3 rounded-xl uppercase tracking-wider text-xs font-bold shadow-lg hover:shadow-xl transition-all">
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
