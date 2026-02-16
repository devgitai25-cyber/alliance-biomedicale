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
                setError(error.message || 'Failed to load settings');
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
            setSuccess('Settings saved successfully!');
        } catch (error: any) {
            console.error('Failed to save settings', error);
            setError(error.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

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
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab('shipping')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Shipping
                    </button>

                </nav>
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Site Name
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
                                Contact Email
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
                                Phone Number
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
                                Currency
                            </label>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="TND">Tunisian Dinar (TND)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="USD">US Dollar (USD)</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
                <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Shipping Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shipping Cost (TND)
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
                            <p className="text-xs text-gray-500 mt-1">Standard shipping fee charged to customers</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Free Shipping Threshold (TND)
                            </label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={settings.freeShippingThreshold}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
                        </div>
                    </div>
                </div>
            )}


            {/* Save Button */}
            <div className="mt-6">
                <Button onClick={handleSave} isLoading={isSaving}>
                    Save Settings
                </Button>
            </div>
        </div>
    );
}
