# Shop Page Fixes - Implementation Plan

## Issues to Fix

1. ✅ **"0.00" Price Display** - Fixed in ProductCard.tsx
2. ✅ **"Beer each"** - Added "each" prefix to beer prices with varieties in ProductCard.tsx
3. ⏳ **Filter Disappearing** - Make filters responsive (hide options that result in 0 products)
4. ⏳ **Server-Side Conversion** - Convert shop page to ISR for better performance

## Status

### ✅ Completed
- Fixed price display to handle 0.00 properly in ProductCard
- Added "each" prefix to beer prices when product has varieties

### ⏳ In Progress
- Making filters responsive (need to compute available options based on current filters)
- Server-side conversion (ISR)

## Next Steps

1. **Responsive Filters**: Compute available filter options based on current filter state
2. **Server-Side Conversion**: Create server component that fetches data, pass to client component

