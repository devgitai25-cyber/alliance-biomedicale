import { Container } from '@/components/ui/Container';

interface FAQPageProps {
    params: Promise<{ locale: string }>;
}

export default async function FAQPage({ params }: FAQPageProps) {
    const { locale } = await params;

    const faqs = [
        {
            question: "Quels sont les délais de livraison ?",
            answer: "Nous expédions généralement les commandes sous 24h. La livraison prend ensuite 24 à 48 heures pour le Grand Tunis et 48 à 72 heures pour le reste de la Tunisie."
        },
        {
            question: "Les produits sont-ils vraiment 100% naturels ?",
            answer: "Absolument. Chez Alliance Biomédicale, nous sélectionnons rigoureusement des produits composés d'ingrédients naturels et biologiques, sans parabènes ni substances nocives."
        },
        {
            question: "Comment puis-je suivre ma commande ?",
            answer: "Une fois votre commande expédiée, vous recevrez un email de confirmation contenant un numéro de suivi vous permettant de localiser votre colis en temps réel."
        },
        {
            question: "Acceptez-vous les retours ?",
            answer: "Oui, nous acceptons les retours dans un délai de 14 jours après réception, à condition que les produits soient non ouverts et dans leur emballage d'origine. Veuillez consulter notre page 'Livraison & Retours' pour plus de détails."
        },
        {
            question: "Quels modes de paiement acceptez-vous ?",
            answer: "Nous acceptons le paiement à la livraison (espèces) ainsi que les paiements par carte bancaire sécurisés via notre partenaire de paiement."
        },
        {
            question: "Puis-je annuler ou modifier ma commande ?",
            answer: "Si votre commande n'a pas encore été expédiée, vous pouvez nous contacter rapidement par téléphone ou email pour demander une modification ou une annulation."
        },
        {
            question: "Proposez-vous des conseils personnalisés ?",
            answer: "Oui ! Notre équipe d'experts est disponible pour vous conseiller sur les produits les plus adaptés à votre type de peau et à vos besoins. N'hésitez pas à nous contacter."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-20">
                <Container>
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-display font-light text-teal-dark mb-5">
                            Foire Aux Questions
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Retrouvez ici les réponses aux questions les plus fréquentes concernant nos produits, vos commandes et nos services.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Content Section */}
            <Container className="py-12 pb-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-6 md:p-8 rounded-luxury border border-gray-light/50 shadow-soft">
                            <h3 className="text-xl font-display font-medium text-teal-dark mb-3 flex items-start gap-3">
                                <span className="text-teal-main font-bold text-lg">Q.</span>
                                {faq.question}
                            </h3>
                            <div className="pl-8">
                                <p className="text-gray-text font-body leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}

                    <div className="mt-12 text-center bg-teal-soft/30 p-8 rounded-luxury">
                        <h3 className="text-xl font-display font-medium text-teal-dark mb-3">
                            Vous n'avez pas trouvé de réponse ?
                        </h3>
                        <p className="text-gray-text font-body mb-6">
                            Notre équipe est là pour vous aider.
                        </p>
                        <a
                            href="mailto:support@alliance-biomedicale.com"
                            className="inline-block bg-teal-main hover:bg-teal-dark text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Contactez-nous
                        </a>
                    </div>
                </div>
            </Container>
        </div>
    );
}
