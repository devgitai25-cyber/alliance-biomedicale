import { Container } from '@/components/ui/Container';

export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-16">
                <Container>
                    <div className="w-40 h-10 bg-gray-200 rounded mx-auto" />
                </Container>
            </section>

            <Container className="py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header */}
                    <div className="flex items-center gap-6 p-8 bg-white border border-gray-100 rounded-2xl">
                        <div className="w-20 h-20 bg-gray-200 rounded-full" />
                        <div className="space-y-3 flex-1">
                            <div className="w-48 h-6 bg-gray-200 rounded" />
                            <div className="w-64 h-4 bg-gray-100 rounded" />
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="space-y-4">
                        <div className="w-36 h-7 bg-gray-200 rounded" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <div className="w-32 h-5 bg-gray-200 rounded" />
                                        <div className="w-24 h-4 bg-gray-100 rounded" />
                                    </div>
                                    <div className="w-20 h-8 bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
