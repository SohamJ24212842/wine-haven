// Script to debug why variety detection might not be working
const fs = require('fs');
const { normalizeProductName } = require('./variety-utils');

// Load products from Supabase or local
// For now, let's check the spirits-list.json
const spirits = JSON.parse(fs.readFileSync('spirits-list.json', 'utf8'));

console.log('🔍 Checking variety detection for products...\n');

// Group products by normalized name
const groups = new Map();
spirits.forEach(product => {
  const normalized = normalizeProductName(product.name);
  if (!groups.has(normalized)) {
    groups.set(normalized, []);
  }
  groups.get(normalized).push(product);
});

// Find products with multiple varieties
let foundVarieties = 0;
groups.forEach((products, normalizedName) => {
  if (products.length > 1) {
    foundVarieties++;
    console.log(`✅ Found ${products.length} varieties for: "${normalizedName}"`);
    products.forEach(p => {
      console.log(`   - ${p.name} (${p.volumeMl}ml) - €${p.price}`);
    });
    console.log('');
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Total products: ${spirits.length}`);
console.log(`   Products with varieties: ${foundVarieties}`);
console.log(`   Total variety groups: ${groups.size}`);

// Check Clonakilty specifically
console.log('\n🔍 Clonakilty products:');
const clonakilty = spirits.filter(p => p.name.toLowerCase().includes('clonakilty'));
clonakilty.forEach(p => {
  const normalized = normalizeProductName(p.name);
  console.log(`   "${p.name}" → normalized: "${normalized}"`);
});

