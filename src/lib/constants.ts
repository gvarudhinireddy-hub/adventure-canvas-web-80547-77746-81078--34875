// App Configuration
export const APP_CONFIG = {
  name: 'WanderNest',
  tagline: 'Discover Your Next Adventure',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
} as const;

// Exchange Rate API Configuration
export const EXCHANGE_RATE_CONFIG = {
  baseUrl: 'https://api.exchangerate-api.com/v4/latest/USD',
  updateInterval: 3600000, // 1 hour in milliseconds
  fallbackRates: {
    USD: 1,
    INR: 83,
    GBP: 0.79,
    EUR: 0.92,
    JPY: 149,
    AUD: 1.52,
    CAD: 1.36,
    CNY: 7.24,
    AED: 3.67,
    SGD: 1.34,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  country: 'wandernest_country',
  theme: 'wandernest_theme',
  userPreferences: 'wandernest_user_preferences',
  language: 'wandernest_language',
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Default Pagination
export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
} as const;

// Validation Rules
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  minPasswordLength: 8,
} as const;
