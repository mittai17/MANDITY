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
│   │   │   ├── (tabs)/  ← Main 5-tab app shell
│   │   │   ├── prices/  ← /prices/[cropId] detail screen
│   │   │   ├── marketplace/ ← /marketplace/[listingId] detail
│   │   │   ├── messages/ ← /messages/index + /messages/[id]
│   │   │   ├── comparison/ ← Market comparison screen
│   │   │   ├── sell.tsx ← Sell produce wizard
│   │   │   ├── inquiries.tsx ← Inquiry management
│   │   │   └── settings.tsx ← App settings
│   │   ├── components/ui/ ← Reusable UI primitives
│   │   ├── constants/   ← Theme, colors, crop/market data
│   │   ├── localization/ ← i18n strings (en, ta, hi, te, kn, ml)
│   │   ├── services/    ← Supabase client, API layer
│   │   ├── store/       ← Zustand state stores
│   │   └── types/       ← Shared TypeScript types
│   ├── assets/          ← App icons, splash
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
│   │   └── main.py
│   └── requirements.txt
│
├── supabase/
│   ├── migrations/      ← SQL migrations (run in order)
│   ├── functions/       ← Edge functions (Deno)
│   └── seed.sql         ← Demo data only
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
| Mobile | React Native, Expo SDK 58, TypeScript, Expo Router |
| State | Zustand 5, TanStack Query 5 |
| Validation | Zod 4 |
| UI | StyleSheet (no NativeWind), Lucide React Native icons |
| Charts | react-native-chart-kit + react-native-svg |
| Animation | React Native Reanimated 4 |
| Backend DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (phone OTP) |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |
| AI backend | Python 3.11+, FastAPI, Pandas, Scikit-learn |
| LLM | Gemini API (configurable) |
| Speech | expo-speech-recognition (STT), expo-speech (TTS) |
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
| Tab | Route | Screen |
|---|---|---|
| Home | `/(tabs)/index` | Farmer dashboard |
| Prices | `/(tabs)/prices` | Crop price browser |
| Marketplace | `/(tabs)/marketplace` | Produce listings |
| AI | `/(tabs)/ai` | Voice AI assistant |
| Profile | `/(tabs)/profile` | Settings + profile |

### Contextual Screens
| Route | Description |
|---|---|
| `/prices/[cropId]` | Crop price detail + chart + forecast |
| `/marketplace/[listingId]` | Listing detail + inquiry |
| `/sell` | Multi-step produce listing wizard |
| `/comparison` | Market comparison + net-proceeds calculator |
| `/messages/index` | Conversation list |
| `/messages/[conversationId]` | 1-to-1 chat |
| `/messages/new` | Start new conversation |
| `/inquiries` | My inquiries (farmer: received, buyer: sent) |
| `/settings` | App settings |

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

## 6. Data & Demo Mode

**Golden rule:** Never present demo data as real market data.

- All demo prices have `is_demo: true` on the `MarketPrice` object.
- All demo data must show the `<DemoLabel />` component from `components/ui`.
- Forecasts must be labelled: "This is an estimate, not a guaranteed price."
- If a real data source (Supabase, AGMARKNET API) is unavailable, fall back to demo data with a visible badge.
- The `useUIStore` has a `demoMode` flag. Use it where relevant.

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
- `market_prices` — price records (source, is_demo flag)
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

The `api` object is the single API abstraction. It automatically uses:
1. **Supabase** when configured (`isSupabaseConfigured()` returns `true`)
2. **Demo data** when Supabase is not configured

Pattern for all data-fetching functions:
```ts
async function getX(): Promise<X[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase().from('table').select('*');
    if (error) throw error;
    return data ?? [];
  }
  return DEMO_DATA; // clearly marked as demo
}
```

---

## 10. AI Assistant Architecture

```
User speaks → expo-speech-recognition (STT)
           → language detection
           → Python FastAPI /voice/query
              → parse intent + entities
              → fetch market data from Supabase
              → Gemini API: explain data (not invent it)
              → return text response
           → expo-speech (TTS)
           → display text
```

**The LLM explains retrieved data. It does not generate prices.**

---

## 11. Forecasting Service

Located in `backend/app/forecasting/`. Uses:
- Moving average (baseline)
- Seasonal decomposition
- Ridge regression on historical data

Outputs always include:
- `predicted_price`
- `lower_estimate` / `upper_estimate`
- `model_version`
- Uncertainty note

Minimum data requirement: 14 price observations. If insufficient, return a clear message instead of a forecast.

---

## 12. Commands

```bash
# Mobile
cd mobile
npx expo start              # dev server
npx tsc --noEmit            # typecheck
npx expo lint               # lint
npx expo-doctor             # check dependencies

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

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
- Use `<DemoLabel />` on all demo data displays.
- Always handle loading, error, and empty states.
- Always handle the case where Supabase is not configured.
- Never put API secrets in mobile code.
- Use `TouchableOpacity` from `react-native` (or `react-native-gesture-handler` where needed).
- Use `ScrollView` with `contentContainerStyle={{ paddingBottom: 100 }}` on main screens.

Routing:
- Tab screen names in `_layout.tsx` must use just the file name without path prefix: `'index'`, `'prices'`, etc.

Do not:
- Hardcode prices in production paths (use the api layer).
- Use `any` types unnecessarily.
- Leave TODO comments in production code.
- Fake Supabase operations — handle the unconfigured state gracefully.
- Create circular imports between services.

---

## 14. Development Phases

| Phase | Focus | Status |
|---|---|---|
| 1 | Foundation: navigation, design system, auth, home | ✅ In Progress |
| 2 | Market intelligence: prices, charts, comparison, forecast | 🔄 Building |
| 3 | Marketplace: listings, images, search, filters | 🔄 Building |
| 4 | Communication: messaging, inquiries, notifications | 🔄 Building |
| 5 | AI & Voice: STT, TTS, intent parsing, multilingual | 🔜 Planned |
| 6 | Quality: RLS testing, perf, offline, Android build | 🔜 Planned |

---

## 15. Data Sources

| Source | Type | Status |
|---|---|---|
| AGMARKNET API | Real mandi prices | Requires API key |
| data.gov.in | Historical crop data | Public datasets |
| Demo seed data | In-memory / seed.sql | Available now |

If AGMARKNET credentials are not configured, use the demo dataset. Never present demo data as live data.

---

## 16. Acceptance Checklist

Before declaring any feature done:

- [ ] Screen renders without TypeScript errors
- [ ] Loading skeleton shown while data loads
- [ ] Error state shown and retry available
- [ ] Empty state shown when no data
- [ ] Demo label shown on all demo data
- [ ] Forecast clearly labelled as estimate
- [ ] Works on a 320px wide screen
- [ ] User-visible strings use `t()` localization
- [ ] No secrets in mobile code
- [ ] Supabase-unconfigured state handled gracefully
