'use client';

import { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { validateEmail, validateRequired } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); // Get login function
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear specific field error
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

        const emailCheck = validateEmail(formData.email);
        if (!emailCheck.isValid) newErrors.email = emailCheck.error!;

        const passwordCheck = validateRequired(formData.password, 'Mot de passe');
        if (!passwordCheck.isValid) newErrors.password = passwordCheck.error!;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setGlobalError('');
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Email ou mot de passe incorrect');
            }

            // Use Context Login
            login(data.accessToken, data.user);

            // Redirect: check for callbackUrl first, then admin/profile
            const callbackUrl = searchParams.get('callbackUrl');
            if (callbackUrl) {
                router.push(decodeURIComponent(callbackUrl));
            } else if (data.user.isAdmin) {
                router.push('/admin');
            } else {
                router.push('/profile');
            }

        } catch (err: any) {
            setGlobalError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-teal-soft/20">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-luxury shadow-elegant border border-gray-light/40 backdrop-blur-sm">
                <div className="text-center">
                    <h2 className="text-4xl font-display font-light text-teal-dark mb-2">Bienvenue</h2>
                    <p className="text-gray-text font-body">Connectez-vous à votre espace personnel</p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="votre@email.com"
                                className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-main/20 focus:border-teal-main transition-colors font-body ${errors.email ? 'border-red-500' : 'border-gray-light'
                                    }`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-gray-700 font-body">Mot de passe</label>
                            </div>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-main/20 focus:border-teal-main transition-colors font-body ${errors.password ? 'border-red-500' : 'border-gray-light'
                                        }`}
                                    value={formData.password}
                                    onChange={handleChange}
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
                            {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-teal-main focus:ring-teal-main border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-text font-body">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href={`/${locale}/forgot-password`} className="font-medium text-teal-main hover:text-teal-dark font-body transition-colors">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full flex justify-center py-3.5 text-lg font-display tracking-wide shadow-soft hover:shadow-elegant bg-teal-main hover:bg-teal-dark"
                        >
                            Se connecter
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-light"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-medium font-body">Ou continuer avec</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <div>
                        <a
                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/google`}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-light rounded-lg font-display font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-whisper hover:shadow-soft"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continuer avec Google
                        </a>
                    </div>


                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-text font-body">
                            Pas encore de compte ?{' '}
                            <Link href="/register" className="font-medium text-teal-main hover:text-teal-dark transition-colors font-display">
                                Créer un compte gratuitement
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
