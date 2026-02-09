import { Container } from '@/components/ui/Container';
import Image from 'next/image';

interface AboutPageProps {
    params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
    const { locale } = await params;

    return (
        <div className="bg-white min-h-screen">
            {/* Hero - Premium Clean */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-20">
                <Container>
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-display font-light text-teal-dark mb-5">
                            À Propos de Alliance Biomédicale
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Votre partenaire privilégié pour des solutions cosmétiques et de santé naturelles, innovantes et respectueuses de l'environnement.
                        </p>
                    </div>
                </Container>
            </section>

            <Container className="py-20 space-y-32">
                {/* Our Mission - Elegant Layout */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-display font-light text-teal-dark">Notre Mission</h2>
                        <p className="text-gray-text font-body leading-relaxed text-lg">
                            Chez Alliance Biomédicale, nous croyons que la beauté et la santé ne doivent pas se faire au détriment de la nature. Notre mission est de proposer des produits de haute qualité, formulés à partir d'ingrédients naturels et biologiques, pour le bien-être de nos clients et de la planète.
                        </p>
                        <p className="text-gray-text font-body leading-relaxed text-lg">
                            Nous sélectionnons rigoureusement nos partenaires et nos ingrédients pour garantir efficacité, sécurité et transparence.
                        </p>
                    </div>
                    <div className="relative h-[400px] rounded-luxury overflow-hidden border border-gray-light/50 shadow-soft bg-gray-ultra-light">
                        {/* Placeholder for About Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-7xl text-teal-light/30">
                            🌿
                        </div>
                    </div>
                </section>

                {/* Our Values - Premium Cards */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-display font-light text-teal-dark text-center mb-16">Nos Valeurs</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="text-center bg-white border border-gray-light/50 p-10 rounded-luxury shadow-whisper hover:shadow-elegant transition-all duration-400">
                            <div className="text-6xl text-teal-main mb-6">🌱</div>
                            <h3 className="text-xl font-display font-semibold text-teal-dark mb-4">Naturel & Bio</h3>
                            <p className="text-gray-text font-body leading-relaxed">
                                Privilégier les ingrédients d'origine naturelle et l'agriculture biologique certifiée.
                            </p>
                        </div>
                        <div className="text-center bg-white border border-gray-light/50 p-10 rounded-luxury shadow-whisper hover:shadow-elegant transition-all duration-400">
                            <div className="text-6xl text-teal-main mb-6">🔬</div>
                            <h3 className="text-xl font-display font-semibold text-teal-dark mb-4">Innovation & Qualité</h3>
                            <p className="text-gray-text font-body leading-relaxed">
                                Allier le meilleur de la nature à l'expertise scientifique pour des formules performantes.
                            </p>
                        </div>
                        <div className="text-center bg-white border border-gray-light/50 p-10 rounded-luxury shadow-whisper hover:shadow-elegant transition-all duration-400">
                            <div className="text-6xl text-teal-main mb-6">🌍</div>
                            <h3 className="text-xl font-display font-semibold text-teal-dark mb-4">Éco-responsabilité</h3>
                            <p className="text-gray-text font-body leading-relaxed">
                                S'engager pour des emballages durables et une production respectueuse de l'environnement.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Story - Refined Gradient */}
                <section className="bg-gradient-to-br from-teal-soft via-teal-light/30 to-white rounded-luxury p-12 md:p-20 text-center relative overflow-hidden border border-teal-light/30">
                    <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-display font-light text-teal-dark">Notre Histoire</h2>
                        <p className="text-lg font-body text-gray-text leading-relaxed">
                            Née d'une passion commune pour la nature et la science, Alliance Biomédicale a vu le jour avec une vision claire : redéfinir les standards de la cosmétique en Tunisie. Depuis nos débuts, nous n'avons cessé d'évoluer, guidés par l'écoute de nos clients et notre engagement inébranlable envers la qualité.
                        </p>
                    </div>
                    {/* Subtle Decorative Elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-teal-main/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-light/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                </section>
            </Container>
        </div>
    );
}
