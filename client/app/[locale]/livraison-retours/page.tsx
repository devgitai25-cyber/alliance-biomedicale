import { Container } from '@/components/ui/Container';
import { getPublicSettings } from '@/lib/api';

interface DeliveryReturnsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function DeliveryReturnsPage({ params }: DeliveryReturnsPageProps) {
    const { locale } = await params;
    const settings = await getPublicSettings();
    const siteEmail = settings.site_email || 'contact@alliance-bio.tn';

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-20">
                <Container>
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-display font-light text-teal-dark mb-5">
                            Livraison & Retours
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Informations complètes sur nos modes de livraison et notre politique de retour pour une expérience d'achat sereine.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Content Section */}
            <Container className="py-12 pb-24">
                <div className="max-w-4xl mx-auto space-y-12 bg-white p-8 md:p-12 rounded-luxury border border-gray-light/50 shadow-soft">

                    {/* Livraison */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-display font-medium text-teal-dark flex items-center gap-3">
                            <svg className="w-6 h-6 text-teal-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            Expédition et Livraison
                        </h2>

                        <div className="space-y-4 text-gray-text font-body leading-relaxed">
                            <p>
                                Alliance Biomédicale s'engage à expédier vos commandes dans les plus brefs délais. Toutes les commandes passées avant 12h00 sont généralement traitées le jour même.
                            </p>

                            <h3 className="font-semibold text-teal-dark mt-4">Zones de livraison</h3>
                            <p>
                                Nous livrons partout en Tunisie. Notre partenaire logistique assure une couverture complète du territoire national.
                            </p>

                            <h3 className="font-semibold text-teal-dark mt-4">Délais de livraison</h3>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li><strong>Grand Tunis :</strong> 24 à 48 heures ouvrables</li>
                                <li><strong>Autres régions :</strong> 48 à 72 heures ouvrables</li>
                            </ul>

                            <h3 className="font-semibold text-teal-dark mt-4">Frais de livraison</h3>
                            <p>
                                La livraison est <strong>gratuite</strong> pour toute commande supérieure à 150 DT. Pour les commandes inférieures à ce montant, des frais de livraison fixes de 7 DT sont appliqués.
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-light/50"></div>

                    {/* Retours */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-display font-medium text-teal-dark flex items-center gap-3">
                            <svg className="w-6 h-6 text-teal-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Politique de Retours
                        </h2>

                        <div className="space-y-4 text-gray-text font-body leading-relaxed">
                            <p>
                                Votre satisfaction est notre priorité. Si vous n'êtes pas entièrement satisfait de votre achat, nous acceptons les retours sous certaines conditions.
                            </p>

                            <h3 className="font-semibold text-teal-dark mt-4">Conditions de retour</h3>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Vous disposez d'un délai de <strong>14 jours</strong> après réception de votre commande pour effectuer un retour.</li>
                                <li>Les produits doivent être retournés dans leur état d'origine, non ouverts, non utilisés et dans leur emballage d'origine intact.</li>
                                <li>Pour des raisons d'hygiène, les produits cosmétiques ouverts ne peuvent pas être retournés.</li>
                            </ul>

                            <h3 className="font-semibold text-teal-dark mt-4">Comment effectuer un retour ?</h3>
                            <ol className="list-decimal list-inside space-y-2 pl-4">
                                <li>Contactez notre service client à <a href={`mailto:${siteEmail}`} className="text-teal-main hover:underline">{siteEmail}</a> ou par téléphone pour signaler votre demande de retour.</li>
                                <li>Préparez votre colis en assurant que les produits sont bien protégés.</li>
                                <li>Envoyez le colis à l'adresse qui vous sera communiquée par notre service client.</li>
                            </ol>

                            <h3 className="font-semibold text-teal-dark mt-4">Remboursement</h3>
                            <p>
                                Une fois le retour reçu et inspecté, nous vous informerons si votre remboursement est approuvé. Si c'est le cas, le remboursement sera traité et un crédit sera automatiquement appliqué à votre carte de crédit ou méthode de paiement originale, dans un délai de 5 à 10 jours ouvrables.
                            </p>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
}
