# Find Products with 0.00 Prices

## Easiest Method: Browser Console

1. Open your website in browser (localhost:3000 or production)
2. Open Developer Console (F12 or Right-click → Inspect → Console)
3. Paste and run this code:

```javascript
fetch('/api/products')
  .then(r => r.json())
  .then(products => {
    const zeroPrice = products.filter(p => !p.price || p.price === 0 || p.price === null);
    console.log(`\n❌ Found ${zeroPrice.length} products with 0.00 prices:\n`);
    console.log('='.repeat(80));
    zeroPrice.forEach((p, i) => {
      console.log(`${i+1}. ${p.name}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   Price: ${p.price === null ? 'null' : p.price === undefined ? 'undefined' : `€${p.price}`}`);
      console.log(`   URL: /product/${p.slug}\n`);
    });
    console.log('='.repeat(80));
    console.log('\n📄 Copy this JSON to update in Supabase:');
    console.log(JSON.stringify(zeroPrice.map(p => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      currentPrice: p.price
    })), null, 2));
  });
```

## Method 2: SQL Query (Supabase Dashboard)

Go to Supabase Dashboard → SQL Editor and run:

```sql
SELECT 
  slug,
  name,
  category,
  price,
  sale_price,
  created_at
FROM products
WHERE price IS NULL 
   OR price = 0
   OR price::text = '0.00'
ORDER BY created_at DESC;
```

## Method 3: Admin Page Filter

1. Go to `/admin`
2. Look for products showing "€0.00" in the price column
3. Note their slugs and update in Supabase

## After Finding Them

1. Note the `slug` of each product
2. Go to Supabase Dashboard → Table Editor → products
3. Search for each slug
4. Update the `price` field with the correct price
5. Save changes
