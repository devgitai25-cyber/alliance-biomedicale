import { useState, useEffect } from 'react';
import { getPublicSettings } from '@/lib/api';

export interface Settings {
    siteName: string;
    siteEmail: string;
    sitePhone: string;
    currency: string;
    shippingCost: number;
    freeShippingThreshold: number;
}

export function useSettings() {
    const [settings, setSettings] = useState<Settings>({
        siteName: 'Alliance Biomédicale',
        siteEmail: 'contact@alliance-bio.tn',
        sitePhone: '+216 71 123 456',
        currency: 'TND',
        shippingCost: 7,
        freeShippingThreshold: 100,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getPublicSettings();
                setSettings({
                    siteName: data.site_name || 'Alliance Biomédicale',
                    siteEmail: data.site_email || 'contact@alliance-bio.tn',
                    sitePhone: data.site_phone || '+216 71 123 456',
                    currency: data.currency || 'TND',
                    // Ensure numbers are numbers
                    shippingCost: data.shipping_cost !== undefined ? Number(data.shipping_cost) : 7,
                    freeShippingThreshold: data.free_shipping_threshold !== undefined ? Number(data.free_shipping_threshold) : 100,
                });
            } catch (error) {
                console.error("Failed to load settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return { settings, loading };
}
