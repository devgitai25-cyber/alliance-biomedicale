import { Container } from '@/components/ui/Container';

export default function HomeLoading() {
    return (
        <div className="min-h-screen flex flex-col bg-white animate-pulse">
            <main className="flex-1">
                {/* Hero Skeleton */}
                <section className="bg-gradient-to-b from-teal-soft via-white to-white py-24 md:py-32">
                    <Container>
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full mx-auto" />
                            <div className="w-48 h-6 bg-gray-200 rounded-full mx-auto" />
                            <div className="w-80 h-12 bg-gray-200 rounded mx-auto" />
                            <div className="w-96 h-6 bg-gray-100 rounded mx-auto" />
                        </div>
                    </Container>
                </section>

                {/* Categories Skeleton */}
                <section className="py-20">
                    <Container>
                        <div className="text-center mb-12 space-y-3">
                            <div className="w-48 h-8 bg-gray-200 rounded mx-auto" />
                            <div className="w-72 h-5 bg-gray-100 rounded mx-auto" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl" />
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Products Skeleton */}
                <section className="py-20 bg-gray-50">
                    <Container>
                        <div className="text-center mb-12 space-y-3">
                            <div className="w-56 h-8 bg-gray-200 rounded mx-auto" />
                            <div className="w-80 h-5 bg-gray-100 rounded mx-auto" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <div className="aspect-[3/4] bg-gray-200" />
                                    <div className="p-5 space-y-3">
                                        <div className="w-3/4 h-5 bg-gray-200 rounded" />
                                        <div className="w-1/3 h-6 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>
            </main>
        </div>
    );
}
