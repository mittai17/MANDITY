# Mandity Architecture

## Overview

```
┌─────────────────────────────────┐
│         React Native App        │
│         (Expo SDK 58)           │
│                                 │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Expo    │  │   Zustand   │  │
│  │  Router  │  │   + Query   │  │
│  └──────────┘  └─────────────┘  │
│          │            │         │
│  ┌────────────────────────────┐  │
│  │       API Service Layer    │  │
│  │  (services/api.ts)         │  │
│  └────────┬─────────┬─────────┘  │
└───────────┼─────────┼────────────┘
            │         │
     ┌──────▼──┐  ┌───▼─────────┐
     │Supabase │  │  FastAPI    │
     │  (PG)   │  │  Backend   │
     │  Auth   │  │  (Python)  │
     │  RLS    │  │            │
     │Realtime │  │  AI/Voice  │
     │Storage  │  │  Forecast  │
     └─────────┘  └─────────────┘
                        │
                  ┌─────▼──────┐
                  │  Gemini    │
                  │  API (LLM) │
                  └────────────┘
```

## Mobile App Architecture

### Navigation (Expo Router)
- File-based routing under `src/app/`
- Two navigator groups: `(auth)` for onboarding, `(tabs)` for main app
- Auth state checked in root `index.tsx` redirects appropriately

### State Management
- **Zustand** for global state (auth, language, UI)
- **TanStack Query** for server state (prices, listings)
- Persistent auth state via `AsyncStorage`

### Data Flow
1. Screen mounts → calls `api.getX()` 
2. `api.getX()` checks `isSupabaseConfigured()`
3. If configured: queries Supabase → returns real data
4. If not: returns demo data with `is_demo: true`
5. Screen renders with appropriate DemoLabel badges

## Backend Architecture

### FastAPI Service
- Runs at `http://localhost:8000` (configurable)
- Handles: price data, forecasting, voice AI queries
- Falls back to demo data if Supabase not configured
- LLM integration: Gemini for natural language responses

### Forecasting Pipeline
```
Historical prices → Moving average → Linear trend → Prediction
                                                       ↓
                                              Confidence range
                                                       ↓
                                           Gemini explanation
```

### Voice AI Pipeline
```
Audio → expo-speech-recognition (STT)
     → Language detection
     → POST /api/voice/query
        → Intent detection (keyword matching)
        → Crop/market extraction
        → Supabase price lookup
        → Gemini explanation (optional)
        → Response text
     → expo-speech (TTS)
     → Display text
```

## Database Architecture

See `docs/database.md` for the full schema.

Key design decisions:
- Text IDs for crops and markets (human-readable slugs)
- UUID for all user-generated content
- `is_demo` flag on all data tables for clear labelling
- RLS on every table — no exceptions
- Realtime subscriptions on `messages` table for live chat

## Security Architecture

### Mobile App
- Uses Supabase `anon` key only
- No LLM API keys in mobile code
- Input validation with Zod
- Image uploads go through Supabase Storage (not directly to any CDN)

### Backend
- Uses Supabase `service_role` key (never exposed to mobile)
- Gemini API key server-side only
- Rate limiting on voice query endpoint (planned)

### Database
- RLS policies ensure users only see their own data
- Market prices and crop data are publicly readable
- Conversations are private to participants only
