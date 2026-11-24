export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
] as const;

export const ROLES = ['farmer', 'buyer'] as const;

export const UNITS = ['kg', 'quintal', 'tonne'] as const;

export const CROP_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Oilseeds',
  'Spices',
  'Other',
] as const;

export const INQUIRY_STATUSES = [
  'pending',
  'accepted',
  'rejected',
  'negotiating',
  'completed',
  'cancelled',
] as const;

export const NAV_TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'prices', label: 'Prices', icon: 'bar-chart-2' },
  { key: 'marketplace', label: 'Marketplace', icon: 'shopping-bag' },
  { key: 'ai', label: 'AI Assistant', icon: 'mic' },
  { key: 'profile', label: 'Profile', icon: 'user' },
] as const;

export const POPULAR_CROPS = [
  { id: 'tomato', name: 'Tomato', category: 'Vegetables' },
  { id: 'onion', name: 'Onion', category: 'Vegetables' },
  { id: 'paddy', name: 'Paddy', category: 'Grains' },
  { id: 'groundnut', name: 'Groundnut', category: 'Oilseeds' },
  { id: 'coconut', name: 'Coconut', category: 'Fruits' },
  { id: 'banana', name: 'Banana', category: 'Fruits' },
  { id: 'potato', name: 'Potato', category: 'Vegetables' },
] as const;

export const DEMO_MARKETS = [
  { id: 'chengalpattu', name: 'Chengalpattu', district: 'Chengalpattu', state: 'Tamil Nadu' },
  { id: 'koyambedu', name: 'Koyambedu', district: 'Chennai', state: 'Tamil Nadu' },
  { id: 'tiruvallur', name: 'Tiruvallur', district: 'Tiruvallur', state: 'Tamil Nadu' },
] as const;

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
