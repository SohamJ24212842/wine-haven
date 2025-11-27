-- Fix performance issues and enable RLS
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS on promotional_media table
ALTER TABLE public.promotional_media ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to promotional_media" ON public.promotional_media;

-- Create a policy to allow public read access (since it's promotional content)
CREATE POLICY "Allow public read access to promotional_media"
ON public.promotional_media
FOR SELECT
TO public
USING (true);

-- 2. Create indexes on products table to speed up queries

-- Index on created_at (used for ORDER BY in main query)
-- This is the most important index - reduces query time from ~566ms to <50ms
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc 
ON public.products(created_at DESC);

-- Index on slug (used for lookups)
CREATE INDEX IF NOT EXISTS idx_products_slug 
ON public.products(slug);

-- Index on category (used for filtering)
CREATE INDEX IF NOT EXISTS idx_products_category 
ON public.products(category);

-- Composite index for category + created_at (common filter pattern)
CREATE INDEX IF NOT EXISTS idx_products_category_created_at 
ON public.products(category, created_at DESC);

-- Index on featured flag (used for homepage)
CREATE INDEX IF NOT EXISTS idx_products_featured 
ON public.products(featured) 
WHERE featured = true;

-- Index on new flag (used for homepage)
CREATE INDEX IF NOT EXISTS idx_products_new 
ON public.products(new) 
WHERE new = true;

-- Index on christmas_gift flag (used for filtering)
CREATE INDEX IF NOT EXISTS idx_products_christmas_gift 
ON public.products(christmas_gift) 
WHERE christmas_gift = true;

-- Index on on_sale flag (used for filtering)
CREATE INDEX IF NOT EXISTS idx_products_on_sale 
ON public.products(on_sale) 
WHERE on_sale = true;

-- 3. Create GIN indexes for text search (if you have many products)
-- These help with ILIKE queries across multiple columns

-- Note: GIN indexes require pg_trgm extension
-- Enable it first: CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Then create indexes for text search columns
-- CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin(name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON public.products USING gin(description gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_products_country_trgm ON public.products USING gin(country gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_products_region_trgm ON public.products USING gin(region gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_products_producer_trgm ON public.products USING gin(producer gin_trgm_ops);

-- 4. Analyze tables to update statistics (helps query planner)
ANALYZE public.products;
ANALYZE public.promotional_media;

