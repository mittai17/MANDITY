-- ============================================================
-- MANDITY — INITIAL DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- Description: Complete schema with RLS policies, indexes, and triggers
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. PROFILES (extends Supabase auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta', 'te', 'hi', 'kn', 'ml')),
  district TEXT,
  village TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2. CROPS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  local_names JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 3. MARKETS (mandis)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  location TEXT,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 4. MARKET PRICES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id TEXT NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  market_id TEXT NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  observation_date DATE NOT NULL,
  min_price DECIMAL(10, 2) NOT NULL,
  max_price DECIMAL(10, 2) NOT NULL,
  modal_price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  source TEXT NOT NULL DEFAULT 'AGMARKNET',
  is_demo BOOLEAN NOT NULL DEFAULT false,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_market_prices UNIQUE (crop_id, market_id, observation_date)
);

-- ------------------------------------------------------------
-- 5. PRICE FORECASTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id TEXT NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  market_id TEXT NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  forecast_date DATE NOT NULL,
  predicted_price DECIMAL(10, 2) NOT NULL,
  lower_estimate DECIMAL(10, 2) NOT NULL,
  upper_estimate DECIMAL(10, 2) NOT NULL,
  trend_direction TEXT NOT NULL DEFAULT 'stable' CHECK (trend_direction IN ('rising', 'falling', 'stable')),
  model_version TEXT NOT NULL DEFAULT 'v1',
  uncertainty_note TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 6. PRODUCE LISTINGS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produce_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  crop_id TEXT NOT NULL REFERENCES crops(id),
  title TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'quintal', 'tonne')),
  asking_price DECIMAL(10, 2) NOT NULL,
  location TEXT NOT NULL,
  district TEXT,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'sold', 'deleted')),
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 7. LISTING IMAGES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES produce_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 8. BUYER INQUIRIES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS buyer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES produce_listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_quantity DECIMAL(10, 2) NOT NULL,
  offered_price DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'negotiating', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 9. CONVERSATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES produce_listings(id) ON DELETE SET NULL,
  farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_conversations UNIQUE (listing_id, farmer_id, buyer_id)
);

-- ------------------------------------------------------------
-- 10. MESSAGES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- 11. SAVED LISTINGS (Bookmarks)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES produce_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_saved_listings UNIQUE (user_id, listing_id)
);

-- ------------------------------------------------------------
-- 12. PRICE ALERTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  crop_id TEXT NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  market_id TEXT REFERENCES markets(id) ON DELETE SET NULL,
  target_price DECIMAL(10, 2) NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'above' CHECK (alert_type IN ('above', 'below')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 13. NOTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_market ON market_prices (crop_id, market_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON market_prices (observation_date DESC);
CREATE INDEX IF NOT EXISTS idx_price_forecasts_lookup ON price_forecasts (crop_id, market_id, forecast_date DESC);
CREATE INDEX IF NOT EXISTS idx_produce_listings_farmer ON produce_listings (farmer_id);
CREATE INDEX IF NOT EXISTS idx_produce_listings_status ON produce_listings (status);
CREATE INDEX IF NOT EXISTS idx_produce_listings_crop ON produce_listings (crop_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_buyer_inquiries_listing ON buyer_inquiries (listing_id);
CREATE INDEX IF NOT EXISTS idx_buyer_inquiries_buyer ON buyer_inquiries (buyer_id);

-- ============================================================
-- TRIGGERS FOR updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produce_listings_updated_at
  BEFORE UPDATE ON produce_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_inquiries_updated_at
  BEFORE UPDATE ON buyer_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Crops & Markets (Public read)
CREATE POLICY "Crops are viewable by everyone"
  ON crops FOR SELECT
  USING (true);

CREATE POLICY "Markets are viewable by everyone"
  ON markets FOR SELECT
  USING (true);

-- 3. Market Prices & Forecasts (Public read)
CREATE POLICY "Market prices are viewable by everyone"
  ON market_prices FOR SELECT
  USING (true);

CREATE POLICY "Price forecasts are viewable by everyone"
  ON price_forecasts FOR SELECT
  USING (true);

-- 4. Produce Listings
CREATE POLICY "Active listings are viewable by everyone"
  ON produce_listings FOR SELECT
  USING (status = 'active' OR auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert their own listings"
  ON produce_listings FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own listings"
  ON produce_listings FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own listings"
  ON produce_listings FOR DELETE
  USING (auth.uid() = farmer_id);

-- 5. Listing Images
CREATE POLICY "Listing images are viewable by everyone"
  ON listing_images FOR SELECT
  USING (true);

CREATE POLICY "Farmers can manage images for their listings"
  ON listing_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM produce_listings WHERE id = listing_id AND farmer_id = auth.uid()
  ));

-- 6. Buyer Inquiries
CREATE POLICY "Farmers and buyers can view their inquiries"
  ON buyer_inquiries FOR SELECT
  USING (
    auth.uid() = buyer_id OR
    EXISTS (SELECT 1 FROM produce_listings WHERE id = listing_id AND farmer_id = auth.uid())
  );

CREATE POLICY "Buyers can create inquiries"
  ON buyer_inquiries FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update inquiry status"
  ON buyer_inquiries FOR UPDATE
  USING (
    auth.uid() = buyer_id OR
    EXISTS (SELECT 1 FROM produce_listings WHERE id = listing_id AND farmer_id = auth.uid())
  );

-- 7. Conversations
CREATE POLICY "Participants can view conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);

CREATE POLICY "Buyers and farmers can start conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = farmer_id OR auth.uid() = buyer_id);

-- 8. Messages
CREATE POLICY "Participants can view messages"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations
    WHERE id = conversation_id AND (farmer_id = auth.uid() OR buyer_id = auth.uid())
  ));

CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id AND (farmer_id = auth.uid() OR buyer_id = auth.uid())
    )
  );

-- 9. Saved Listings
CREATE POLICY "Users can manage their saved listings"
  ON saved_listings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 10. Price Alerts
CREATE POLICY "Users can manage their price alerts"
  ON price_alerts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 11. Notifications
CREATE POLICY "Users can view and manage their notifications"
  ON notifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
