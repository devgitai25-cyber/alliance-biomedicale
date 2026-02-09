'use client';

import { useState, useEffect } from 'react';
import { getUsers } from '@/lib/api';

export default function CustomersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'customers' | 'admins'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'orders'>('newest');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
            alert('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filteredUsers = users
        .filter(user => {
            const searchNormalized = normalize(searchTerm);
            const matchesSearch =
                normalize(user.firstName || '').includes(searchNormalized) ||
                normalize(user.lastName || '').includes(searchNormalized) ||
                normalize(user.email || '').includes(searchNormalized) ||
                normalize(user.phone || '').includes(searchNormalized);

            if (!matchesSearch) return false;

            if (filter === 'admins') return user.isAdmin;
            if (filter === 'customers') return !user.isAdmin;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'orders') {
                return (b._count?.orders || 0) - (a._count?.orders || 0);
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-teal-main">
                <svg className="animate-spin h-8 w-8 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-dark">Clients</h2>
                    <p className="text-gray-500">Gérez votre base de données utilisateurs</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Total Clients</span>
                        <div className="text-xl font-bold text-teal-dark">{users.length}</div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Nouveaux (30j)</span>
                        <div className="text-xl font-bold text-teal-dark">
                            {users.filter(u => (new Date().getTime() - new Date(u.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000).length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Tools Bar */}
                <div className="p-4 border-b border-gray-100 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative w-full sm:w-96">
                            <input
                                type="text"
                                placeholder="Rechercher un client (nom, email, tel)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-main/20 focus:border-teal-main outline-none transition-all"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-teal-light/50"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="newest">Plus récents</option>
                                <option value="orders">Plus de commandes</option>
                            </select>
                        </div>
                    </div>

                    {/* Horizontal Scrollable Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide border-t border-gray-50 pt-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'all'
                                    ? 'bg-teal-main text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setFilter('customers')}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'customers'
                                    ? 'bg-teal-main text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Clients
                            <span className="ml-2 bg-white/20 px-1.5 rounded-full text-xs">
                                {users.filter(u => !u.isAdmin).length}
                            </span>
                        </button>
                        <button
                            onClick={() => setFilter('admins')}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === 'admins'
                                    ? 'bg-teal-main text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Administrateurs
                            <span className="ml-2 bg-white/20 px-1.5 typeof rounded-full text-xs">
                                {users.filter(u => u.isAdmin).length}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Utilisateur</th>
                                <th className="px-6 py-3 hidden md:table-cell">Contact</th>
                                <th className="px-6 py-3 text-center">Commandes</th>
                                <th className="px-6 py-3">Rôle</th>
                                <th className="px-6 py-3 text-right">Inscription</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <span className="text-2xl">🔍</span>
                                            <p>Aucun utilisateur trouvé</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-teal-50 text-teal-700'
                                                    }`}>
                                                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-dark truncate">
                                                        {user.firstName ? `${user.firstName} ${user.lastName}` : 'Client sans nom'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate md:hidden">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 hidden md:table-cell">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-gray-700">{user.email}</span>
                                                <span className="text-gray-400 text-xs">{user.phone || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${(user._count?.orders || 0) > 0
                                                    ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {user._count?.orders || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            {user.isAdmin ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    Client
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="text-gray-400 hover:text-teal-600 p-2 rounded-full hover:bg-teal-50 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
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
