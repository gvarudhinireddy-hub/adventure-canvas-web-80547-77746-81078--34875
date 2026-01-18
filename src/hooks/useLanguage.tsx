import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

// UI translations for core elements
export const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    destinations: 'Destinations',
    planTrip: 'Plan Trip',
    myTrips: 'My Trips',
    search: 'Search',
    searchPlaceholder: 'Where do you want to go?',
    startPlanning: 'Start Planning',
    browseDestinations: 'Browse Destinations',
    viewDetails: 'View Details',
    saveToWishlist: 'Save to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    share: 'Share',
    newsletter: 'Newsletter',
    subscribeNewsletter: 'Subscribe to Newsletter',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    currency: 'Currency',
    language: 'Language',
    settings: 'Settings',
    about: 'About',
    contact: 'Contact',
    heroTitle: 'Discover Your Next',
    heroTitleAccent: 'Adventure',
    heroSubtitle: 'Curated travel experiences that connect you with the world\'s most incredible destinations',
    whyChooseUs: 'Why Choose WanderNest?',
    featuredDestinations: 'Featured Destinations',
    testimonials: 'What Our Travelers Say',
    ctaTitle: 'Your Adventure Awaits',
    stayInspired: 'Stay Inspired',
    takeQuiz: 'Take Quiz',
    wishlist: 'Wishlist',
    achievements: 'Achievements',
  },
  es: {
    home: 'Inicio',
    destinations: 'Destinos',
    planTrip: 'Planear Viaje',
    myTrips: 'Mis Viajes',
    search: 'Buscar',
    searchPlaceholder: '¿A dónde quieres ir?',
    startPlanning: 'Comenzar a Planear',
    browseDestinations: 'Explorar Destinos',
    viewDetails: 'Ver Detalles',
    saveToWishlist: 'Guardar en Favoritos',
    removeFromWishlist: 'Quitar de Favoritos',
    share: 'Compartir',
    newsletter: 'Boletín',
    subscribeNewsletter: 'Suscribirse al Boletín',
    emailPlaceholder: 'Ingresa tu correo',
    subscribe: 'Suscribirse',
    currency: 'Moneda',
    language: 'Idioma',
    settings: 'Configuración',
    about: 'Acerca de',
    contact: 'Contacto',
    heroTitle: 'Descubre Tu Próxima',
    heroTitleAccent: 'Aventura',
    heroSubtitle: 'Experiencias de viaje seleccionadas que te conectan con los destinos más increíbles del mundo',
    whyChooseUs: '¿Por qué elegir WanderNest?',
    featuredDestinations: 'Destinos Destacados',
    testimonials: 'Lo que dicen nuestros viajeros',
    ctaTitle: 'Tu Aventura Te Espera',
    stayInspired: 'Mantente Inspirado',
    takeQuiz: 'Hacer Quiz',
    wishlist: 'Favoritos',
    achievements: 'Logros',
  },
  fr: {
    home: 'Accueil',
    destinations: 'Destinations',
    planTrip: 'Planifier Voyage',
    myTrips: 'Mes Voyages',
    search: 'Rechercher',
    searchPlaceholder: 'Où voulez-vous aller?',
    startPlanning: 'Commencer à Planifier',
    browseDestinations: 'Parcourir les Destinations',
    viewDetails: 'Voir Détails',
    saveToWishlist: 'Ajouter aux Favoris',
    removeFromWishlist: 'Retirer des Favoris',
    share: 'Partager',
    newsletter: 'Newsletter',
    subscribeNewsletter: 'S\'abonner à la Newsletter',
    emailPlaceholder: 'Entrez votre email',
    subscribe: 'S\'abonner',
    currency: 'Devise',
    language: 'Langue',
    settings: 'Paramètres',
    about: 'À propos',
    contact: 'Contact',
    heroTitle: 'Découvrez Votre Prochaine',
    heroTitleAccent: 'Aventure',
    heroSubtitle: 'Des expériences de voyage organisées qui vous connectent aux destinations les plus incroyables du monde',
    whyChooseUs: 'Pourquoi choisir WanderNest?',
    featuredDestinations: 'Destinations Vedettes',
    testimonials: 'Ce que disent nos voyageurs',
    ctaTitle: 'Votre Aventure Vous Attend',
    stayInspired: 'Restez Inspiré',
    takeQuiz: 'Faire le Quiz',
    wishlist: 'Favoris',
    achievements: 'Réalisations',
  },
  hi: {
    home: 'होम',
    destinations: 'गंतव्य',
    planTrip: 'यात्रा की योजना',
    myTrips: 'मेरी यात्राएं',
    search: 'खोजें',
    searchPlaceholder: 'आप कहाँ जाना चाहते हैं?',
    startPlanning: 'योजना शुरू करें',
    browseDestinations: 'गंतव्य देखें',
    viewDetails: 'विवरण देखें',
    saveToWishlist: 'इच्छा सूची में जोड़ें',
    removeFromWishlist: 'इच्छा सूची से हटाएं',
    share: 'साझा करें',
    newsletter: 'न्यूज़लेटर',
    subscribeNewsletter: 'न्यूज़लेटर की सदस्यता लें',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    subscribe: 'सदस्यता लें',
    currency: 'मुद्रा',
    language: 'भाषा',
    settings: 'सेटिंग्स',
    about: 'हमारे बारे में',
    contact: 'संपर्क',
    heroTitle: 'अपना अगला खोजें',
    heroTitleAccent: 'साहसिक',
    heroSubtitle: 'क्यूरेटेड यात्रा अनुभव जो आपको दुनिया के सबसे अविश्वसनीय गंतव्यों से जोड़ते हैं',
    whyChooseUs: 'WanderNest क्यों चुनें?',
    featuredDestinations: 'विशेष गंतव्य',
    testimonials: 'हमारे यात्री क्या कहते हैं',
    ctaTitle: 'आपका साहसिक इंतजार कर रहा है',
    stayInspired: 'प्रेरित रहें',
    takeQuiz: 'क्विज़ लें',
    wishlist: 'इच्छा सूची',
    achievements: 'उपलब्धियां',
  },
};

// Fallback to English for missing translations
const getTranslation = (langCode: string, key: string): string => {
  return translations[langCode]?.[key] || translations['en']?.[key] || key;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.language || 'wandernest_language');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return languages[0];
      }
    }
    return languages[0];
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.language || 'wandernest_language', JSON.stringify(lang));
  };

  const t = (key: string): string => {
    return getTranslation(language.code, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
