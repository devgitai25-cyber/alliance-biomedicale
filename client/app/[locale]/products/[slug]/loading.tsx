import { Container } from '@/components/ui/Container';

export default function ProductDetailLoading() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            <Container className="py-12">
                {/* Breadcrumb */}
                <div className="flex gap-2 mb-8">
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                    <div className="w-4 h-4 bg-gray-100 rounded" />
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                    <div className="w-4 h-4 bg-gray-100 rounded" />
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-2xl" />
                        <div className="grid grid-cols-5 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="space-y-6">
                        <div className="w-24 h-6 bg-gray-200 rounded-full" />
                        <div className="w-3/4 h-10 bg-gray-200 rounded" />
                        <div className="w-full h-16 bg-gray-100 rounded" />
                        <div className="flex gap-4 items-baseline">
                            <div className="w-28 h-10 bg-gray-200 rounded" />
                            <div className="w-20 h-6 bg-gray-100 rounded" />
                        </div>
                        <div className="w-full h-14 bg-gray-200 rounded-xl" />
                        <div className="w-full h-14 bg-gray-100 rounded-xl" />
                    </div>
                </div>
            </Container>
        </div>
    );
}
