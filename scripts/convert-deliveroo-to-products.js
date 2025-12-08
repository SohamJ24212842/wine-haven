// Script to convert Deliveroo CSV to product database format
// Handles DRS fee for beers (0.15 per beer)
// Outputs CSV in Deliveroo template format

const fs = require('fs');
const path = require('path');

// DRS fee per beer (in euros)
const DRS_FEE_PER_BEER = 0.15;

// Slugify function
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Normalize name for matching
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find matching product from database
function findMatchingProduct(deliverooName, existingProducts) {
  const normalizedName = normalizeName(deliverooName);
  
  // Try exact match
  let match = existingProducts.find(p => 
    normalizeName(p.name) === normalizedName
  );
  
  if (match) return match;
  
  // Try partial match
  match = existingProducts.find(p => {
    const productName = normalizeName(p.name);
    return normalizedName.includes(productName) || productName.includes(normalizedName);
  });
  
  if (match) return match;
  
  // Try matching by internal_name or item_name variations
  match = existingProducts.find(p => {
    const productName = normalizeName(p.name);
    // Remove common suffixes/prefixes
    const cleanDeliveroo = normalizedName.replace(/\s*(arp\.|doc|frizzante|spumante|brut|cuvée|rosé|rosé brut)/gi, '').trim();
    const cleanProduct = productName.replace(/\s*(arp\.|doc|frizzante|spumante|brut|cuvée|rosé|rosé brut)/gi, '').trim();
    return cleanDeliveroo === cleanProduct || cleanDeliveroo.includes(cleanProduct) || cleanProduct.includes(cleanDeliveroo);
  });
  
  return match;
}

// Determine category from product name and existing data
function determineCategory(name, existingProduct) {
  if (existingProduct) {
    return existingProduct.category;
  }
  
  const lowerName = name.toLowerCase();
  
  // Check for beer indicators
  if (lowerName.includes('beer') || 
      lowerName.includes('lager') || 
      lowerName.includes('ipa') || 
      lowerName.includes('pilsner') ||
      lowerName.includes('weissbier') ||
      lowerName.includes('cider') ||
      lowerName.includes('ginger beer')) {
    return 'Beer';
  }
  
  // Check for spirit indicators
  if (lowerName.includes('whiskey') || 
      lowerName.includes('whisky') ||
      lowerName.includes('gin') ||
      lowerName.includes('vodka') ||
      lowerName.includes('rum') ||
      lowerName.includes('tequila') ||
      lowerName.includes('cognac') ||
      lowerName.includes('bourbon') ||
      lowerName.includes('liqueur')) {
    return 'Spirit';
  }
  
  // Default to Wine
  return 'Wine';
}

// Calculate DRS fee for beers
function calculateDRSFee(category, volumeMl) {
  if (category !== 'Beer') {
    return 0;
  }
  
  // Calculate number of beers based on volume
  // Standard beer sizes: 330ml, 440ml, 500ml
  // For packs, calculate based on total volume
  if (volumeMl) {
    // If it's a pack (e.g., 4-pack = 1320ml), calculate number of units
    if (volumeMl >= 1000) {
      // Likely a pack - estimate number of beers
      const estimatedBeers = Math.round(volumeMl / 330); // Assume 330ml per beer
      return estimatedBeers * DRS_FEE_PER_BEER;
    } else {
      // Single beer
      return DRS_FEE_PER_BEER;
    }
  }
  
  // Default: assume single beer
  return DRS_FEE_PER_BEER;
}

// Parse Deliveroo CSV
function parseDeliverooCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    if (row.item_name) {
      rows.push(row);
    }
  }
  
  return rows;
}

// Convert to Deliveroo template CSV format
function convertToDeliverooFormat(products) {
  const headers = [
    'item_id',
    'item_name',
    'item_description',
    'delivery_price',
    'instore_price',
    'tax_rate',
    'allergens',
    'calories',
    'hfss',
    'max_quantity',
    'age_restricted',
    'plu',
    'barcodes',
    'ian',
    'classifications',
    'replacement_eligible',
    'substitution_eligible',
    'internal_name',
    'dietary_information',
    'returnable',
    'irish_drs_deposit_fee',
    'irish_drs_items_per_pack',
    // Additional fields for product database
    'category',
    'country',
    'region',
    'producer',
    'wine_type',
    'spirit_type',
    'beer_style',
    'abv',
    'volume_ml',
    'image_url',
    'featured',
    'new',
    'on_sale',
    'stock'
  ];
  
  const rows = products.map(product => {
    const drsFee = product.drsFee || 0;
    const drsItemsPerPack = product.category === 'Beer' && product.volumeMl && product.volumeMl >= 1000 
      ? Math.round(product.volumeMl / 330) 
      : (product.category === 'Beer' ? '1' : '');
    
    // Generate item_id if not exists (use slug as base)
    const itemId = product.item_id || `${slugify(product.name).substring(0, 8)}-${Date.now().toString(36)}`;
    
    // Add DRS fee to beer prices for delivery_price
    const deliveryPrice = product.category === 'Beer' 
      ? parseFloat((product.price + drsFee).toFixed(2))
      : product.price;
    
    const instorePrice = product.salePrice 
      ? (product.category === 'Beer' ? parseFloat((product.salePrice + drsFee).toFixed(2)) : product.salePrice)
      : deliveryPrice;
    
    return [
      itemId,
      product.name,
      product.description || '',
      deliveryPrice.toFixed(2),
      instorePrice.toFixed(2),
      '0', // tax_rate
      '', // allergens
      '', // calories
      'false', // hfss
      '', // max_quantity
      'true', // age_restricted (all alcohol products)
      '', // plu
      '', // barcodes
      '', // ian
      '', // classifications
      'true', // replacement_eligible
      'true', // substitution_eligible
      product.name, // internal_name
      '', // dietary_information
      '', // returnable
      drsFee > 0 ? drsFee.toFixed(2) : '', // irish_drs_deposit_fee
      drsItemsPerPack || '', // irish_drs_items_per_pack
      // Additional fields
      product.category || '',
      product.country || '',
      product.region || '',
      product.producer || '',
      product.wineType || '',
      product.spiritType || '',
      product.beerStyle || '',
      product.abv ? product.abv.toString() : '',
      product.volumeMl ? product.volumeMl.toString() : '',
      product.image || '',
      product.featured ? 'true' : 'false',
      product.new ? 'true' : 'false',
      product.onSale ? 'true' : 'false',
      product.stock ? product.stock.toString() : '0'
    ];
  });
  
  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
  const csvLines = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ];
  
  return csvLines.join('\n');
}

// Main function
async function main() {
  const deliverooCsvPath = process.argv[2] || path.join(__dirname, '../deliveroo-export.csv');
  
  if (!fs.existsSync(deliverooCsvPath)) {
    console.error(`❌ Deliveroo CSV file not found: ${deliverooCsvPath}`);
    console.error(`💡 Usage: node scripts/convert-deliveroo-to-products.js <deliveroo-csv-path>`);
    process.exit(1);
  }
  
  console.log(`📖 Reading Deliveroo CSV from: ${deliverooCsvPath}`);
  const deliverooCsvContent = fs.readFileSync(deliverooCsvPath, 'utf-8');
  const deliverooRows = parseDeliverooCSV(deliverooCsvContent);
  console.log(`✅ Parsed ${deliverooRows.length} products from Deliveroo CSV`);
  
  // Fetch existing products from database
  console.log('🔄 Fetching existing products from database...');
  try {
    let fetchFn;
    try {
      fetchFn = globalThis.fetch || fetch;
    } catch {
      fetchFn = (await import('node-fetch')).default;
    }
    
    const response = await fetchFn('http://localhost:3000/api/products?full=true');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const existingProducts = await response.json();
    console.log(`✅ Found ${existingProducts.length} existing products in database`);
    
    // Process each Deliveroo product
    const convertedProducts = [];
    let matchedCount = 0;
    let unmatchedCount = 0;
    
    for (const deliverooRow of deliverooRows) {
      const deliverooName = deliverooRow.item_name || deliverooRow.internal_name || '';
      const existingProduct = findMatchingProduct(deliverooName, existingProducts);
      
      let product;
      
      if (existingProduct) {
        // Use existing product data, update price from Deliveroo
        product = {
          item_id: deliverooRow.item_id || '',
          name: existingProduct.name, // Use database name (more accurate)
          description: existingProduct.description || deliverooRow.item_description || '',
          price: parseFloat(deliverooRow.delivery_price) || existingProduct.price,
          salePrice: deliverooRow.instore_price ? parseFloat(deliverooRow.instore_price) : (existingProduct.onSale ? existingProduct.salePrice : undefined),
          category: existingProduct.category,
          country: existingProduct.country,
          region: existingProduct.region,
          producer: existingProduct.producer,
          wineType: existingProduct.wineType,
          spiritType: existingProduct.spiritType,
          beerStyle: existingProduct.beerStyle,
          abv: existingProduct.abv,
          volumeMl: existingProduct.volumeMl,
          image: existingProduct.image || '',
          featured: existingProduct.featured || false,
          new: existingProduct.new || false,
          onSale: existingProduct.onSale || false,
          stock: existingProduct.stock || 0,
        };
        matchedCount++;
      } else {
        // New product - use Deliveroo data and infer category
        const category = determineCategory(deliverooName);
        
        product = {
          item_id: deliverooRow.item_id || '',
          name: deliverooName,
          description: deliverooRow.item_description || '',
          price: parseFloat(deliverooRow.delivery_price) || 0,
          salePrice: deliverooRow.instore_price ? parseFloat(deliverooRow.instore_price) : undefined,
          category: category,
          country: '', // Will need to be filled manually
          region: '',
          producer: '',
          wineType: undefined,
          spiritType: undefined,
          beerStyle: undefined,
          abv: undefined,
          volumeMl: undefined,
          image: '',
          featured: false,
          new: true, // Mark as new
          onSale: false,
          stock: 0,
        };
        unmatchedCount++;
      }
      
      // Store DRS fee separately (will be added to price in CSV output)
      product.drsFee = calculateDRSFee(product.category, product.volumeMl);
      
      convertedProducts.push(product);
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Matched with database: ${matchedCount} products`);
    console.log(`🆕 New products (from Deliveroo only): ${unmatchedCount} products`);
    console.log(`📦 Total products: ${convertedProducts.length}`);
    
    // Convert to Deliveroo CSV format
    const outputCsv = convertToDeliverooFormat(convertedProducts);
    
    // Save to file
    const outputPath = path.join(__dirname, '../products-deliveroo-format.csv');
    fs.writeFileSync(outputPath, outputCsv, 'utf-8');
    console.log(`\n💾 Saved ${convertedProducts.length} products to: ${outputPath}`);
    console.log(`\n✅ CSV is ready for Deliveroo import!`);
    console.log(`\n📝 Note: Products marked as "new" may need manual updates for:`);
    console.log(`   - Country, Region, Producer`);
    console.log(`   - Wine Type, Spirit Type, Beer Style`);
    console.log(`   - ABV, Volume (ml)`);
    console.log(`   - Image URL`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure the Next.js dev server is running (npm run dev)');
    process.exit(1);
  }
}

main();

