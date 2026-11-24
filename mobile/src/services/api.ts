import { Platform } from 'react-native';
import { getSupabase, isSupabaseConfigured } from '../services/supabase';
import type {
  MarketPrice,
  PriceForecast,
  Crop,
  Market,
  ProduceListing,
  BuyerInquiry,
  InquiryStatus,
  NotificationItem,
  VoiceQuery,
} from '../types';

const DELAY = (ms: number) => new Promise((r) => setTimeout(r, ms));

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

// In-memory demo state for inquiries, bookmarks, and notifications
let demoInquiries: (BuyerInquiry & { crop_name?: string; seller_name?: string; buyer_name?: string })[] = [
  {
    id: '1',
    listing_id: '1',
    buyer_id: 'buyer-demo',
    crop_name: 'Tomato',
    seller_name: 'Ravi Kumar',
    buyer_name: 'Suresh Traders',
    requested_quantity: 200,
    offered_price: 22,
    message: 'Can pick up tomorrow morning from your Chengalpattu farm.',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: '2',
    listing_id: '2',
    buyer_id: 'buyer-demo',
    crop_name: 'Onion',
    seller_name: 'Lakshmi Devi',
    buyer_name: 'Annapoorna Hotel',
    requested_quantity: 100,
    offered_price: 28,
    message: 'Interested in Grade A batch. Please confirm loading date.',
    status: 'accepted',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: '3',
    listing_id: '3',
    buyer_id: 'buyer-demo',
    crop_name: 'Paddy',
    seller_name: 'Arun Prakash',
    buyer_name: 'Cauvery Mills',
    requested_quantity: 10,
    offered_price: 2200,
    message: 'Quote for moisture under 14%.',
    status: 'rejected',
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
];

let demoNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'user-demo',
    title: 'Tomato Price Surge in Koyambedu',
    body: 'Tomato modal price reached ₹28/kg (+16%). Great time to compare nearby markets before selling.',
    type: 'price_alert',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'user-demo',
    title: 'New Buyer Inquiry Received',
    body: 'Suresh Traders submitted an offer of ₹22/kg for 200 kg of Tomato.',
    type: 'inquiry',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    user_id: 'user-demo',
    title: 'Agmarknet Market Report',
    body: 'Daily arrival volumes in Chengalpattu mandi updated. 420 quintals recorded.',
    type: 'market_update',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    user_id: 'user-demo',
    title: 'AI Price Forecast Alert',
    body: 'Onion prices projected to remain stable at ₹30/kg over next 7 days.',
    type: 'forecast',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

const savedListingIds = new Set<string>(['1']);

export const api = {
  // Crops
  async getCrops(): Promise<Crop[]> {
    await DELAY(150);
    return [
      { id: 'tomato', name: 'Tomato', category: 'Vegetables', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', local_names: {}, is_active: true },
      { id: 'onion', name: 'Onion', category: 'Vegetables', image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80', local_names: {}, is_active: true },
      { id: 'paddy', name: 'Paddy', category: 'Grains', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', local_names: {}, is_active: true },
      { id: 'groundnut', name: 'Groundnut', category: 'Oilseeds', image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=400&q=80', local_names: {}, is_active: true },
      { id: 'coconut', name: 'Coconut', category: 'Fruits', image_url: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=400&q=80', local_names: {}, is_active: true },
      { id: 'banana', name: 'Banana', category: 'Fruits', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80', local_names: {}, is_active: true },
      { id: 'potato', name: 'Potato', category: 'Vegetables', image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', local_names: {}, is_active: true },
    ];
  },

  // Markets
  async getMarkets(): Promise<Market[]> {
    await DELAY(150);
    return [
      { id: 'chengalpattu', name: 'Chengalpattu', state: 'Tamil Nadu', district: 'Chengalpattu', location: 'Chengalpattu, Tamil Nadu' },
      { id: 'koyambedu', name: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', location: 'Koyambedu, Chennai, Tamil Nadu' },
      { id: 'tiruvallur', name: 'Tiruvallur', state: 'Tamil Nadu', district: 'Tiruvallur', location: 'Tiruvallur, Tamil Nadu' },
    ];
  },

  // Market prices
  async getMarketPrices(cropId?: string, marketId?: string): Promise<MarketPrice[]> {
    await DELAY(200);
    const crops: Record<string, { name: string; modal: number; min: number; max: number }> = {
      tomato: { name: 'Tomato', modal: 24, min: 18, max: 32 },
      onion: { name: 'Onion', modal: 30, min: 22, max: 40 },
      paddy: { name: 'Paddy', modal: 2300, min: 2000, max: 2600 },
      groundnut: { name: 'Groundnut', modal: 5800, min: 5200, max: 6400 },
      coconut: { name: 'Coconut', modal: 28, min: 22, max: 36 },
      banana: { name: 'Banana', modal: 35, min: 28, max: 42 },
      potato: { name: 'Potato', modal: 20, min: 15, max: 28 },
    };
    const markets = await this.getMarkets();
    const prices: MarketPrice[] = [];
    const now = new Date().toISOString();
    for (const market of markets) {
      for (const [id, info] of Object.entries(crops)) {
        if (cropId && id !== cropId) continue;
        if (marketId && market.id !== marketId) continue;
        prices.push({
          id: `${id}-${market.id}`,
          crop_id: id,
          market_id: market.id,
          observation_date: now,
          min_price: info.min,
          max_price: info.max,
          modal_price: info.modal,
          source: 'AGMARKNET (Demo)',
          fetched_at: now,
          is_demo: true,
        });
      }
    }
    return prices;
  },

  // Forecasts
  async getForecast(cropId: string, marketId: string): Promise<PriceForecast | null> {
    await DELAY(200);
    return {
      id: `${cropId}-${marketId}-forecast`,
      crop_id: cropId,
      market_id: marketId,
      forecast_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      predicted_price: 26,
      lower_estimate: 22,
      upper_estimate: 30,
      model_version: 'moving-average-v1',
      generated_at: new Date().toISOString(),
    };
  },

  // Voice AI Query
  async voiceQuery(transcript: string, language: string = 'en'): Promise<{
    transcript: string;
    language: string;
    intent: string;
    response_text: string;
    data_retrieved?: any;
    is_demo: boolean;
  }> {
    try {
      const endpoints = [
        `${API_BASE_URL}/api/voice/query`,
        'http://localhost:8000/api/voice/query',
        'http://10.0.2.2:8000/api/voice/query',
      ];

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript, language }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            return await res.json();
          }
        } catch {
          // Try next endpoint
        }
      }
    } catch {
      // Fallback below
    }

    // High quality offline / fallback response generator
    await DELAY(400);
    const text = transcript.toLowerCase();
    let crop = 'Tomato';
    let basePrice = 24;

    if (text.includes('onion') || text.includes('வெங்காயம்') || text.includes('प्याज')) {
      crop = 'Onion';
      basePrice = 30;
    } else if (text.includes('paddy') || text.includes('நெல்') || text.includes('धान')) {
      crop = 'Paddy';
      basePrice = 23;
    } else if (text.includes('groundnut') || text.includes('வேர்க்கடலை')) {
      crop = 'Groundnut';
      basePrice = 58;
    } else if (text.includes('coconut') || text.includes('தேங்காய்')) {
      crop = 'Coconut';
      basePrice = 28;
    } else if (text.includes('banana') || text.includes('வாழைப்பழம்')) {
      crop = 'Banana';
      basePrice = 35;
    } else if (text.includes('potato') || text.includes('உருளைக்கிழங்கு')) {
      crop = 'Potato';
      basePrice = 20;
    }

    if (text.includes('compare') || text.includes('nearby') || text.includes('where to sell') || text.includes('ஒப்பீடு')) {
      return {
        transcript,
        language,
        intent: 'compare_markets',
        response_text: `For ${crop}, Koyambedu mandi currently offers the highest modal price of ₹${basePrice + 3}/kg, while Chengalpattu is ₹${basePrice}/kg. When factoring transport costs, Chengalpattu provides higher net returns for loads under 300 kg.`,
        data_retrieved: { crop, modal_price: basePrice },
        is_demo: true,
      };
    }

    if (text.includes('forecast') || text.includes('predict') || text.includes('next week') || text.includes('உயருமா')) {
      return {
        transcript,
        language,
        intent: 'forecast',
        response_text: `The 7-day price forecast for ${crop} is estimated at ₹${basePrice + 2}/kg, with an expected range of ₹${Math.round(basePrice * 0.9)} to ₹${Math.round(basePrice * 1.15)}/kg. This is an estimate based on recent arrivals.`,
        data_retrieved: { crop, modal_price: basePrice },
        is_demo: true,
      };
    }

    if (text.includes('net') || text.includes('earn') || text.includes('proceeds') || text.includes('கணக்கீடு')) {
      const net = basePrice * 500 - 200;
      return {
        transcript,
        language,
        intent: 'net_proceeds',
        response_text: `Selling 500 kg of ${crop} at ₹${basePrice}/kg yields approximately ₹${net.toLocaleString('en-IN')} in net proceeds after deducting ₹200 estimated transport expenses.`,
        data_retrieved: { crop, modal_price: basePrice },
        is_demo: true,
      };
    }

    return {
      transcript,
      language,
      intent: 'price_inquiry',
      response_text: `Today's modal price for ${crop} is ₹${basePrice}/kg in Chengalpattu (Min: ₹${Math.round(basePrice * 0.85)}, Max: ₹${Math.round(basePrice * 1.15)}/kg). Prices are up 4% compared to yesterday.`,
      data_retrieved: { crop, modal_price: basePrice },
      is_demo: true,
    };
  },

  // Inquiries
  async getInquiries(): Promise<(BuyerInquiry & { crop_name?: string; seller_name?: string; buyer_name?: string })[]> {
    await DELAY(200);
    return [...demoInquiries];
  },

  async getInquiryById(id: string) {
    await DELAY(150);
    return demoInquiries.find((inq) => inq.id === id) || null;
  },

  async createInquiry(data: {
    listing_id: string;
    buyer_id: string;
    crop_name?: string;
    seller_name?: string;
    requested_quantity: number;
    offered_price: number;
    message: string;
  }) {
    await DELAY(300);
    const newInq: BuyerInquiry & { crop_name?: string; seller_name?: string; buyer_name?: string } = {
      id: String(Date.now()),
      listing_id: data.listing_id,
      buyer_id: data.buyer_id,
      crop_name: data.crop_name || 'Tomato',
      seller_name: data.seller_name || 'Ravi Kumar',
      buyer_name: 'You (Buyer)',
      requested_quantity: data.requested_quantity,
      offered_price: data.offered_price,
      message: data.message,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    demoInquiries.unshift(newInq);
    return newInq;
  },

  async updateInquiryStatus(id: string, status: InquiryStatus) {
    await DELAY(200);
    const target = demoInquiries.find((inq) => inq.id === id);
    if (target) {
      target.status = status;
      return target;
    }
    return null;
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    await DELAY(200);
    return [...demoNotifications];
  },

  async markNotificationRead(id: string): Promise<void> {
    const notif = demoNotifications.find((n) => n.id === id);
    if (notif) notif.read_at = new Date().toISOString();
  },

  async markAllNotificationsRead(): Promise<void> {
    const now = new Date().toISOString();
    demoNotifications = demoNotifications.map((n) => ({ ...n, read_at: n.read_at || now }));
  },

  // Saved / Bookmarks
  getSavedListingIds(): string[] {
    return Array.from(savedListingIds);
  },

  toggleSavedListing(id: string): boolean {
    if (savedListingIds.has(id)) {
      savedListingIds.delete(id);
      return false;
    } else {
      savedListingIds.add(id);
      return true;
    }
  },

  isListingSaved(id: string): boolean {
    return savedListingIds.has(id);
  },
};

export { isSupabaseConfigured };
