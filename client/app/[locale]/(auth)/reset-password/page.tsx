'use client';

import { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { validatePassword } from '@/lib/validation';

export default function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [globalError, setGlobalError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-teal-soft/20">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-luxury shadow-elegant border border-gray-light/40">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-display font-light text-teal-dark mb-2">Lien invalide</h2>
                        <p className="text-gray-text font-body mt-4">
                            Ce lien de réinitialisation est invalide ou a expiré.
                        </p>
                    </div>
                    <div className="mt-6">
                        <Link
                            href={`/${locale}/forgot-password`}
                            className="w-full flex justify-center px-4 py-3 bg-teal-main text-white font-display font-medium rounded-lg hover:bg-teal-dark transition-all"
                        >
                            Demander un nouveau lien
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        setGlobalError('');
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        const passwordCheck = validatePassword(formData.newPassword);
        if (!passwordCheck.isValid) newErrors.newPassword = passwordCheck.error!;

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setGlobalError('');
        setIsLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/reset-password`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token,
                        newPassword: formData.newPassword
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Token invalide ou expiré');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push(`/${locale}/login`);
            }, 3000);

        } catch (err: any) {
            setGlobalError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-teal-soft/20">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-luxury shadow-elegant border border-gray-light/40">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-soft/20 mb-4">
                            <svg className="h-8 w-8 text-teal-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-display font-light text-teal-dark mb-2">Succès !</h2>
                        <p className="text-gray-text font-body mt-4">
                            Votre mot de passe a été réinitialisé avec succès.
                        </p>
                        <p className="text-sm text-gray-medium font-body mt-2">
                            Redirection vers la page de connexion...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-teal-soft/20">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-luxury shadow-elegant border border-gray-light/40 backdrop-blur-sm">
                <div className="text-center">
                    <h2 className="text-4xl font-display font-light text-teal-dark mb-2">Nouveau mot de passe</h2>
                    <p className="text-gray-text font-body">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>
                </div>

                {globalError && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center border border-red-100 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {globalError}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Nouveau mot de passe</label>
                            <div className="relative">
                                <input
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-main/20 focus:border-teal-main transition-colors font-body ${errors.newPassword ? 'border-red-500' : 'border-gray-light'
                                        }`}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-main transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.newPassword}</p>}
                            <p className="mt-1.5 text-xs text-gray-medium font-body">Minimum 8 caractères</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Confirmer le mot de passe</label>
                            <input
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-main/20 focus:border-teal-main transition-colors font-body ${errors.confirmPassword ? 'border-red-500' : 'border-gray-light'
                                    }`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full flex justify-center py-3.5 text-lg font-display tracking-wide shadow-soft hover:shadow-elegant bg-teal-main hover:bg-teal-dark"
                        >
                            Réinitialiser le mot de passe
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
