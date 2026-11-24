# MANDITY — AGENTS & DEVELOPMENT GUIDE

> **Tagline:** Know the price. Find the buyer. Sell smarter.

Mandity is a full-stack mobile-first agricultural marketplace and market intelligence platform for India. This document is the single source of truth for agents, developers, and AI assistants working on this codebase.

---

## 1. Project Structure

```
MANDITY/
├── mobile/              ← Expo / React Native app (TypeScript)
│   ├── src/
│   │   ├── app/         ← Expo Router screens (file-based routing)
│   │   │   ├── (auth)/  ← Onboarding & auth screens (no tab bar)
│   │   │   │   ├── splash.tsx
│   │   │   │   ├── welcome.tsx
│   │   │   │   ├── phone.tsx
│   │   │   │   ├── otp.tsx
│   │   │   │   ├── profile.tsx
│   │   │   │   ├── location.tsx
│   │   │   │   └── permissions.tsx
│   │   │   ├── (tabs)/  ← Main 5-tab app shell
│   │   │   │   ├── index.tsx       ← Farmer home dashboard
│   │   │   │   ├── prices.tsx      ← Crop price browser
│   │   │   │   ├── marketplace.tsx ← Produce listings & bookmarks
│   │   │   │   ├── ai.tsx          ← Multilingual voice AI assistant (TTS/STT)
│   │   │   │   └── profile.tsx     ← User profile & settings navigation
│   │   │   ├── prices/
│   │   │   │   └── [cropId].tsx    ← Price detail + chart + forecast + alerts
│   │   │   ├── marketplace/
│   │   │   │   └── [listingId].tsx ← Listing detail + "Make an Offer" modal
│   │   │   ├── messages/
│   │   │   │   ├── index.tsx       ← 1-to-1 conversation threads
│   │   │   │   ├── [conversationId].tsx ← Live chat interface
│   │   │   │   └── new.tsx         ← Search farmer/buyer & start chat
│   │   │   ├── inquiries/
│   │   │   │   └── [inquiryId].tsx ← Detailed offer negotiation & status
│   │   │   ├── inquiries.tsx       ← Inquiry management & status badges
│   │   │   ├── comparison/
│   │   │   │   └── index.tsx       ← Multi-market net proceeds comparison
│   │   │   ├── legal/
│   │   │   │   ├── privacy.tsx     ← Farmer-first data protection policy
│   │   │   │   ├── terms.tsx       ← Platform agreement & market disclaimers
│   │   │   │   ├── help.tsx        ← Kisan Call Centre (1800-180-1551) & FAQ
│   │   │   │   └── about.tsx       ← App info, AGMARKNET attribution
│   │   │   ├── sell.tsx            ← 6-step produce listing wizard
│   │   │   ├── notifications.tsx   ← Categorized alert & inquiry center
│   │   │   ├── edit-profile.tsx    ← Edit profile, role & avatar selector
│   │   │   └── settings.tsx        ← App settings & preferences
│   │   ├── components/ui/ ← Reusable UI primitives (Card, Button, Text, Skeleton)
│   │   ├── constants/   ← Theme, colors, crop/market data, images
│   │   │   ├── theme.ts
│   │   │   ├── images.ts           ← Local asset & CDN crop/avatar resolver
│   │   │   └── index.ts
│   │   ├── localization/ ← i18n strings (en, ta, hi, te, kn, ml)
│   │   ├── services/    ← Supabase client, API layer
│   │   ├── store/       ← Zustand state stores (useAuthStore, useUIStore)
│   │   └── types/       ← Shared TypeScript types
│   ├── assets/
│   │   ├── crops/       ← High-res crop & avatar photographs
│   │   ├── icon.png
│   │   └── splash-icon.png
│   ├── app.json         ← Expo config
│   └── package.json
│
├── backend/             ← Python FastAPI service
│   ├── app/
│   │   ├── api/         ← Route handlers
│   │   ├── services/    ← Business logic
│   │   ├── forecasting/ ← Price prediction models
│   │   ├── data_ingestion/ ← AGMARKNET / data.gov.in ingestion
│   │   ├── schemas/     ← Pydantic models
│   │   └── main.py      ← FastAPI application entry point
│   └── requirements.txt
│
├── supabase/
│   ├── migrations/      ← SQL migrations (run in order)
│   ├── functions/       ← Edge functions (Deno)
│   └── seed.sql         ← Seed data
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api-documentation.md
│   └── setup-guide.md
│
├── AGENTS.md            ← This file
└── README.md
```

---

## 2. Technology Stack

| Layer | Tech |
|---|---|
| Mobile | React Native (0.88.1), Expo SDK 58, TypeScript (5.x), Expo Router (58.x) |
| State | Zustand 5, TanStack Query 5 |
| Validation | Zod 4 |
| UI | StyleSheet (no NativeWind), Lucide React Native icons |
| Charts | react-native-chart-kit + react-native-svg |
| Animation | React Native Reanimated 4 |
| Backend DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (phone OTP) |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |
| AI backend | Python 3.11+, FastAPI, Pandas, Scikit-learn, Numpy |
| LLM | Gemini API (configurable via server-side endpoints) |
| Speech | expo-speech-recognition (STT), expo-speech (TTS audio playback) |
| Location | expo-location |
| Images | expo-image-picker |
| Push | expo-notifications |

---

## 3. Color Palette & Design Tokens

```ts
primary:        '#174B37'   // Forest green — primary brand
primaryDark:    '#103629'   // Deep forest
primaryLight:   '#2E7D5A'   // Medium green
ivory:          '#F8F7F1'   // Warm background
white:          '#FFFFFF'
limeAccent:     '#B5D96A'   // Highlight / accent
primaryText:    '#1D2B23'
secondaryText:  '#758078'
border:         '#E8EAE3'
error:          '#B3261E'
success:        '#2E7D32'
warning:        '#C08A00'
```

All tokens are defined in `mobile/src/constants/theme.ts`. **Never hardcode hex values in components.**

---

## 4. Screen Map

### Auth Flow (no tab bar)
| Route | Screen | Status |
|---|---|---|
| `/(auth)/splash` | Animated onboarding intro | ✅ Built |
| `/(auth)/welcome` | Language + role selection | ✅ Built |
| `/(auth)/phone` | Phone number entry | ✅ Built |
| `/(auth)/otp` | OTP verification | ✅ Built |
| `/(auth)/profile` | Name + photo | ✅ Built |
| `/(auth)/location` | District + village | ✅ Built |
| `/(auth)/permissions` | Location + mic consent | ✅ Built |

### Main App (5-tab bar)
| Tab | Route | Screen | Status |
|---|---|---|---|
| Home | `/(tabs)/index` | Farmer dashboard with quick actions | ✅ Built |
| Prices | `/(tabs)/prices` | Crop price browser & category filters | ✅ Built |
| Marketplace | `/(tabs)/marketplace` | Produce listings with bookmarks | ✅ Built |
| AI | `/(tabs)/ai` | Multilingual Voice AI assistant + TTS | ✅ Built |
| Profile | `/(tabs)/profile` | Profile, language & legal settings | ✅ Built |

### Contextual Screens
| Route | Description | Status |
|---|---|---|
| `/prices/[cropId]` | Crop price detail + LineChart + AI forecast + Price Alerts | ✅ Built |
| `/marketplace/[listingId]` | Listing detail + "Make an Offer" modal sheet | ✅ Built |
| `/sell` | 6-step produce listing wizard with instant publish | ✅ Built |
| `/comparison` | Market comparison + net-proceeds calculator | ✅ Built |
| `/messages/index` | Conversation threads list | ✅ Built |
| `/messages/[conversationId]` | 1-to-1 live negotiation chat | ✅ Built |
| `/messages/new` | Start new conversation with farmer/buyer | ✅ Built |
| `/inquiries` | Inquiries management & status overview | ✅ Built |
| `/inquiries/[inquiryId]` | Inquiry detail, financial breakdown & negotiation actions | ✅ Built |
| `/notifications` | Notifications center (Price alerts, inquiries, reports) | ✅ Built |
| `/edit-profile` | Edit user profile, role & avatar selection | ✅ Built |
| `/settings` | Settings & notification toggles | ✅ Built |
| `/legal/privacy` | Privacy Policy (farmer data protection) | ✅ Built |
| `/legal/terms` | Terms of Service & market disclaimers | ✅ Built |
| `/legal/help` | Help & Support + Kisan Call Centre (1800-180-1551) | ✅ Built |
| `/legal/about` | About Mandity & AGMARKNET open data attribution | ✅ Built |

---

## 5. Navigation Rules

- All navigation uses `expo-router`. Never use `react-navigation` directly.
- Use `router.push()` for forward navigation.
- Use `router.replace()` for auth redirects (no back stack entry).
- Tab names in `_layout.tsx` must match exact file names under `(tabs)/`.
- Params to detail screens are passed as route params: `router.push('/prices/tomato')`.
- Use `useLocalSearchParams()` to read them.
- Link component: `import { Link } from 'expo-router'`.

---

## 6. Data & Market Sources

- Real reported mandi prices are benchmarked against official AGMARKNET feeds and data.gov.in public agricultural datasets.
- Forecast estimates are explicitly labelled: "This is an estimate based on historical data, not a guaranteed selling price."
- The UI maintains clean, production-grade presentation without cluttering the screen with placeholder labels.

---

## 7. Environment Variables

Set these in `mobile/.env` (never commit secrets):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend (`backend/.env`):
```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
AGMARKNET_API_KEY=...
```

**The mobile app must never hold the service role key or Gemini API key.** Use Edge Functions or the Python backend for LLM calls.

---

## 8. Database Tables (Supabase/PostgreSQL)

See `supabase/migrations/` for the full schema. Key tables:

- `profiles` — user accounts (farmer / buyer)
- `crops` — crop master list
- `markets` — mandi locations
- `market_prices` — price records (source, observation dates)
- `price_forecasts` — model predictions
- `produce_listings` — farmer produce ads
- `listing_images` — attached photos
- `buyer_inquiries` — inquiry with status workflow
- `conversations` — 1-to-1 chat threads
- `messages` — realtime messages
- `saved_listings` — user bookmarks
- `price_alerts` — user price notifications
- `notifications` — in-app notification log

**Row Level Security is enabled on all tables.** Users can only read/write their own rows unless explicitly allowed.

---

## 9. API Layer (`mobile/src/services/api.ts`)

The `api` object is the single API abstraction. It provides full coverage for:
- `getCrops()` & `getMarkets()`
- `getMarketPrices(cropId, marketId)` & `getForecast(cropId, marketId)`
- `voiceQuery(transcript, language)` — calls FastAPI `/api/voice/query` with offline fallback
- `getListings()` & `createProduceListing(data)`
- `getInquiries()`, `getInquiryById(id)`, `createInquiry()`, `updateInquiryStatus(id, status)`
- `getNotifications()`, `markNotificationRead(id)`, `markAllNotificationsRead()`
- `getPriceAlerts()`, `createPriceAlert(data)`
- `getSavedListingIds()`, `toggleSavedListing(id)`, `isListingSaved(id)`

---

## 10. AI Assistant Architecture

```
User speaks → expo-speech-recognition (STT)
           → language detection
           → Python FastAPI /api/voice/query
              → parse intent + entities (crop, market, volume)
              → fetch market data from AGMARKNET / Supabase
              → Gemini API / analytical heuristic: explain data transparently
              → return structured response text + metadata
           → expo-speech (TTS audio playback in regional languages)
           → interactive multi-turn conversation bubbles
```

**The LLM explains retrieved data. It does not fabricate market prices.**

---

## 11. Forecasting Service

Located in `backend/app/forecasting/`. Uses:
- Moving average (baseline)
- Seasonal decomposition
- Linear trend regression on historical price data

Outputs always include:
- `predicted_price`
- `lower_estimate` / `upper_estimate`
- `trend_direction`
- `model_version`
- `uncertainty_note`

Minimum data requirement: 14 price observations. If insufficient, return a heuristic fallback note instead of an unreliable forecast.

---

## 12. Commands & Testing

```bash
# Mobile Dev Server
cd mobile
npx expo start -c --android # launch Metro bundler on Android
npx tsc --noEmit            # typecheck verification

# Fast Port Forwarding for Android Emulator
adb reverse tcp:8081 tcp:8081 # Metro Bundler
adb reverse tcp:8000 tcp:8000 # FastAPI Backend

# Backend Service
cd backend
uv run python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Supabase
npx supabase db reset       # apply all migrations + seed
npx supabase db push        # push to hosted project
```

---

## 13. Agent Working Instructions

Before writing any code:
1. Read `AGENTS.md` (this file).
2. Check the existing file for the screen you're modifying.
3. Understand what imports already exist.
4. Preserve existing working functionality.
5. Run typecheck after edits: `npx tsc --noEmit`.

During implementation:
- Use the design tokens from `constants/theme.ts`. No hardcoded colors.
- Use `t(key, language)` for all user-visible strings.
- Always handle loading, error, and empty states.
- Always handle the case where Supabase is not configured.
- Never put API secrets in mobile code.
- Use `TouchableOpacity` from `react-native` (avoid `react-native-gesture-handler` touchables to prevent module ID resolution crashes).
- Use `ScrollView` with `contentContainerStyle={{ paddingBottom: 100 }}` on main screens.

---

## 14. Development Phases

| Phase | Focus | Status |
|---|---|---|
| 1 | Foundation: navigation, design system, auth, home | ✅ Complete |
| 2 | Market intelligence: prices, charts, comparison, forecast, price alerts | ✅ Complete |
| 3 | Marketplace: produce listings, images, search, bookmarks, publish wizard | ✅ Complete |
| 4 | Communication: 1-to-1 messaging, inquiries workflow, notifications center | ✅ Complete |
| 5 | AI & Voice: STT, TTS audio speech, intent parsing, multilingual assistant | ✅ Complete |
| 6 | Quality & Verification: TypeScript typecheck, emulator testing on Pixel 10 Pro | ✅ Verified |

---

## 15. Acceptance Checklist

Before declaring any feature done:

- [x] Screen renders without TypeScript errors (`npx tsc --noEmit` exits 0)
- [x] Loading skeleton/spinner shown while data loads
- [x] Error state shown and retry available
- [x] Empty state shown when no data
- [x] Forecast clearly labelled as estimate
- [x] Works on responsive screen sizes (tested on Pixel 10 Pro)
- [x] User-visible strings use `t()` localization
- [x] No secrets in mobile code
- [x] Supabase-unconfigured state handled gracefully with API layer fallback
