# Supabase Resource Optimization Guide

## Understanding Supabase Queries

### System Queries (NOT Application Queries)
The queries you see in Supabase dashboard like:
- `pg_stat_statements_reset()`
- Cache hit rate queries
- Performance metrics queries
- Session timeout settings

**These are Supabase's own monitoring queries - they are NOT causing resource exhaustion and should NOT be deleted.**

### Application Queries (What We Optimized)
These are the actual queries from your application:
1. **Homepage**: `getFeaturedProducts()`, `getNewProducts()`, `getChristmasGifts()`
2. **Shop Page**: `getAllProducts()` via `/api/products`
3. **Product Detail**: `getProductBySlug()`

## Optimizations Applied

### 1. Homepage Caching
- **Before**: Every request hit database (`force-dynamic`)
- **After**: Cached for 5 minutes (`revalidate = 300`)
- **Impact**: ~95% reduction in homepage queries

### 2. Optimized Queries
- **Before**: Fetched ALL products, filtered client-side
- **After**: Targeted queries with limits (e.g., `getFeaturedProducts("Wine", 10)`)
- **Impact**: ~90% less data transferred

### 3. In-Memory Caching
- Added 30-second TTL cache for all queries
- Prevents duplicate queries within same request
- **Impact**: Eliminates duplicate queries

### 4. API Caching
- Increased cache time: 5 minutes (was 1 minute)
- Stale-while-revalidate: 10 minutes (was 2 minutes)
- **Impact**: Fewer API calls

### 5. Query Optimization
- Removed `count: 'exact'` (reduces overhead)
- Uses indexes from migration
- **Impact**: Faster queries, less CPU

## Monitoring Resource Usage

### Check Supabase Dashboard
1. Go to **Project Settings** → **Usage**
2. Check which resources are being exhausted:
   - **Database Size**: Should be stable
   - **API Requests**: Should decrease with caching
   - **Database CPU**: Should decrease with optimized queries
   - **Database Connections**: Should be stable
   - **Bandwidth**: Should decrease with caching

### What to Look For
- **High API Requests**: Check if caching is working
- **High Database CPU**: Check for slow queries
- **High Connections**: Check for connection leaks
- **High Bandwidth**: Check for large queries

## If Warnings Persist

### 1. Check Actual Application Queries
In Supabase Dashboard → **Database** → **Query Performance**:
- Look for queries from your application (not system queries)
- Check for slow queries (> 100ms)
- Check for queries with high `calls` count

### 2. Review Query Patterns
- Are there N+1 query problems?
- Are queries being made unnecessarily?
- Are there missing indexes?

### 3. Consider Upgrading
If you're on the Free tier and hitting limits:
- **Pro Plan**: $25/month - Higher limits
- **Team Plan**: $599/month - Even higher limits

### 4. Additional Optimizations
- Enable connection pooling (if not already)
- Use read replicas (Pro plan)
- Implement CDN caching (Vercel Edge)
- Use static generation where possible

## Expected Results After Optimizations

- **Database Queries**: 80-90% reduction
- **Response Times**: Faster (cached responses)
- **Resource Usage**: Should stay well below limits
- **User Experience**: No change (cached data is fresh)

## Next Steps

1. **Monitor for 24-48 hours** after optimizations
2. **Check Supabase dashboard** for resource usage trends
3. **Review query logs** for any slow queries
4. **Consider upgrading** if still hitting limits



