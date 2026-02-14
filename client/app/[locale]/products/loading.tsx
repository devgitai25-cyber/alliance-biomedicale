import { Container } from '@/components/ui/Container';

export default function ProductsLoading() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            {/* Hero Skeleton */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-16">
                <Container>
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="w-56 h-12 bg-gray-200 rounded mx-auto" />
                        <div className="w-96 h-5 bg-gray-100 rounded mx-auto" />
                    </div>
                </Container>
            </section>

            <Container className="py-16">
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
                            <div className="w-24 h-4 bg-gray-200 rounded" />
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-full h-10 bg-gray-100 rounded-lg" />
                            ))}
                        </div>
                    </aside>

                    {/* Products Grid Skeleton */}
                    <main className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-10">
                            <div className="w-40 h-4 bg-gray-200 rounded" />
                            <div className="w-32 h-10 bg-gray-100 rounded-lg" />
                        </div>
                        <div className="w-32 h-5 bg-gray-100 rounded mb-8" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                                    <div className="aspect-[3/4] bg-gray-200" />
                                    <div className="p-5 space-y-3">
                                        <div className="w-3/4 h-5 bg-gray-200 rounded" />
                                        <div className="w-1/3 h-6 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </Container>
        </div>
    );
}
