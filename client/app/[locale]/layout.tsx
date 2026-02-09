import type { Metadata } from 'next';
import '../globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartDrawer } from '@/components/CartDrawer';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Alliance Biomédicale - Cosmétiques & Soins Bio',
    description: 'Découvrez notre gamme de produits cosmétiques et de soins biologiques de haute qualité',
};


export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className="min-h-screen">
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        {children}
                        <Footer />
                        <CartDrawer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
