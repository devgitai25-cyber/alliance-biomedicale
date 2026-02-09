import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/home/CategoryCard';
import { getFeaturedProducts, getCategories } from '@/lib/api';
import { CollectionsCarousel } from '@/components/home/CollectionsCarousel';

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;

    // Fetch dynamic data from backend
    const featuredProducts = await getFeaturedProducts();
    const categories = await getCategories();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1">
                {/* Hero Section - Premium Logo Presentation */}
                <section className="relative bg-gradient-to-b from-teal-soft via-white to-white overflow-hidden">
                    <Container className="py-24 md:py-32">
                        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                            {/* Logo - Central & Prestigious */}
                            <div className="mb-8 flex justify-center">
                                <div className="relative w-32 h-32 md:w-40 md:h-40">
                                    <Image
                                        src="/logo.png"
                                        alt="Alliance Biomédicale"
                                        fill
                                        className="object-contain animate-elegant-zoom"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Premium Badge */}
                            <div className="inline-block mb-6">
                                <span className="border border-teal-main text-teal-dark px-5 py-2 rounded-full text-sm font-display font-medium tracking-wide">
                                    Cosmétiques Bio Certifiés
                                </span>
                            </div>

                            {/* Main Title - Montserrat Light */}
                            <h1 className="text-5xl md:text-7xl font-display font-light text-teal-dark leading-tight mb-6 tracking-tight">
                                Alliance Biomédicale
                            </h1>

                            {/* Subtitle - Elegant & Breathing */}
                            <p className="text-lg md:text-xl text-gray-text leading-relaxed max-w-2xl mx-auto mb-10 font-body">
                                Découvrez notre collection exclusive de soins cosmétiques biologiques,
                                conçus pour sublimer votre beauté naturelle avec élégance et pureté.
                            </p>

                            {/* CTA Buttons - Refined */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button size="lg" variant="primary" href="/products">
                                    Découvrir la Collection
                                </Button>
                                <Button size="lg" variant="outline" href="/about">
                                    Notre Histoire
                                </Button>
                            </div>

                            {/* Trust Line - Discreet */}
                            <div className="flex items-center justify-center gap-12 pt-16 mt-12 border-t border-gray-light/50">
                                <div className="text-center">
                                    <div className="text-3xl font-display font-light text-teal-main mb-1">100%</div>
                                    <div className="text-xs  text-gray-medium uppercase tracking-wide font-body">Bio</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-display font-light text-teal-main mb-1">500+</div>
                                    <div className="text-xs text-gray-medium uppercase tracking-wide font-body">Produits</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-display font-light text-teal-main mb-1">10k+</div>
                                    <div className="text-xs text-gray-medium uppercase tracking-wide font-body">Clients</div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                <section className="py-24 bg-gray-ultra-light overflow-hidden relative">
                    <Container className="relative z-10 mb-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-display font-light text-teal-dark mb-4">
                            Nos Collections
                        </h2>
                        <p className="text-gray-text max-w-2xl mx-auto font-body leading-relaxed">
                            Explorez notre sélection soigneusement organisée de produits biologiques
                        </p>
                    </Container>

                    {/* Interactive Carousel */}
                    <CollectionsCarousel categories={categories} />
                </section>

                {/* Featured Products - Premium Grid */}
                <section className="py-20 bg-white">
                    <Container>
                        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-display font-light text-teal-dark mb-3">
                                    Nos Favoris
                                </h2>
                                <p className="text-gray-text font-body leading-relaxed">
                                    Les bestsellers choisis par notre communauté
                                </p>
                            </div>
                            <Button href="/products" variant="outline">
                                Voir Tout
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        comparePrice={product.comparePrice}
                                        image={product.images[0]}
                                        slug={product.slug}
                                        featured={product.isFeatured}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <div className="text-6xl text-gray-light/50 mb-4">🌿</div>
                                    <p className="text-gray-medium font-body">
                                        Aucun produit en vedette pour le moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Container>
                </section>

                {/* Newsletter CTA - Refined Gradient */}
                <section className="py-24 bg-gradient-to-br from-teal-soft via-teal-light/30 to-white relative overflow-hidden">
                    <Container>
                        <div className="text-center max-w-2xl mx-auto relative z-10">
                            <h2 className="text-3xl md:text-4xl font-display font-light text-teal-dark mb-4">
                                Rejoignez Notre Communauté
                            </h2>
                            <p className="text-lg text-gray-text mb-8 font-body leading-relaxed">
                                Inscrivez-vous à notre newsletter et bénéficiez de -10% sur votre première commande
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="flex-1 px-6 py-4 rounded-lg border border-gray-light bg-white/90 backdrop-blur-sm text-gray-text font-body focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20 transition-all"
                                />
                                <Button size="lg" variant="primary" className="shrink-0">
                                    S'inscrire
                                </Button>
                            </div>
                        </div>
                    </Container>

                    {/* Subtle decorative elements */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-teal-main/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-light/10 rounded-full blur-3xl"></div>
                </section>
            </main>
        </div>
    );
}
