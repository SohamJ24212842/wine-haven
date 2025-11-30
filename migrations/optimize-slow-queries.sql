-- Optimize slow queries based on Supabase query performance analysis
-- Run this migration to improve query performance
-- 
-- PROBLEM: Main products query takes 672ms average (2973ms max)
-- SOLUTION: Add optimized indexes for common query patterns

-- 1. Clean up any failed indexes first
DROP INDEX IF EXISTS idx_products_covering_list;
DROP INDEX IF EXISTS idx_products_covering_essential;

-- 2. Ensure created_at DESC index exists and is optimal
-- This is for the main products query (ORDER BY created_at DESC)
-- The index should be DESC to match the query order
-- This alone will provide 3-4x speedup (672ms → 150-200ms)
-- Note: Covering indexes are not possible due to 8KB row size limit
DROP INDEX IF EXISTS idx_products_created_at;
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- 3. Add index on promotional_media.order for faster sorting
-- This query is slow: ORDER BY order ASC (998ms average, 2961ms max)
-- Adding this index should reduce it to <50ms
CREATE INDEX IF NOT EXISTS idx_promotional_media_order ON promotional_media("order" ASC);

-- 4. Add composite index for featured products query
-- Query: WHERE category = X AND featured = true ORDER BY created_at DESC
-- Partial index (WHERE featured = true) is smaller and faster
CREATE INDEX IF NOT EXISTS idx_products_category_featured_created 
ON products(category, featured, created_at DESC) 
WHERE featured = true;

-- 5. Add composite index for new products query
-- Query: WHERE new = true ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_products_new_created 
ON products(new, created_at DESC) 
WHERE new = true;

-- 6. Add composite index for christmas_gift query
-- Query: WHERE christmas_gift = true ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_products_christmas_gift_created 
ON products(christmas_gift, created_at DESC) 
WHERE christmas_gift = true;

-- 7. Ensure slug index exists for fast lookups
-- Product by slug queries are already fast (33ms), but ensure index exists
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 8. Update table statistics for query planner
-- This helps PostgreSQL choose the best query plan
ANALYZE products;
ANALYZE promotional_media;

-- 9. Optional: VACUUM to reclaim space and update statistics
-- Run this periodically (weekly/monthly) to keep database optimized
-- VACUUM ANALYZE products;
-- VACUUM ANALYZE promotional_media;

-- Notes:
-- - DESC indexes match DESC ORDER BY queries perfectly
-- - Partial indexes (WHERE) are smaller and faster for filtered queries
-- - Covering indexes not possible due to 8KB PostgreSQL row size limit
-- - Expected improvement: 672ms → 150-200ms (3-4x faster) with created_at index
-- - Promotional media: 998ms → <50ms (20x faster) with order index
--
-- After running this migration:
-- 1. Check query performance in Supabase dashboard
-- 2. Verify indexes are being used: EXPLAIN ANALYZE SELECT ...
-- 3. Monitor for 24 hours to see improvement

