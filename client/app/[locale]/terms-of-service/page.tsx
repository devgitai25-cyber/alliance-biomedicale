import { Container } from '@/components/ui/Container';

interface TermsOfServicePageProps {
    params: Promise<{ locale: string }>;
}

export default async function TermsOfServicePage({ params }: TermsOfServicePageProps) {
    const { locale } = await params;

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-20">
                <Container>
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-display font-light text-teal-dark mb-5">
                            Conditions Générales d'Utilisation
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Les règles d'utilisation de notre site et de nos services.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Content Section */}
            <Container className="py-12 pb-24">
                <div className="max-w-4xl mx-auto space-y-12 bg-white p-8 md:p-12 rounded-luxury border border-gray-light/50 shadow-soft">

                    {/* Introduction */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">1. Introduction</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Bienvenue sur Alliance Biomédicale. En accédant à ce site web, vous acceptez d'être lié par ces conditions générales d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect de toutes les lois locales applicables. Si vous n'êtes pas d'accord avec l'un de ces termes, il vous est interdit d'utiliser ou d'accéder à ce site.
                        </p>
                    </div>

                    {/* Licence d'utilisation */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">2. Licence d'utilisation</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Il est permis de télécharger temporairement une copie des documents (information ou logiciel) sur le site web d'Alliance Biomédicale pour une visualisation transitoire personnelle et non commerciale uniquement. Il s'agit de l'octroi d'une licence, et non d'un transfert de titre, et sous cette licence, vous ne pouvez pas :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-text font-body pl-4">
                            <li>Modifier ou copier les documents ;</li>
                            <li>Utiliser les documents à des fins commerciales ou pour toute exposition publique (commerciale ou non commerciale) ;</li>
                            <li>Tenter de décompiler ou de désosser tout logiciel contenu sur le site web d'Alliance Biomédicale ;</li>
                            <li>Supprimer tout droit d'auteur ou autre mention de propriété des documents ; ou</li>
                            <li>Transférer les documents à une autre personne ou "refléter" les documents sur n'importe quel autre serveur.</li>
                        </ul>
                        <p className="text-gray-text font-body leading-relaxed mt-2">
                            Cette licence prendra fin automatiquement si vous violez l'une de ces restrictions et peut être résiliée par Alliance Biomédicale à tout moment.
                        </p>
                    </div>

                    {/* Avis de non-responsabilité */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">3. Avis de non-responsabilité</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Les documents sur le site web d'Alliance Biomédicale sont fournis "tels quels". Alliance Biomédicale ne donne aucune garantie, expresse ou implicite, et rejette par la présente et nie toutes les autres garanties, y compris, sans limitation, les garanties implicites ou conditions de qualité marchande, d'adéquation à un usage particulier, ou de non-violation de la propriété intellectuelle ou autre violation des droits.
                        </p>
                    </div>

                    {/* Limitations */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">4. Limitations</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            En aucun cas, Alliance Biomédicale ou ses fournisseurs ne pourront être tenus responsables de tout dommage (y compris, sans limitation, les dommages pour perte de données ou de profit, ou en raison d'une interruption d'activité) découlant de l'utilisation ou de l'incapacité d'utiliser les documents sur le site Internet d'Alliance Biomédicale, même si Alliance Biomédicale ou un représentant autorisé d'Alliance Biomédicale a été informé oralement ou par écrit de la possibilité de tels dommages.
                        </p>
                    </div>

                    {/* Révisions et errata */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">5. Révisions et errata</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Les documents apparaissant sur le site web d'Alliance Biomédicale pourraient inclure des erreurs techniques, typographiques ou photographiques. Alliance Biomédicale ne garantit pas que les documents sur son site web sont exacts, complets ou à jour. Alliance Biomédicale peut apporter des modifications aux documents contenus sur son site web à tout moment sans préavis.
                        </p>
                    </div>

                    {/* Liens */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">6. Liens</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Alliance Biomédicale n'a pas examiné tous les sites liés à son site web et n'est pas responsable du contenu de ces sites liés. L'inclusion de tout lien n'implique pas l'approbation par Alliance Biomédicale du site. L'utilisation de tout site web lié est aux risques et périls de l'utilisateur.
                        </p>
                    </div>

                    {/* Modifications des conditions d'utilisation */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">7. Modifications des conditions d'utilisation</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Alliance Biomédicale peut réviser ces conditions d'utilisation de son site web à tout moment et sans préavis. En utilisant ce site web, vous acceptez d'être lié par la version actuelle de ces conditions générales d'utilisation.
                        </p>
                    </div>

                    {/* Loi applicable */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">8. Loi applicable</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Toute réclamation relative au site web d'Alliance Biomédicale sera régie par les lois de la Tunisie sans égard à ses dispositions en matière de conflit de lois.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4 border-t border-gray-light pt-8 mt-8">
                        <p className="text-gray-text font-body text-sm text-center">
                            Pour toute question concernant ces conditions générales, veuillez nous contacter à l'adresse support@alliance-biomedicale.com
                        </p>
                    </div>

                </div>
            </Container>
        </div>
    );
}
