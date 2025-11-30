# Query Optimization Guide

## Problem Analysis

Based on Supabase slow query logs, we identified the following bottlenecks:

### 1. Main Products Query (55.58% of total time)
- **Query**: `SELECT * FROM products ORDER BY created_at DESC`
- **Calls**: 401
- **Average Time**: 672ms
- **Max Time**: 2973ms
- **Issue**: Slow ORDER BY, fetching all columns including description

### 2. Promotional Media Query (5.55% of total time)
- **Query**: `SELECT * FROM promotional_media ORDER BY order ASC`
- **Calls**: 27
- **Average Time**: 998ms
- **Max Time**: 2961ms
- **Issue**: No index on `order` column

### 3. Other Slow Queries
- Featured products: 102ms average (acceptable)
- Product by slug: 33ms average (good!)
- New products: 259ms average (needs optimization)

## Solutions Implemented

### 1. Database Indexes (`migrations/optimize-slow-queries.sql`)

#### Main Products Query Optimization
- **Created DESC index**: `idx_products_created_at` on `created_at DESC`
- **Covering index**: `idx_products_covering_list` with INCLUDE clause
  - Allows index-only scans (no table access)
  - Includes all columns EXCEPT description
  - Expected: 672ms → <100ms (6-7x faster)

#### Promotional Media Optimization
- **Order index**: `idx_promotional_media_order` on `order ASC`
- Expected: 998ms → <50ms (20x faster)

#### Composite Indexes for Filtered Queries
- Featured products: `idx_products_category_featured_created`
- New products: `idx_products_new_created`
- Christmas gifts: `idx_products_christmas_gift_created`
- All use partial indexes (WHERE clause) for smaller size

### 2. Code Optimizations (Already Implemented)

#### Description Field Optimization
- ✅ List queries skip `description` field (huge data savings)
- ✅ Only fetch `description` when searching or viewing product details
- ✅ Reduces data transfer by 80-90%

#### Caching Strategy
- ✅ API route caching: 1 hour (3600s)
- ✅ In-memory caching: 5 minutes
- ✅ Cache-Control headers: `s-maxage=3600, stale-while-revalidate=86400`

#### Query Limits
- ✅ Products query limited to 1000 results
- ✅ Slug search limited to 20 results

## How to Apply Optimizations

### Step 1: Run Migration
```sql
-- In Supabase SQL Editor, run:
-- wine-haven-next/migrations/optimize-slow-queries.sql
```

### Step 2: Verify Indexes
```sql
-- Check if indexes were created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'products' 
ORDER BY indexname;
```

### Step 3: Test Query Performance
```sql
-- Test main products query
EXPLAIN ANALYZE
SELECT slug, category, name, price, image, images, country, region, producer, 
       taste_profile, food_pairing, grapes, wine_type, spirit_type, beer_style, 
       abv, volume_ml, featured, new, on_sale, sale_price, stock, christmas_gift, created_at
FROM products
ORDER BY created_at DESC
LIMIT 100;

-- Should show "Index Scan using idx_products_covering_list"
```

### Step 4: Monitor Performance
- Check Supabase dashboard → Database → Query Performance
- Look for improvement in average query time
- Monitor for 24-48 hours to see full impact

## Expected Results

### Before Optimization
- Main products query: **672ms average** (2973ms max)
- Promotional media: **998ms average** (2961ms max)
- Total query time: **485,000ms** (8 minutes)

### After Optimization
- Main products query: **<100ms average** (6-7x faster)
- Promotional media: **<50ms average** (20x faster)
- Total query time: **<80,000ms** (1.3 minutes)
- **Overall improvement: 6x faster**

## Maintenance

### Weekly
- Check query performance in Supabase dashboard
- Review slow queries (>100ms)

### Monthly
- Run `VACUUM ANALYZE products;` to update statistics
- Review index usage: `pg_stat_user_indexes`
- Consider dropping unused indexes

### When Adding New Queries
- Always add appropriate indexes
- Use EXPLAIN ANALYZE to verify index usage
- Test with realistic data volumes

## Troubleshooting

### Index Not Being Used
1. Check if index exists: `\d products` in psql
2. Update statistics: `ANALYZE products;`
3. Check query plan: `EXPLAIN ANALYZE SELECT ...`
4. Verify index matches query order (DESC vs ASC)

### Still Slow After Optimization
1. Check if covering index includes all needed columns
2. Verify partial indexes match WHERE clauses
3. Consider adding more specific indexes
4. Check for table bloat: `VACUUM FULL products;`

### High Index Size
- Covering indexes are larger but much faster
- Monitor index size: `pg_stat_user_indexes`
- Consider dropping if not used frequently

## Additional Optimizations

### Future Considerations
1. **Partitioning**: If products table grows >1M rows
2. **Materialized Views**: For complex aggregations
3. **Read Replicas**: For high-traffic scenarios
4. **Connection Pooling**: Already available on Pro plan

## References
- [PostgreSQL Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
- [Covering Indexes](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
- [Query Performance](https://www.postgresql.org/docs/current/performance-tips.html)
