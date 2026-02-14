import { Container } from '@/components/ui/Container';

export default function CartLoading() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-16">
                <Container>
                    <div className="w-40 h-10 bg-gray-200 rounded mx-auto" />
                </Container>
            </section>

            <Container className="py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-2xl">
                                <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="w-3/4 h-5 bg-gray-200 rounded" />
                                    <div className="w-1/3 h-6 bg-gray-200 rounded" />
                                    <div className="w-24 h-8 bg-gray-100 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4">
                            <div className="w-40 h-6 bg-gray-200 rounded" />
                            <div className="w-full h-4 bg-gray-100 rounded" />
                            <div className="w-full h-4 bg-gray-100 rounded" />
                            <div className="w-full h-12 bg-gray-200 rounded-xl mt-6" />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
