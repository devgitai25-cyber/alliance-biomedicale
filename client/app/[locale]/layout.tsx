import type { Metadata } from 'next';
import '../globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartDrawer } from '@/components/CartDrawer';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TopLoader } from '@/components/TopLoader';

export const metadata: Metadata = {
    title: 'Alliance Biomédicale - Cosmétiques & Soins Bio - Produits Naturels & Écologiques',
    description: 'Découvrez notre gamme de produits cosmétiques et de soins biologiques de haute qualité. Fabriqué en Tunisie.',
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon.ico', sizes: 'any' },
        ],
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
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
                <TopLoader />
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <Navbar />
                            {children}
                            <Footer />
                            <CartDrawer />
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
