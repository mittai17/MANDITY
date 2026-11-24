import { getSupabase, isSupabaseConfigured } from '../services/supabase';
import type { MarketPrice, PriceForecast, Crop, Market, ProduceListing } from '../types';

const DELAY = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  // Crops
  async getCrops(): Promise<Crop[]> {
    await DELAY(300);
    return [
      { id: 'tomato', name: 'Tomato', category: 'Vegetables', image_url: '', local_names: {}, is_active: true },
      { id: 'onion', name: 'Onion', category: 'Vegetables', image_url: '', local_names: {}, is_active: true },
      { id: 'paddy', name: 'Paddy', category: 'Grains', image_url: '', local_names: {}, is_active: true },
      { id: 'groundnut', name: 'Groundnut', category: 'Oilseeds', image_url: '', local_names: {}, is_active: true },
      { id: 'coconut', name: 'Coconut', category: 'Fruits', image_url: '', local_names: {}, is_active: true },
      { id: 'banana', name: 'Banana', category: 'Fruits', image_url: '', local_names: {}, is_active: true },
      { id: 'potato', name: 'Potato', category: 'Vegetables', image_url: '', local_names: {}, is_active: true },
    ];
  },

  // Markets
  async getMarkets(): Promise<Market[]> {
    await DELAY(300);
    return [
      { id: 'chengalpattu', name: 'Chengalpattu', state: 'Tamil Nadu', district: 'Chengalpattu', location: 'Chengalpattu, Tamil Nadu' },
      { id: 'koyambedu', name: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', location: 'Koyambedu, Chennai, Tamil Nadu' },
      { id: 'tiruvallur', name: 'Tiruvallur', state: 'Tamil Nadu', district: 'Tiruvallur', location: 'Tiruvallur, Tamil Nadu' },
    ];
  },

  // Market prices
  async getMarketPrices(cropId?: string, marketId?: string): Promise<MarketPrice[]> {
    await DELAY(400);
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
    await DELAY(300);
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
};

export { isSupabaseConfigured };
