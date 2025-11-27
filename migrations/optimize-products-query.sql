-- Optimize products table queries
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

-- 8. Add GIN index for text search on name (for ilike queries)
-- This significantly speeds up text search operations
CREATE INDEX IF NOT EXISTS idx_products_name_gin ON products USING gin(name gin_trgm_ops);

-- 9. Add GIN index for text search on description
CREATE INDEX IF NOT EXISTS idx_products_description_gin ON products USING gin(description gin_trgm_ops);

-- 10. Enable pg_trgm extension if not already enabled (required for GIN indexes)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 11. Analyze table to update statistics
ANALYZE products;

-- Notes:
-- - The GIN indexes (pg_trgm) significantly speed up ILIKE queries
-- - Partial indexes (WHERE condition) are smaller and faster for boolean flags
-- - Composite indexes help with multi-column filters
-- - Run ANALYZE after creating indexes to update query planner statistics

