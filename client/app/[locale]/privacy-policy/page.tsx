import { Container } from '@/components/ui/Container';

interface PrivacyPolicyPageProps {
    params: Promise<{ locale: string }>;
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
    const { locale } = await params;

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-20">
                <Container>
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-display font-light text-teal-dark mb-5">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Votre confiance est notre priorité. Découvrez comment nous protégeons vos données personnelles.
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
                            Chez Alliance Biomédicale, nous accordons une importance capitale à la confidentialité de vos informations. Cette politique explique comment nous recueillons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site web et nos services.
                        </p>
                    </div>

                    {/* Collecte de l'information */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">2. Collecte de l'information</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Nous recueillons des informations lorsque vous vous inscrivez sur notre site, vous connectez à votre compte, effectuez un achat, participez à un concours et/ou lorsque vous vous déconnectez. Les informations recueillies incluent votre nom, votre adresse e-mail, votre numéro de téléphone et/ou vos informations de carte de crédit.
                        </p>
                        <p className="text-gray-text font-body leading-relaxed">
                            En outre, nous recevons et enregistrons automatiquement des informations à partir de votre ordinateur et navigateur, y compris votre adresse IP, vos logiciels et votre matériel, et la page que vous demandez.
                        </p>
                    </div>

                    {/* Utilisation de l'information */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">3. Utilisation des informations</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Toute les informations que nous recueillons auprès de vous peuvent être utilisées pour :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-text font-body pl-4">
                            <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                            <li>Fournir un contenu publicitaire personnalisé</li>
                            <li>Améliorer notre site web</li>
                            <li>Améliorer le service client et vos besoins de prise en charge</li>
                            <li>Vous contacter par e-mail</li>
                            <li>Administrer un concours, une promotion, ou une enquête</li>
                        </ul>
                    </div>

                    {/* Confidentialité du commerce en ligne */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">4. Confidentialité du commerce en ligne</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quelle raison, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et / ou une transaction, comme par exemple pour expédier une commande.
                        </p>
                    </div>

                    {/* Divulgation à des tiers */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">5. Divulgation à des tiers</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site Web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.
                        </p>
                        <p className="text-gray-text font-body leading-relaxed">
                            Nous pensons qu'il est nécessaire de partager des informations afin d'enquêter, de prévenir ou de prendre des mesures concernant des activités illégales, fraudes présumées, situations impliquant des menaces potentielles à la sécurité physique de toute personne, violations de nos conditions d'utilisation, ou quand la loi nous y contraint.
                        </p>
                    </div>

                    {/* Protection des informations */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">6. Protection des informations</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne. Nous protégeons également vos informations hors ligne. Seuls les employés qui ont besoin d'effectuer un travail spécifique (par exemple, la facturation ou le service client) ont accès aux informations personnelles identifiables.
                        </p>
                    </div>

                    {/* Cookies */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">7. Est-ce que nous utilisons des cookies ?</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            Oui. Nos cookies améliorent l'accès à notre site et identifient les visiteurs réguliers. En outre, nos cookies améliorent l'expérience d'utilisateur grâce au suivi et au ciblage de ses intérêts. Cependant, cette utilisation des cookies n'est en aucune façon liée à des informations personnelles identifiables sur notre site.
                        </p>
                    </div>

                    {/* Consentement */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-display font-medium text-teal-dark">8. Consentement</h2>
                        <p className="text-gray-text font-body leading-relaxed">
                            En utilisant notre site, vous consentez à notre politique de confidentialité.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4 border-t border-gray-light pt-8 mt-8">
                        <p className="text-gray-text font-body text-sm text-center">
                            Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à l'adresse support@alliance-biomedicale.com
                        </p>
                    </div>

                </div>
            </Container>
        </div>
    );
}
