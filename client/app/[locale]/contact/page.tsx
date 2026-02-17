import { Container } from '@/components/ui/Container';
import ContactForm from './ContactForm';
import { getPublicSettings } from '@/lib/api';

interface ContactPageProps {
    params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { locale } = await params;

    // Fetch public settings
    const settings = await getPublicSettings();
    const siteEmail = settings.site_email || 'contact@alliance-biomedicale.com';
    const sitePhone = settings.site_phone || '+216 71 000 000';
    const siteAddress = settings.site_address || 'Alliance Biomédicale\n123 Rue de la Nature\n1000 Tunis, Tunisie';

    // Parse opening hours JSON
    let openingHours = {
        weekdays: '9:00 - 18:00',
        saturday: '9:00 - 13:00',
        sunday: 'Fermé'
    };
    try {
        if (settings.site_opening_hours) {
            openingHours = JSON.parse(settings.site_opening_hours);
        }
    } catch (e) {
        console.error('Failed to parse opening hours:', e);
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero - Premium Clean */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-20">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-display font-light text-teal-dark mb-5">
                            Contactez-nous
                        </h1>
                        <p className="text-lg text-gray-text font-body leading-relaxed">
                            Une question sur nos produits ou votre commande ? Nous sommes là pour vous aider.
                        </p>
                    </div>
                </Container>
            </section>

            <Container className="py-20">
                <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Contact Info - Elegant Cards */}
                    <div className="space-y-8">
                        {/* Address */}
                        <div className="bg-white border border-gray-light/50 p-8 rounded-luxury shadow-whisper hover:shadow-soft transition-all duration-400">
                            <h2 className="text-xl font-display font-semibold text-teal-dark mb-5 flex items-center gap-3">
                                <svg className="w-6 h-6 text-teal-main" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                Notre Adresse
                            </h2>
                            <p className="text-gray-text font-body leading-relaxed whitespace-pre-line">
                                {siteAddress}
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-white border border-gray-light/50 p-8 rounded-luxury shadow-whisper hover:shadow-soft transition-all duration-400">
                            <h2 className="text-xl font-display font-semibold text-teal-dark mb-5 flex items-center gap-3">
                                <svg className="w-6 h-6 text-teal-main" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                Coordonnées
                            </h2>
                            <div className="space-y-4">
                                <p className="text-gray-text font-body flex items-start gap-3">
                                    <span className="font-medium text-teal-dark min-w-[100px]">Téléphone:</span>
                                    <a href={`tel:${sitePhone.replace(/\s/g, '')}`} className="hover:text-teal-main transition-colors">
                                        {sitePhone}
                                    </a>
                                </p>
                                <p className="text-gray-text font-body flex items-start gap-3">
                                    <span className="font-medium text-teal-dark min-w-[100px]">Email:</span>
                                    <a href={`mailto:${siteEmail}`} className="hover:text-teal-main transition-colors">
                                        {siteEmail}
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-white border border-gray-light/50 p-8 rounded-luxury shadow-whisper hover:shadow-soft transition-all duration-400">
                            <h2 className="text-xl font-display font-semibold text-teal-dark mb-5 flex items-center gap-3">
                                <svg className="w-6 h-6 text-teal-main" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Horaires d'ouverture
                            </h2>
                            <ul className="space-y-3 text-gray-text font-body">
                                <li className="flex justify-between">
                                    <span>Lundi - Vendredi:</span>
                                    <span className="font-medium text-teal-dark">{openingHours.weekdays}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Samedi:</span>
                                    <span className="font-medium text-teal-dark">{openingHours.saturday}</span>
                                </li>
                                <li className="flex justify-between text-gray-medium">
                                    <span>Dimanche:</span>
                                    <span>{openingHours.sunday}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </Container>
        </div>
    );
}
