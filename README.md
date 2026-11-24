# Mandity

**Know the price. Find the buyer. Sell smarter.**

Mandity is a mobile-first agricultural marketplace and market intelligence platform for India. It helps farmers understand the actual market value of their produce, compare nearby mandis, connect with buyers directly, and access multilingual AI assistance.

---

## Features

- 📊 **Mandi Price Intelligence** — Real-time and historical price data from AGMARKNET
- 🗺️ **Market Comparison** — Compare prices across nearby mandis with net-proceeds calculator
- 🛒 **Agricultural Marketplace** — Two-sided produce listing and inquiry platform
- 🤖 **Multilingual AI Assistant** — Voice-first assistant in Tamil, Hindi, Telugu, English
- 📈 **Price Forecasting** — Moving-average-based price estimates with uncertainty labels
- 🔔 **Price Alerts** — Get notified when crop prices hit your target
- 💬 **Real-time Messaging** — Secure buyer-farmer communication via Supabase Realtime

---

## Project Structure

```
MANDITY/
├── mobile/          # React Native / Expo app
├── backend/         # Python FastAPI service
├── supabase/        # Database migrations, seed data, edge functions
├── docs/            # Architecture and API documentation
└── AGENTS.md        # Agent and developer working guide
```

---

## Quick Start

### Mobile App

```bash
cd mobile
npm install
cp .env.example .env
# Fill in .env with your Supabase credentials
npx expo start
```

### Backend Service

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Fill in .env
uvicorn app.main:app --reload --port 8000
```

### Database Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Apply migrations and seed data
supabase db reset

# Or push to hosted project
supabase db push
```

---

## Configuration

The app works in **demo mode** without any configuration. Demo data is clearly labelled with a "Demo data" badge.

To use real data:
1. Create a [Supabase](https://supabase.com) project
2. Apply migrations: `supabase db push`
3. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `mobile/.env`
4. For AI features: set `GEMINI_API_KEY` in `backend/.env`

---

## Languages Supported

| Language | Code | Status |
|---|---|---|
| English | en | ✅ Full |
| Tamil | ta | ✅ Full |
| Hindi | hi | ✅ Full |
| Telugu | te | ✅ Partial |
| Kannada | kn | 🔜 Planned |
| Malayalam | ml | 🔜 Planned |

---

## Security Notes

- Supabase Row Level Security (RLS) is enabled on all tables
- The mobile app uses only the `anon` key — never the service role key
- LLM API keys are server-side only (Python backend / Edge Functions)
- All forecasts and estimates are clearly labelled — never presented as official prices

---

## Disclaimer

Mandity displays market price information for educational and planning purposes. Price data may be delayed, incomplete, or derived from demonstration datasets. Always verify prices with official market sources before making commercial decisions. Mandity does not hold or process payments.

---

## License

MIT
