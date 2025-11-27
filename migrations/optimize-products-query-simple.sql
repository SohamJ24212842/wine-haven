-- Simplified version: Optimize products table queries (without GIN indexes)
-- Use this if pg_trgm extension cannot be enabled
-- Run this migration to improve query performance

-- 1. Add index on created_at for ordering (if not exists)
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- 2. Add index on category for filtering (if not exists)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 3. Add composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_category_created_at ON products(category, created_at DESC);

-- 4. Add index on featured flag for homepage queries
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;

-- 5. Add index on new flag
CREATE INDEX IF NOT EXISTS idx_products_new ON products(new) WHERE new = true;

-- 6. Add index on christmas_gift flag
CREATE INDEX IF NOT EXISTS idx_products_christmas_gift ON products(christmas_gift) WHERE christmas_gift = true;

-- 7. Add index on on_sale flag
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(on_sale) WHERE on_sale = true;

-- 8. Add index on slug for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 9. Add standard B-tree indexes for text search (slower than GIN but works without extensions)
-- These help with ILIKE queries, though not as fast as GIN indexes
CREATE INDEX IF NOT EXISTS idx_products_name_btree ON products(name text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_products_country_btree ON products(country);
CREATE INDEX IF NOT EXISTS idx_products_producer_btree ON products(producer);

-- 10. Analyze table to update statistics
ANALYZE products;

-- Notes:
-- - This version doesn't require pg_trgm extension
-- - B-tree indexes with text_pattern_ops help with ILIKE queries starting with a pattern
-- - Partial indexes (WHERE condition) are smaller and faster for boolean flags
-- - Composite indexes help with multi-column filters

