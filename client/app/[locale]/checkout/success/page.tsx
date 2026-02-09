

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface SuccessPageProps {
    params: Promise<{ locale: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
    const { locale } = await params;

    // Mock Order ID
    const orderId = `ORD-${Math.floor(Math.random() * 100000)}`;

    return (
        <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center">
            <Container>
                <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-soft text-center animate-scale-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-dark mb-4">Commande Confirmée !</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Merci pour votre achat. Vous recevrez un email de confirmation avec les détails de votre commande.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-8 inline-block">
                        <p className="text-sm text-gray-500 mb-1">Référence commande</p>
                        <p className="font-mono font-bold text-lg text-dark">{orderId}</p>
                    </div>

                    <div className="space-y-4">
                        <Button href={`/${locale}/products`} className="w-full py-4 text-lg">
                            Continuer mes achats
                        </Button>
                        <Link href={`/${locale}`} className="block text-gray-500 hover:text-dark text-sm">
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}
