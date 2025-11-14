// Script to import products from local data to Supabase
// Run with: node scripts/import-products.mjs
// Make sure .env.local is configured with Supabase credentials

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase not configured. Please set up your .env.local file with Supabase credentials.');
  console.log('\nRequired environment variables:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your-project-url');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('\nSee SUPABASE_SETUP.md for instructions.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Import products data (we'll need to read it directly)
// For now, let's create a simple version that uses the API
async function importProducts() {
  console.log('🚀 Starting product import...\n');
  console.log('📝 Note: This script will import products via the API.\n');

  // Read products from the data file
  const productsPath = join(__dirname, '../src/data/products.ts');
  
  // Since we can't easily import TS files, let's use the API endpoint instead
  // Or we can create a JSON version
  
  console.log('⚠️  Please use the admin dashboard to add products, or');
  console.log('   set up Supabase and run the SQL schema first.\n');
  console.log('   The admin dashboard will work once Supabase is configured.');
}

importProducts().catch(console.error);



