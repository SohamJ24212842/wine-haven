# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Wine Haven
   - **Database Password**: WineHaven@123
   - **Region**: Choose closest to your users (e.g., `eu-west-1` for Ireland)
5. Wait for project to be created (~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this project
3. Copy and paste the entire SQL into the editor
4. Click **Run** (or press `Ctrl+Enter`)
5. Verify tables were created by going to **Table Editor**

You should see:
- `products`
- `customers`
- `orders`
- `order_items`

## Step 3: Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Important**: Never commit `.env.local` to git! It's already in `.gitignore`

## Step 5: Import Initial Data (Optional)

If you want to import your existing products:

1. Go to **Table Editor** → `products`
2. Click **Insert** → **Insert row**
3. Manually add products, OR
4. Use the Supabase API to bulk insert (see below)

### Bulk Import Script

Create a file `scripts/import-products.ts`:

```typescript
import { createAdminClient } from '@/lib/supabase';
import { products } from '@/data/products';

async function importProducts() {
  const supabase = createAdminClient();
  if (!supabase) {
    console.error('Supabase not configured');
    return;
  }

  for (const product of products) {
    const { error } = await supabase.from('products').insert({
      slug: product.slug,
      category: product.category,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      country: product.country,
      region: product.region || null,
      wine_type: product.wineType || null,
      spirit_type: product.spiritType || null,
      beer_style: product.beerStyle || null,
      abv: product.abv || null,
      volume_ml: product.volumeMl || null,
      featured: product.featured || false,
      new: product.new || false,
      on_sale: product.onSale || false,
      sale_price: product.salePrice || null,
      stock: product.stock || 0,
    });

    if (error) {
      console.error(`Error importing ${product.slug}:`, error);
    } else {
      console.log(`✓ Imported ${product.name}`);
    }
  }
}

importProducts();
```

## Step 6: Test the Connection

1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Visit `/admin` and try to:
   - View products (should load from database)
   - Create a new product
   - Update a product
   - Delete a product

3. Check Supabase dashboard → **Table Editor** → `products` to verify data

## Troubleshooting

### "Supabase credentials not configured"
- Make sure `.env.local` exists and has correct values
- Restart your dev server after adding env variables
- Check that variable names match exactly (no typos)

### "Failed to fetch products"
- Check Supabase dashboard → **Logs** for errors
- Verify RLS policies are set correctly
- Try using the admin client for testing

### "Row Level Security policy violation"
- Check that RLS policies in `supabase-schema.sql` were created
- For admin operations, use the service role key (already configured)

## Next Steps

- Set up authentication for admin users (replace password-based auth)
- Add image upload to Supabase Storage
- Set up order management
- Add analytics and reporting

