# How to Find Your Supabase API Keys

## Step-by-Step Guide

### Step 1: Go to Your Supabase Project
1. Log in to [https://app.supabase.com](https://app.supabase.com)
2. Select your project (or create a new one)

### Step 2: Navigate to API Settings
1. In the left sidebar, click **Settings** (gear icon at the bottom)
2. Click **API** (under "Project Settings")

### Step 3: Find Your Keys

You'll see a section called **"Project API keys"** with two keys:

#### 1. **anon public** key (for client-side)
- This is the **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- It's visible by default
- Copy this value

#### 2. **service_role** key (for admin/server-side)
- This is the **SUPABASE_SERVICE_ROLE_KEY**
- It's **hidden by default** for security
- Look for a button that says **"Reveal"** or **"Show"** or an eye icon 👁️
- Click it to reveal the key
- **⚠️ WARNING:** This key has admin access - keep it secret!

### Step 4: Get Your Project URL
- At the top of the API settings page, you'll see **"Project URL"**
- This is your **NEXT_PUBLIC_SUPABASE_URL**
- It looks like: `https://xxxxxxxxxxxxx.supabase.co`

## Visual Guide

```
Settings → API
├── Project URL: https://xxxxx.supabase.co  ← NEXT_PUBLIC_SUPABASE_URL
└── Project API keys:
    ├── anon public: eyJhbGc...  ← NEXT_PUBLIC_SUPABASE_ANON_KEY (visible)
    └── service_role: [Reveal] 👁️  ← SUPABASE_SERVICE_ROLE_KEY (click to reveal)
```

## If You Still Can't Find It

### Option 1: Check if you have the right permissions
- Make sure you're the **project owner** or have **admin access**
- The service_role key is only visible to project owners/admins

### Option 2: Create a new API key (if needed)
- Some Supabase plans might have restrictions
- Check your plan limits

### Option 3: Use anon key only (limited functionality)
- You can temporarily use the anon key for both
- **Note:** Admin operations (create/update/delete) might not work
- This is only for testing - you'll need service_role for full admin functionality

## Quick Copy Checklist

Once you have all three values, add them to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Reminder

- ✅ **anon key** - Safe to use in client-side code (browser)
- ⚠️ **service_role key** - NEVER expose in client-side code, only use in server-side API routes
- The service_role key bypasses Row Level Security (RLS) - keep it secret!



