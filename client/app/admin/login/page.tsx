'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { login } = await import('@/lib/auth');
            const data = await login(email, password);

            if (data.user.isAdmin) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/admin');
            } else {
                setError('Accès non autorisé. Vous devez être administrateur.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Email ou mot de passe incorrect');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-primary">BioEco Admin</h1>
                    <p className="text-gray-500">Connexion au tableau de bord</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="admin@bioeco.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full">
                        Se connecter
                    </Button>
                </form>
            </div>
        </div>
    );
}
