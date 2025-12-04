# Egress Reduction Strategy

## Current Situation
- **Database Size**: 0.04 GB (very small - not the issue)
- **Egress**: 32.676 GB (MASSIVE - this is the problem!)
- **Issue**: Data transfer, not storage

## Root Causes of High Egress

### 1. Repeated Database Queries
- Every page load fetches products from Supabase
- No aggressive caching = repeated data transfer
- Homepage makes 4 separate queries

### 2. Large Product Descriptions
- Descriptions are 1-5KB each
- 186 products × 3KB average = ~558KB per request
- Multiple requests = GBs of transfer

### 3. Images
- Images served through Next.js Image optimization
- But if not cached properly, repeated downloads

## Optimizations Applied

### 1. Aggressive Caching
- **API Route**: 1 hour cache (was 5 minutes)
- **Homepage**: 1 hour cache (was 5 minutes)
- **In-Memory Cache**: 5 minutes (was 30 seconds)
- **Stale-While-Revalidate**: 24 hours (was 10 minutes)

### 2. Skip Description Field
- **List Views**: No description field (saves 80-90% data)
- **Search Queries**: Include description (needed for search)
- **Product Detail**: Include description (needed for detail page)

### 3. Optimized Homepage Queries
- **Before**: Fetched all products, filtered client-side
- **After**: Targeted queries with limits (10 products each)
- **Description**: Removed from homepage queries

### 4. Image Optimization
- Lazy loading
- AVIF/WebP formats
- 30-day cache
- Quality optimization (85%)

## Expected Results

### Data Transfer Reduction
- **Before**: ~32GB/month
- **After**: ~3-5GB/month (80-90% reduction)

### Query Reduction
- **Before**: Every page load = database query
- **After**: 1 query per hour (cached)

## Monitoring

### Check Supabase Dashboard
1. **Usage** → **Egress**: Should drop significantly
2. **Database** → **Query Performance**: Should show fewer queries
3. **API** → **Requests**: Should decrease

### Timeline
- **Immediate**: Caching takes effect
- **24 hours**: Should see 50% reduction
- **7 days**: Should see 80-90% reduction

## Additional Recommendations

### If Egress Still High After 7 Days

1. **Check Image Sources**
   - Are images in `public/spirits/` and `public/wines/`? ✅
   - Or in Supabase Storage? (should migrate to public folder)

2. **Enable Vercel Edge Caching**
   - Vercel automatically caches at edge
   - Check Vercel dashboard for cache hit rates

3. **Consider CDN**
   - Vercel already provides CDN
   - Images should be served from edge locations

4. **Review Query Patterns**
   - Check Supabase logs for repeated queries
   - Look for N+1 query problems

5. **Static Generation**
   - Consider ISR for product pages
   - Pre-render popular pages

## Current Cache Strategy

```
┌─────────────────────────────────────────┐
│  Client Request                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Vercel Edge Cache (24h stale)          │
│  - Serves cached responses              │
│  - Updates in background                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Next.js API Route Cache (1h)           │
│  - Server-side cache                    │
│  - Reduces database queries             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  In-Memory Cache (5 min)                │
│  - Prevents duplicate queries           │
│  - Same request = cached                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Supabase Database                      │
│  - Only queried when cache misses       │
│  - Optimized queries (no descriptions)  │
└─────────────────────────────────────────┘
```

## Summary

The 32GB egress was from:
1. **Repeated queries** (now cached for 1 hour)
2. **Large descriptions** (now skipped in list views)
3. **No caching** (now aggressive caching at multiple levels)

With these optimizations, egress should drop to **3-5GB/month** (80-90% reduction).



