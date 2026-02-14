import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface CheckoutPageProps {
    params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { locale } = await params;

    return (
        <AuthGuard>
            <div className="bg-white min-h-screen pb-20">
                {/* Minimalist Luxury Header */}
                <header className="border-b border-gray-100 py-8 mb-12 bg-white">
                    <Container>
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <Link href="/" className="text-3xl font-serif font-bold text-dark tracking-wide uppercase hover:text-primary transition-colors">
                                Alliance Biomédicale
                            </Link>

                        </div>
                    </Container>
                </header>

                <Container>
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left: Forms */}
                        <div className="lg:col-span-7">
                            <CheckoutForm />
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:col-span-5">
                            <div className="lg:sticky lg:top-8">
                                <OrderSummary />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </AuthGuard>
    );
}
