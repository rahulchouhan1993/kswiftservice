import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { MdLanguage } from 'react-icons/md';

export default function LanguageSwitcher({ className = '', selectClassName = '', iconClassName = '' }) {
    const { t, i18n } = useTranslation();
    const { locale } = usePage().props;

    // Sync Inertia shared locale with i18next
    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale, i18n]);

    const handleLanguageChange = (e) => {
        const newLocale = e.target.value;
        i18n.changeLanguage(newLocale);
        
        // Update backend session via Inertia request
        router.post(route('language', { locale: newLocale }), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: window.location.reload() if deep refresh needed, 
                // but inertia reload + i18n change should be enough
            }
        });
    };

    return (
        <div className={`flex items-center ${className}`}>
            <MdLanguage className={`text-gray-500 mr-2 w-5 h-5 ${iconClassName}`} />
            <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className={` border-0 rounded-md shadow-sm text-sm py-1 pl-2 pr-8 ${selectClassName}`}
            >
                <option value="en">English</option>
                <option value="kn">Kannada</option>
                <option value="hi">Hindi</option>
            </select>
        </div>
    );
}
