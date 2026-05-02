import { useEffect, useState } from 'react';
import { i18n, type Language } from '@/lib/i18n';

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getCurrentLanguage());
  const [isLoaded, setIsLoaded] = useState(i18n.isLoaded());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((language) => {
      setCurrentLanguage(language);
      setIsLoaded(i18n.isLoaded());
    });

    // Check if translations are loaded
    if (!isLoaded) {
      i18n.loadTranslations().then(() => {
        setIsLoaded(true);
      });
    }

    return unsubscribe;
  }, [isLoaded]);

  return {
    t: i18n.t.bind(i18n),
    format: i18n.format.bind(i18n),
    plural: i18n.plural.bind(i18n),
    currentLanguage,
    setLanguage: i18n.setLanguage.bind(i18n),
    availableLanguages: i18n.getAvailableLanguages(),
    currentLanguageConfig: i18n.getCurrentLanguageConfig(),
    isLoaded
  };
}