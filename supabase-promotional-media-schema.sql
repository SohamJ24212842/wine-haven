-- Promotional Media Table
-- Run this in your Supabase SQL editor to create the table

CREATE TABLE IF NOT EXISTS promotional_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('video', 'image')),
  url TEXT NOT NULL,
  thumbnail TEXT,
  title TEXT,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_promotional_media_active_order ON promotional_media(active, "order");

-- Disable Row Level Security for now (enable and add policies later if needed)
ALTER TABLE promotional_media DISABLE ROW LEVEL SECURITY;

