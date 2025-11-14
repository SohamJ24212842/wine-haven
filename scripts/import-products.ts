// Script to import products from local data to Supabase
// Run with: npx tsx scripts/import-products.ts

import { createAdminClient } from '@/lib/supabase';
import { products } from '@/data/products';

async function importProducts() {
  const supabase = createAdminClient();
  
  if (!supabase) {
    console.error('❌ Supabase not configured. Please set up your .env.local file with Supabase credentials.');
    console.log('\nTo set up Supabase:');
    console.log('1. Create a Supabase project at https://supabase.com');
    console.log('2. Run the SQL schema from supabase-schema.sql');
    console.log('3. Add your credentials to .env.local');
    process.exit(1);
  }

  console.log('🚀 Starting product import...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      // Map product to database format
      const row = {
        slug: product.slug,
        category: product.category,
        name: product.name,
        price: product.price,
        description: product.description || '',
        image: product.image || '',
        country: product.country || '',
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
        christmas_gift: product.christmasGift || false,
      };

      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('slug')
        .eq('slug', product.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping ${product.name} (already exists)`);
        continue;
      }

      // Insert product
      const { error } = await supabase
        .from('products')
        .insert(row);

      if (error) {
        console.error(`❌ Error importing ${product.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Imported: ${product.name}`);
        successCount++;
      }
    } catch (error: any) {
      console.error(`❌ Error importing ${product.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✨ Import complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${products.length}`);
}

importProducts().catch(console.error);



