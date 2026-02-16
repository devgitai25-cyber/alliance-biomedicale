'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { validateEmail } from '@/lib/validation';

export default function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailCheck = validateEmail(email);
        if (!emailCheck.isValid) {
            setError(emailCheck.error!);
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/forgot-password?locale=${locale}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-teal-soft/20">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-luxury shadow-elegant border border-gray-light/40 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-soft/20 mb-4">
                            <svg className="h-8 w-8 text-teal-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-display font-light text-teal-dark mb-2">Email envoyé</h2>
                        <p className="text-gray-text font-body mt-4">
                            Si cet email existe dans notre système, vous recevrez un lien de réinitialisation dans quelques instants.
                        </p>
                        <p className="text-sm text-gray-medium font-body mt-4">
                            Vérifiez votre boîte de réception et vos spams.
                        </p>
                    </div>
                    <div className="mt-6">
                        <Link
                            href={`/${locale}/login`}
                            className="w-full flex justify-center px-4 py-3 border border-teal-main text-teal-main font-display font-medium rounded-lg hover:bg-teal-soft/10 transition-all"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-teal-soft/20">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-luxury shadow-elegant border border-gray-light/40 backdrop-blur-sm">
                <div className="text-center">
                    <h2 className="text-4xl font-display font-light text-teal-dark mb-2">Mot de passe oublié</h2>
                    <p className="text-gray-text font-body">
                        Entrez votre adresse email pour recevoir un lien de réinitialisation
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center border border-red-100 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Email</label>
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-main/20 focus:border-teal-main transition-colors font-body ${error ? 'border-red-500' : 'border-gray-light'
                                }`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full flex justify-center py-3.5 text-lg font-display tracking-wide shadow-soft hover:shadow-elegant bg-teal-main hover:bg-teal-dark"
                        >
                            Envoyer le lien
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link
                            href={`/${locale}/login`}
                            className="text-sm font-medium text-teal-main hover:text-teal-dark font-body transition-colors inline-flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la connexion
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
