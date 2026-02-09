'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { updateOrderStatus } from '@/lib/api';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const loadOrder = async () => {
            const { id } = await params;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                    setSelectedStatus(data.status);
                }
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOrder();
    }, [params]);

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

    const handleStatusUpdate = async () => {
        if (!order || selectedStatus === order.status) return;

        setIsUpdating(true);
        try {
            const updatedOrder = await updateOrderStatus(order.id, selectedStatus);
            setOrder(updatedOrder);
            alert('Statut mis à jour avec succès');
        } catch (error: any) {
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCallCustomer = () => {
        if (order?.shippingPhone) {
            window.location.href = `tel:${order.shippingPhone}`;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Commande introuvable</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-start border-b pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-dark">Commande {order.orderNumber}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </div>
                    <p className="text-gray-500">
                        Placée le {new Date(order.createdAt).toLocaleString('fr-FR')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCallCustomer}>
                        📞 Appeler le client
                    </Button>
                </div>
            </div>

            {/* Status Update Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-dark mb-4">💰 Paiement à la Livraison</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Le client paiera en espèces lors de la livraison. Mettez à jour le statut au fur et à mesure.
                </p>
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Statut:</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                        <option value="PENDING">En attente</option>
                        <option value="PROCESSING">En préparation</option>
                        <option value="SHIPPED">Expédiée</option>
                        <option value="DELIVERED">Livrée</option>
                        <option value="PAID">Payée</option>
                        <option value="CANCELLED">Annulée</option>
                    </select>
                    <Button
                        onClick={handleStatusUpdate}
                        isLoading={isUpdating}
                        disabled={selectedStatus === order.status}
                    >
                        Mettre à jour
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-dark mb-4 border-b pb-2">Articles</h3>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center py-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                            IMG
                                        </div>
                                        <div>
                                            <p className="font-medium text-dark">{item.product?.name || `Produit #${item.productId.slice(0, 8)}`}</p>
                                            <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-dark">{item.subtotal.toFixed(2)} TND</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 space-y-2 border-t pt-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{order.subtotal.toFixed(2)} TND</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Réduction</span>
                                    <span>-{order.discount.toFixed(2)} TND</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center font-bold text-lg text-dark border-t pt-2">
                                <span>Total</span>
                                <span>{order.total.toFixed(2)} TND</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-dark mb-4 border-b pb-2">Client</h3>
                        <div className="space-y-3">
                            <p className="font-medium text-lg">{order.shippingName}</p>
                            <a href={`mailto:${order.user?.email}`} className="block text-sm text-primary hover:underline">
                                {order.user?.email}
                            </a>
                            <a
                                href={`tel:${order.shippingPhone}`}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-dark font-medium"
                            >
                                📞 {order.shippingPhone}
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-dark mb-4 border-b pb-2">Adresse de Livraison</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {order.shippingAddress}<br />
                            {order.shippingZip} {order.shippingCity}<br />
                            {order.shippingCountry}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
