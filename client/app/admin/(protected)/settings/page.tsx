'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { getAllSettings, updateSetting } from '@/lib/api';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'hours'>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const [settings, setSettings] = useState({
        siteName: '',
        siteEmail: '',
        sitePhone: '',
        siteAddress: '',
        hoursWeekdays: '',
        hoursSaturday: '',
        hoursSunday: '',
        shippingCost: 0,
        freeShippingThreshold: 0,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setError('');
                const data = await getAllSettings();
                // data is array of { key, value, ... }
                const newSettings = { ...settings };
                let hasChanges = false;

                data.forEach(s => {
                    const keyMap: Record<string, string> = {
                        site_name: 'siteName',
                        site_email: 'siteEmail',
                        site_phone: 'sitePhone',
                        site_address: 'siteAddress',
                        shipping_cost: 'shippingCost',
                        free_shipping_threshold: 'freeShippingThreshold',
                    };

                    // Handle opening hours JSON parsing
                    if (s.key === 'site_opening_hours' && s.value) {
                        try {
                            const hours = JSON.parse(s.value);
                            newSettings.hoursWeekdays = hours.weekdays || '';
                            newSettings.hoursSaturday = hours.saturday || '';
                            newSettings.hoursSunday = hours.sunday || '';
                            hasChanges = true;
                            return;
                        } catch (e) {
                            console.error('Failed to parse opening hours:', e);
                        }
                    }
                    const stateKey = keyMap[s.key];
                    // @ts-ignore
                    if (stateKey && newSettings[stateKey] !== undefined) {
                        // @ts-ignore
                        newSettings[stateKey] = s.value;
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    setSettings(newSettings);
                }
            } catch (error: any) {
                console.error("Failed to load settings", error);
                setError(error.message || 'Échec du chargement des paramètres');
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: name.includes('Cost') || name.includes('Threshold') ? parseFloat(value) || 0 : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');
        try {
            // Convert separate hour fields back to JSON
            const openingHoursJSON = JSON.stringify({
                weekdays: settings.hoursWeekdays,
                saturday: settings.hoursSaturday,
                sunday: settings.hoursSunday
            });

            const settingsToSave = {
                siteName: settings.siteName,
                siteEmail: settings.siteEmail,
                sitePhone: settings.sitePhone,
                siteAddress: settings.siteAddress,
                siteOpeningHours: openingHoursJSON,
                shippingCost: settings.shippingCost,
                freeShippingThreshold: settings.freeShippingThreshold,
            };

            const keyMap: Record<string, string> = {
                siteName: 'site_name',
                siteEmail: 'site_email',
                sitePhone: 'site_phone',
                siteAddress: 'site_address',
                siteOpeningHours: 'site_opening_hours',
                shippingCost: 'shipping_cost',
                freeShippingThreshold: 'free_shipping_threshold',
            };

            const promises = Object.entries(settingsToSave).map(([key, value]) => {
                const backendKey = keyMap[key];
                if (backendKey) {
                    return updateSetting(backendKey, value);
                }
                return Promise.resolve();
            });

            await Promise.all(promises);
            setSuccess('Paramètres enregistrés avec succès !');
        } catch (error: any) {
            console.error('Failed to save settings', error);
            setError(error.message || 'Échec de l\'enregistrement des paramètres');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Paramètres</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-600">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-600">
                    <p className="font-medium">{success}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Général
                    </button>
                    <button
                        onClick={() => setActiveTab('shipping')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Livraison
                    </button>
                    <button
                        onClick={() => setActiveTab('hours')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'hours'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Horaires
                    </button>

                </nav>
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Paramètres Généraux</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du site
                            </label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email de contact
                            </label>
                            <input
                                type="email"
                                name="siteEmail"
                                value={settings.siteEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Numéro de téléphone
                            </label>
                            <input
                                type="tel"
                                name="sitePhone"
                                value={settings.sitePhone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse complète
                            </label>
                            <textarea
                                name="siteAddress"
                                value={settings.siteAddress}
                                onChange={(e) => setSettings(prev => ({ ...prev, siteAddress: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Nom de l'entreprise&#10;Rue&#10;Code postal Ville, Pays"
                            />
                            <p className="text-xs text-gray-500 mt-1">Format: une ligne par élément d'adresse</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Devise
                            </label>
                            <input
                                type="text"
                                value="Dinar Tunisien (TND)"
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">La devise ne peut pas être modifiée</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
                <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Paramètres de Livraison</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Frais de livraison (TND)
                            </label>
                            <input
                                type="number"
                                name="shippingCost"
                                value={settings.shippingCost}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Frais de livraison standard facturés aux clients</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Seuil de livraison gratuite (TND)
                            </label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={settings.freeShippingThreshold}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Les commandes supérieures à ce montant bénéficient de la livraison gratuite</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Hours Settings */}
            {activeTab === 'hours' && (
                <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Horaires d'ouverture</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lundi - Vendredi
                            </label>
                            <input
                                type="text"
                                name="hoursWeekdays"
                                value={settings.hoursWeekdays}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="9:00 - 18:00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Samedi
                            </label>
                            <input
                                type="text"
                                name="hoursSaturday"
                                value={settings.hoursSaturday}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="9:00 - 13:00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dimanche
                            </label>
                            <input
                                type="text"
                                name="hoursSunday"
                                value={settings.hoursSunday}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Fermé"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="mt-6">
                <Button onClick={handleSave} isLoading={isSaving}>
                    Enregistrer les paramètres
                </Button>
            </div>
        </div>
    );
}
