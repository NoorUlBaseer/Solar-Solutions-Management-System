export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const APP_CONFIG = {
  appName: 'FreeFuel Solar Solutions',
  apiTimeout: 15000,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  defaultCurrency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'hh:mm A',
};