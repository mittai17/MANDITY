# Mandity — Developer Setup Guide

This guide details how to set up, run, and develop the Mandity platform locally.

---

## 1. Prerequisites

- **Node.js**: v18+ or v20+
- **Python**: 3.11 or newer
- **Expo CLI**: Installed with Expo SDK 58
- **Supabase CLI**: *(optional, for running local PostgreSQL)*

---

## 2. Mobile App Setup (Expo / React Native)

```bash
cd mobile

# Verify dependencies
npm install

# Typecheck code
npx tsc --noEmit

# Start development server
npx expo start
```

Press `a` in the terminal to launch the Android emulator or scan the QR code using the Expo Go app.

### Setting up Environment Variables

Create `mobile/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

> **Note:** If `EXPO_PUBLIC_SUPABASE_URL` is omitted, the app will run seamlessly in Demo Mode with mock data clearly marked with demo badges.

---

## 3. Backend Setup (FastAPI & AI Services)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

Access API interactive docs at: `http://localhost:8000/docs`

---

## 4. Supabase Database Setup

```bash
# Apply migrations to your remote Supabase project
npx supabase db push

# Apply seed data
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/seed.sql
```

---

## 5. Quality Assurance Checklist

Before pushing any changes:

- [x] Run `npx tsc --noEmit` from `mobile/` and verify 0 errors
- [x] Verify design tokens in `mobile/src/constants/theme.ts` are respected (no raw hex codes)
- [x] Check that demo data is tagged with `<DemoLabel />`
- [x] Ensure no server keys or LLM keys exist in client-side code
