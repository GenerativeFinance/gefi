// Internationalization service for GeFi platform
export type Language = 'en' | 'es';

export interface Translations {
  [key: string]: string | Translations;
}

export interface LanguageConfig {
  code: Language;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    direction: 'ltr'
  }
];

class I18nService {
  private translations: Record<Language, Translations> = {};
  private currentLanguage: Language = 'en';
  private listeners: ((language: Language) => void)[] = [];

  constructor() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('gefi_language') as Language;
    if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
    
    // Load translations
    this.loadTranslations();
  }

  async loadTranslations() {
    try {
      // Load English translations
      const enModule = await import('../locales/en.json');
      this.translations.en = enModule.default;

      // Load Spanish translations
      const esModule = await import('../locales/es.json');
      this.translations.es = esModule.default;

      // Notify listeners that translations are loaded
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English if translations fail to load
      this.translations.en = {};
      this.translations.es = {};
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language) {
    if (SUPPORTED_LANGUAGES.find(lang => lang.code === language)) {
      this.currentLanguage = language;
      localStorage.setItem('gefi_language', language);
      
      // Update document language attribute
      document.documentElement.lang = language;
      
      this.notifyListeners();
    }
  }

  translate(key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = this.translations.en;
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            value = fallback || key;
            break;
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : fallback || key;
  }

  // Shorthand for translate
  t(key: string, fallback?: string): string {
    return this.translate(key, fallback);
  }

  // Format string with variables
  format(key: string, variables: Record<string, string | number> = {}, fallback?: string): string {
    let text = this.translate(key, fallback);
    
    Object.entries(variables).forEach(([varKey, varValue]) => {
      text = text.replace(new RegExp(`{{\\s*${varKey}\\s*}}`, 'g'), String(varValue));
    });

    return text;
  }

  // Subscribe to language changes
  subscribe(callback: (language: Language) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  // Get current language config
  getCurrentLanguageConfig(): LanguageConfig {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === this.currentLanguage) || SUPPORTED_LANGUAGES[0];
  }

  // Get available languages
  getAvailableLanguages(): LanguageConfig[] {
    return SUPPORTED_LANGUAGES;
  }

  // Check if translations are loaded
  isLoaded(): boolean {
    return Object.keys(this.translations).length > 0;
  }

  // Get all translations for current language (useful for debugging)
  getAllTranslations(): Translations {
    return this.translations[this.currentLanguage] || {};
  }

  // Pluralization helper
  plural(key: string, count: number, variables: Record<string, string | number> = {}): string {
    const pluralKey = count === 1 ? `${key}.singular` : `${key}.plural`;
    return this.format(pluralKey, { ...variables, count }, this.translate(key));
  }
}

export const i18n = new I18nService();