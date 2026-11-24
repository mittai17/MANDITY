# Mandity — Database Schema & Architecture

Mandity uses **PostgreSQL** hosted on **Supabase** with Row Level Security (RLS) enabled on all tables.

## 1. Entity Relationship Overview

```
auth.users ────────┐
                   ▼
               profiles (id = auth.uid())
                │      │
     ┌──────────┘      └──────────┐
     ▼                            ▼
produce_listings             conversations
  ├── listing_images           ├── messages
  └── buyer_inquiries          └── (listing_id)
        │
     (buyer_id)

crops ───────► market_prices ◄────── markets
  │                  ▲                  │
  └──────────► price_forecasts ◄────────┘
```

---

## 2. Table Catalog

| Table | Purpose | Security / RLS |
|---|---|---|
| `profiles` | Farmer / buyer account details, language, location | Public read, owner update |
| `crops` | Standard master crops list & multilingual names | Public read |
| `markets` | Mandi locations, lat/long, district, state | Public read |
| `market_prices` | Daily mandi prices (min, max, modal) | Public read |
| `price_forecasts` | Predicted prices with bounds and models | Public read |
| `produce_listings` | Active produce ads posted by farmers | Public read active; owner write |
| `listing_images` | Crop photos attached to listings | Public read; owner write |
| `buyer_inquiries` | Direct buyer trade inquiries and offers | Only buyer and listing farmer |
| `conversations` | 1-to-1 chat rooms between farmer and buyer | Only conversation participants |
| `messages` | Chat messages with timestamps | Only conversation participants |
| `saved_listings` | Bookmarked listings for buyers and farmers | Owner only |
| `price_alerts` | Automated notifications when target price hits | Owner only |
| `notifications` | In-app notification log | Owner only |

---

## 3. Row Level Security Policies

### Profiles
```sql
-- Everyone can view farmer/buyer names and verified statuses
CREATE POLICY "Public profiles are readable" ON profiles FOR SELECT USING (true);
-- Users can only modify their own profile
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Produce Listings
```sql
-- Anyone can browse active produce in the marketplace
CREATE POLICY "Active listings are viewable by everyone" ON produce_listings
  FOR SELECT USING (status = 'active' OR auth.uid() = farmer_id);

-- Only the owner farmer can edit or delete their listing
CREATE POLICY "Farmers can update their own listings" ON produce_listings
  FOR UPDATE USING (auth.uid() = farmer_id);
```

### Messaging Privacy
```sql
-- Only participants can access chat history
CREATE POLICY "Participants can view messages" ON messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM conversations
    WHERE id = conversation_id AND (farmer_id = auth.uid() OR buyer_id = auth.uid())
  ));
```

---

## 4. Migrations & Seeding

Migrations are located in `supabase/migrations/`:
- `001_initial_schema.sql` — Schema, indexes, constraints, RLS policies, triggers.

Seed data is located in `supabase/seed.sql`:
- Populates popular Indian crops (Tomato, Onion, Paddy, Groundnut, Coconut, Banana, Potato) with multilingual names (Tamil, Hindi, Telugu, Kannada, Malayalam).
- Populates key mandis (Chengalpattu, Koyambedu, Tiruvallur, Madurai, Coimbatore).
- Injects 14-day historical prices and demo forecasts.
