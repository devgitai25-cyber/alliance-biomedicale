import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProduct, getProducts } from '@/lib/api';
import { Container } from '@/components/ui/Container';
import { ProductActions } from '@/components/ProductActions';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductTabs } from '@/components/ProductTabs';
import { ProductStickyBar } from '@/components/ProductStickyBar';

interface ProductPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { locale, slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return notFound();
    }

    // Fetch related products (same category)
    const allProducts = await getProducts(product.categoryId);
    const relatedProducts = allProducts
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Breadcrumb - Refined */}
            <div className="bg-gradient-to-b from-gray-ultra-light to-white border-b border-gray-light/30">
                <Container className="py-5">
                    <div className="text-sm text-gray-medium font-body flex items-center gap-2">
                        <Link href="/" className="hover:text-teal-main transition-colors">Accueil</Link>
                        <span className="text-gray-light">/</span>
                        <Link href="/products" className="hover:text-teal-main transition-colors">Produits</Link>
                        <span className="text-gray-light">/</span>
                        <span className="text-teal-dark font-medium truncate">{product.name}</span>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
                    {/* Image Gallery */}
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                        comparePrice={product.comparePrice}
                    />

                    {/* Product Info - Premium */}
                    <div className="space-y-8 lg:sticky lg:top-24 h-fit">
                        <div>
                            {/* Category Tag */}
                            {product.category && (
                                <Link
                                    href={`/products?category=${product.categoryId}`}
                                    className="inline-block text-sm font-body text-teal-main hover:text-teal-dark transition-colors mb-3 uppercase tracking-wide"
                                >
                                    {product.category}
                                </Link>
                            )}

                            <h1 className="text-3xl md:text-5xl font-display font-light text-teal-dark mb-5 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating - Refined */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex text-teal-main text-lg">
                                    {'⭐'.repeat(Math.round(product.rating || 5))}
                                    {'☆'.repeat(5 - Math.round(product.rating || 5))}
                                </div>
                                <span className="text-gray-medium font-body text-sm">
                                    {product.rating?.toFixed(1) || '5.0'} ({product.reviewCount || 0} avis)
                                </span>
                            </div>

                            {/* Price - Elegant */}
                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl font-display font-semibold text-teal-main">
                                    {product.price.toFixed(2)} TND
                                </span>
                                {product.comparePrice && (
                                    <>
                                        <span className="text-xl text-gray-medium font-body line-through">
                                            {product.comparePrice.toFixed(2)} TND
                                        </span>
                                        <span className="bg-white border border-teal-main/30 text-teal-dark px-3 py-1 rounded-full text-sm font-display font-medium backdrop-blur-sm">
                                            -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Short Description */}
                            {product.shortDescription && (
                                <p className="text-lg text-gray-text font-body leading-relaxed mb-8">
                                    {product.shortDescription}
                                </p>
                            )}
                        </div>

                        {/* Stock Status - Refined */}
                        <div className="flex items-center gap-2 mb-6">
                            {product.stock > 0 ? (
                                <>
                                    <span className="w-2.5 h-2.5 bg-teal-main rounded-full"></span>
                                    <span className="text-sm text-gray-text font-body">
                                        En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="w-2.5 h-2.5 bg-gray-medium rounded-full"></span>
                                    <span className="text-sm text-gray-medium font-body font-medium">Rupture de stock</span>
                                </>
                            )}
                        </div>

                        {/* Features List - SVG Icons */}
                        <div className="bg-gray-ultra-light border border-gray-light/50 p-8 rounded-luxury shadow-whisper space-y-4">
                            <div className="flex items-center gap-4">
                                <svg className="w-6 h-6 text-teal-main flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                                </svg>
                                <span className="text-teal-dark font-body font-medium">Ingrédients 100% Naturels</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg className="w-6 h-6 text-teal-main flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                                <span className="text-teal-dark font-body font-medium">Cruelty Free & Vegan</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg className="w-6 h-6 text-teal-main flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span className="text-teal-dark font-body font-medium">Fabriqué en Tunisie</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg className="w-6 h-6 text-teal-main flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                <span className="text-teal-dark font-body font-medium">Certifié Bio</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-light/50 pt-8">
                            <ProductActions product={product} />
                        </div>
                    </div>
                </div>

                {/* Description Tabs - Premium */}
                <div className="bg-white border border-gray-light/50 rounded-luxury p-10 shadow-whisper mb-24">
                    <ProductTabs
                        description={product.description || ''}
                        ingredients={(product as any).ingredients}
                        usage={(product as any).usage}
                    />
                </div>

                {/* Related Products - Elegant */}
                {relatedProducts.length > 0 && (
                    <section>
                        <h2 className="text-3xl md:text-4xl font-display font-light text-teal-dark mb-10">
                            Produits similaires
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    id={p.id}
                                    name={p.name}
                                    price={p.price}
                                    comparePrice={p.comparePrice}
                                    image={p.images && p.images[0]}
                                    slug={p.slug}
                                    featured={p.isFeatured}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </Container>

            {/* Mobile Sticky Bar */}
            <div className="md:hidden">
                <ProductStickyBar product={product} />
            </div>
        </div>
    );
}
