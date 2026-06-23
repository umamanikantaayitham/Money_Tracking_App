# Money Tracker Pro

A modern, mobile-first Personal Finance Tracker App built with React 19, TypeScript, Capacitor, and Supabase.

## Features
- **Dashboard**: Overview of current balance, total income, total expenses, and recent activities.
- **Income & Expense Management**: Add, view, and delete transactions with categorized tracking.
- **Budgeting**: Set monthly budgets for specific categories and track usage.
- **Reports & Analytics**: Daily, Weekly, Monthly visual reports using Chart.js.
- **Realtime Database**: Fully synced multi-device experience using Supabase Realtime.
- **Local Notifications**: Daily and weekly reminders configured via Capacitor.
- **Dark Mode**: Complete theming support.

## Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase Account
- Android Studio (for Android build) / Xcode (for iOS build)

## Setup Instructions

### 1. Database Configuration
1. Go to [Supabase](https://supabase.com/).
2. Create a new project.
3. Open the SQL Editor in your Supabase dashboard.
4. Copy the contents of `supabase/schema.sql` and run it. This will create all tables, set up Row Level Security (RLS) policies, and create triggers.
5. In Supabase, go to Settings -> API to get your URL and Anon Key.

### 2. Environment Setup
1. Duplicate `.env.example` to `.env`.
2. Fill in the values:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server (Web)
```bash
npm run dev
```

### 5. Build for Mobile (Capacitor)
To build the application for mobile devices using Capacitor, follow these steps:

1. Build the frontend web assets:
```bash
npm run build
```

2. Add Android (or iOS) platform:
```bash
npx cap add android
# npx cap add ios
```

3. Sync assets to the native project:
```bash
npx cap sync android
```

4. Open the native IDE to compile and run on an emulator or physical device:
```bash
npx cap open android
```

## Technologies Used
- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand, React Router DOM, Chart.js
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, RLS)
- **Mobile**: Capacitor
- **Icons**: Lucide React
