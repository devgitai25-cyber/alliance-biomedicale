'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { getAllSettings, updateSetting } from '@/lib/api';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'shipping'>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const [settings, setSettings] = useState({
        siteName: '',
        siteEmail: '',
        sitePhone: '',
        siteAddress: '',
        siteOpeningHours: '',
        currency: 'TND',
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
                        site_opening_hours: 'siteOpeningHours',
                        shipping_cost: 'shippingCost',
                        free_shipping_threshold: 'freeShippingThreshold',
                    };
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
            const keyMap: Record<string, string> = {
                siteName: 'site_name',
                siteEmail: 'site_email',
                sitePhone: 'site_phone',
                siteAddress: 'site_address',
                siteOpeningHours: 'site_opening_hours',
                shippingCost: 'shipping_cost',
                freeShippingThreshold: 'free_shipping_threshold',
            };

            const promises = Object.entries(settings).map(([key, value]) => {
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
                                Horaires d'ouverture (JSON)
                            </label>
                            <textarea
                                name="siteOpeningHours"
                                value={settings.siteOpeningHours}
                                onChange={(e) => setSettings(prev => ({ ...prev, siteOpeningHours: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                                placeholder='{"weekdays":"9:00 - 18:00","saturday":"9:00 - 13:00","sunday":"Fermé"}'
                            />
                            <p className="text-xs text-gray-500 mt-1">Format JSON avec clés: weekdays, saturday, sunday</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Devise
                            </label>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="TND">Dinar Tunisien (TND)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="USD">Dollar Américain (USD)</option>
                            </select>
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


            {/* Save Button */}
            <div className="mt-6">
                <Button onClick={handleSave} isLoading={isSaving}>
                    Enregistrer les paramètres
                </Button>
            </div>
        </div>
    );
}
