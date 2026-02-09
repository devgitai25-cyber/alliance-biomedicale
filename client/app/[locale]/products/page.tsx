import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { Container } from '@/components/ui/Container';
import { ProductSort } from '@/components/ProductSort';
import { MobileFilterDrawer } from '@/components/products/MobileFilterDrawer';

interface ProductsPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
    const { locale } = await params;
    const { category, search, sort } = await searchParams;

    // Fetch data
    const [allProducts, categories] = await Promise.all([
        getProducts(category),
        getCategories(),
    ]);

    // Filter by search if provided
    let filteredProducts = allProducts;
    if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = allProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower)
        );
    }

    // Sort products
    if (sort === 'price-asc') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'featured') {
        filteredProducts = [...filteredProducts].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    // Find selected category for breadcrumbs
    const selectedCategory = category ? categories.find((c) => c.id === category) : null;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero - Premium Clean */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-16">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-display font-light text-teal-dark mb-4">
                            Nos Produits
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Découvrez notre gamme complète de cosmétiques biologiques certifiés
                        </p>
                    </div>
                </Container>
            </section>

            <Container className="py-16">
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Mobile Filters Trigger */}
                    <MobileFilterDrawer
                        categories={categories}
                        currentCategory={category}
                        currentSearch={search}
                    />

                    {/* Sidebar Filters - Desktop Only */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-luxury border border-gray-light/50 p-8 shadow-whisper sticky top-28">
                            {/* Categories */}
                            <div className="mb-10">
                                <h3 className="text-sm font-display font-semibold text-teal-dark mb-5 uppercase tracking-luxury">
                                    Catégories
                                </h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/products"
                                        className={`block px-4 py-3 rounded-lg font-body transition-all duration-300 ${!category
                                            ? 'bg-teal-main text-white shadow-soft'
                                            : 'hover:bg-teal-soft text-gray-text hover:text-teal-dark'
                                            }`}
                                    >
                                        Tous les produits
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${cat.id}`}
                                            className={`block px-4 py-3 rounded-lg font-body transition-all duration-300 ${category === cat.id
                                                ? 'bg-teal-main text-white shadow-soft'
                                                : 'hover:bg-teal-soft text-gray-text hover:text-teal-dark'
                                                }`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Search - Refined */}
                            <div>
                                <h3 className="text-sm font-display font-semibold text-teal-dark mb-5 uppercase tracking-luxury">
                                    Recherche
                                </h3>
                                <form action="/products" method="get" className="space-y-3">
                                    {category && <input type="hidden" name="category" value={category} />}
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Rechercher..."
                                        defaultValue={search}
                                        className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-text focus:outline-none focus:border-teal-main focus:ring-2 focus:ring-teal-main/20 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 bg-teal-main text-white rounded-lg font-display font-medium hover:bg-teal-dark shadow-soft hover:shadow-elegant transition-all duration-300"
                                    >
                                        Rechercher
                                    </button>
                                </form>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid - Premium Layout */}
                    <main className="lg:col-span-3">
                        {/* Toolbar - Refined */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                            {/* Breadcrumb */}
                            <div className="text-sm text-gray-medium font-body">
                                <Link href="/" className="hover:text-teal-main transition-colors">
                                    Accueil
                                </Link>
                                <span className="mx-2 text-gray-light">/</span>
                                <Link href="/products" className="hover:text-teal-main transition-colors">
                                    Produits
                                </Link>
                                {selectedCategory && (
                                    <>
                                        <span className="mx-2 text-gray-light">/</span>
                                        <span className="text-teal-dark font-medium">{selectedCategory.name}</span>
                                    </>
                                )}
                            </div>

                            {/* Sort */}
                            <ProductSort currentSort={sort} />
                        </div>

                        {/* Results count */}
                        <div className="mb-8">
                            <p className="text-gray-text font-body">
                                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé
                                {filteredProducts.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        comparePrice={product.comparePrice}
                                        image={product.images && product.images[0]}
                                        slug={product.slug}
                                        featured={product.isFeatured}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-ultra-light rounded-luxury border border-gray-light/30">
                                <div className="text-6xl text-teal-light/40 mb-6">🔍</div>
                                <h3 className="text-2xl font-display font-medium text-teal-dark mb-3">Aucun produit trouvé</h3>
                                <p className="text-gray-text font-body mb-8 max-w-md mx-auto">
                                    Essayez de modifier vos critères de recherche ou de filtrage
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-block px-8 py-3.5 bg-teal-main text-white rounded-lg font-display font-medium hover:bg-teal-dark shadow-soft hover:shadow-elegant transition-all duration-300"
                                >
                                    Voir tous les produits
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </Container>
        </div>
    );
}
