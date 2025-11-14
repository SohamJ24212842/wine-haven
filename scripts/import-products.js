// Script to import products from local data to Supabase
// Run with: node scripts/import-products.js
// Make sure .env.local is configured with Supabase credentials

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase not configured. Please set up your .env.local file with Supabase credentials.');
  console.log('\nRequired environment variables:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your-project-url');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Import products data
const { products } = require('../src/data/products.ts');

async function importProducts() {
  console.log('🚀 Starting product import...\n');

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

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
        skippedCount++;
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
    } catch (error) {
      console.error(`❌ Error importing ${product.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✨ Import complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${products.length}`);
}

importProducts().catch(console.error);



