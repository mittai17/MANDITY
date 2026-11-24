export type LanguageCode = 'en' | 'ta' | 'te' | 'hi' | 'kn' | 'ml';
export type UserRole = 'farmer' | 'buyer';
export type Unit = 'kg' | 'quintal' | 'tonne';
export type InquiryStatus = 'pending' | 'accepted' | 'rejected' | 'negotiating' | 'completed' | 'cancelled';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  role: UserRole;
  preferred_language: LanguageCode;
  district?: string;
  village?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Crop {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  local_names?: Partial<Record<LanguageCode, string>>;
  is_active: boolean;
}

export interface Market {
  id: string;
  name: string;
  state: string;
  district: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface MarketPrice {
  id: string;
  crop_id: string;
  market_id: string;
  observation_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  source: string;
  fetched_at: string;
  is_demo?: boolean;
}

export interface PriceForecast {
  id: string;
  crop_id: string;
  market_id: string;
  forecast_date: string;
  predicted_price: number;
  lower_estimate: number;
  upper_estimate: number;
  model_version: string;
  generated_at: string;
}

export interface ProduceListing {
  id: string;
  farmer_id: string;
  crop_id: string;
  title: string;
  description: string;
  quantity: number;
  unit: Unit;
  asking_price: number;
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
}

export interface BuyerInquiry {
  id: string;
  listing_id: string;
  buyer_id: string;
  requested_quantity: number;
  offered_price: number;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  farmer_id: string;
  buyer_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  read_at?: string;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  crop_id: string;
  market_id: string;
  target_price: number;
  is_active: boolean;
}

export interface MarketComparison {
  market: Market;
  modal_price: number;
  distance_km?: number;
  transport_cost?: number;
  estimated_net_proceeds: number;
  is_highlighted: boolean;
}

export interface VoiceQuery {
  transcript: string;
  language: LanguageCode;
  intent: string;
  entities: Record<string, any>;
  response: string;
  audio_url?: string;
}
