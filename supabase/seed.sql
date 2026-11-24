-- ============================================================
-- MANDITY — DEMO SEED DATA
-- seed.sql
-- Note: All seed market prices have is_demo = true.
-- Never present demo data as real-world market intelligence.
-- ============================================================

-- ------------------------------------------------------------
-- 1. CROPS MASTER DATA
-- ------------------------------------------------------------
INSERT INTO crops (id, name, category, image_url, local_names, is_active) VALUES
('tomato', 'Tomato', 'Vegetables', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', '{"en": "Tomato", "ta": "தக்காளி", "hi": "टमाटर", "te": "టొమాటో", "kn": "ಟೊಮೆಟೊ", "ml": "തക്കാളി"}'::jsonb, true),
('onion', 'Onion', 'Vegetables', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400', '{"en": "Onion", "ta": "வெங்காயம்", "hi": "प्याज", "te": "ఉల్లిపాయ", "kn": "ಈರುಳ್ಳಿ", "ml": "സവോള"}'::jsonb, true),
('paddy', 'Paddy (Rice)', 'Grains', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', '{"en": "Paddy", "ta": "நெல்", "hi": "धान", "te": "వరి", "kn": "ಭತ್ತ", "ml": "നെല്ല്"}'::jsonb, true),
('groundnut', 'Groundnut', 'Oilseeds', 'https://images.unsplash.com/photo-1567332241152-29930f71887e?w=400', '{"en": "Groundnut", "ta": "வேர்க்கடலை", "hi": "मूंगफली", "te": "వేరుశెనగ", "kn": "ಕಡಲೆಕಾಯಿ", "ml": "നിലക്കടല"}'::jsonb, true),
('coconut', 'Coconut', 'Fruits', 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=400', '{"en": "Coconut", "ta": "தேங்காய்", "hi": "नारियल", "te": "కొబ్బరి", "kn": "ತೆಂಗಿನಕಾಯಿ", "ml": "തേങ്ങ"}'::jsonb, true),
('banana', 'Banana', 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', '{"en": "Banana", "ta": "வாழைப்பழம்", "hi": "केला", "te": "అరటిపండు", "kn": "ಬಾಳೆಹಣ್ಣು", "ml": "വാഴപ്പഴം"}'::jsonb, true),
('potato', 'Potato', 'Vegetables', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', '{"en": "Potato", "ta": "உருளைக்கிழங்கு", "hi": "आलू", "te": "బంగాళాదుంప", "kn": "ಆಲೂಗಡ್ಡೆ", "ml": "ഉരുളക്കിഴങ്ങ്"}'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  local_names = EXCLUDED.local_names;

-- ------------------------------------------------------------
-- 2. MANDI / MARKETS DATA
-- ------------------------------------------------------------
INSERT INTO markets (id, name, state, district, location, latitude, longitude, is_active) VALUES
('chengalpattu', 'Chengalpattu Mandi', 'Tamil Nadu', 'Chengalpattu', 'Chengalpattu Market Yard, Tamil Nadu', 12.6825, 79.9836, true),
('koyambedu', 'Koyambedu Wholesale Market Complex', 'Tamil Nadu', 'Chennai', 'Koyambedu, Chennai, Tamil Nadu', 13.0694, 80.1948, true),
('tiruvallur', 'Tiruvallur Regulated Market', 'Tamil Nadu', 'Tiruvallur', 'Tiruvallur Town, Tamil Nadu', 13.1439, 79.9079, true),
('madurai', 'Madurai Central Market', 'Tamil Nadu', 'Madurai', 'Mattuthavani, Madurai, Tamil Nadu', 9.9482, 78.1578, true),
('coimbatore', 'Coimbatore Thyagi Kumaran Market', 'Tamil Nadu', 'Coimbatore', 'R.S. Puram, Coimbatore, Tamil Nadu', 11.0088, 76.9525, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location;

-- ------------------------------------------------------------
-- 3. HISTORICAL & CURRENT MARKET PRICES (Last 14 days, Demo)
-- ------------------------------------------------------------
DO $$
DECLARE
  v_crop_id TEXT;
  v_market_id TEXT;
  v_day INT;
  v_base_price DECIMAL;
  v_date DATE;
  v_modal DECIMAL;
  v_min DECIMAL;
  v_max DECIMAL;
BEGIN
  FOR v_crop_id, v_base_price IN
    VALUES
      ('tomato', 24.0),
      ('onion', 30.0),
      ('paddy', 23.0),
      ('groundnut', 58.0),
      ('coconut', 28.0),
      ('banana', 35.0),
      ('potato', 20.0)
  LOOP
    FOR v_market_id IN SELECT id FROM markets LOOP
      FOR v_day IN 0..14 LOOP
        v_date := CURRENT_DATE - v_day;
        -- Seed deterministic daily fluctuations:
        v_modal := ROUND(v_base_price + (SIN(v_day * 1.2 + ASCII(v_market_id)) * 3.5), 2);
        v_min := ROUND(v_modal * 0.85, 2);
        v_max := ROUND(v_modal * 1.18, 2);

        INSERT INTO market_prices (crop_id, market_id, observation_date, min_price, max_price, modal_price, unit, source, is_demo)
        VALUES (v_crop_id, v_market_id, v_date, v_min, v_max, v_modal, 'kg', 'AGMARKNET (Demo)', true)
        ON CONFLICT (crop_id, market_id, observation_date) DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- ------------------------------------------------------------
-- 4. PRICE FORECASTS (Next 7 days, Demo)
-- ------------------------------------------------------------
INSERT INTO price_forecasts (crop_id, market_id, forecast_date, predicted_price, lower_estimate, upper_estimate, trend_direction, model_version, uncertainty_note, is_demo)
VALUES
('tomato', 'chengalpattu', CURRENT_DATE + 7, 26.50, 22.00, 31.00, 'rising', 'ridge-seasonal-v1', 'Estimate based on 14-day seasonal trends and arrivals. Not a guaranteed selling price.', true),
('tomato', 'koyambedu', CURRENT_DATE + 7, 28.00, 23.50, 32.50, 'rising', 'ridge-seasonal-v1', 'Estimate based on 14-day seasonal trends and arrivals. Not a guaranteed selling price.', true),
('onion', 'koyambedu', CURRENT_DATE + 7, 31.50, 27.00, 36.00, 'stable', 'moving-average-v1', 'Estimate based on moving averages. Not a guaranteed selling price.', true),
('paddy', 'tiruvallur', CURRENT_DATE + 7, 23.80, 21.00, 26.50, 'stable', 'moving-average-v1', 'Estimate based on moving averages. Not a guaranteed selling price.', true)
ON CONFLICT DO NOTHING;
