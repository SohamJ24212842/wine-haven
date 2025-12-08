// Script to update products from CSV with enhanced descriptions and updated prices
// Usage: node scripts/update-products-from-csv.js <csv-file-path>

const fs = require('fs');
const path = require('path');

// Price update rules
function updatePrice(price, category) {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;
  
  if (category === 'Beer') {
    return (numPrice + 2.5).toFixed(2);
  } else if (category === 'Wine') {
    if (numPrice < 20) {
      // Add 2-3 euros depending on product (add 3 for premium, 2 for others)
      // Premium wines: above 15 euros get 3, below get 2
      return (numPrice + (numPrice >= 15 ? 3 : 2)).toFixed(2);
    } else {
      // Wines above 20 euros: add 4 euros
      return (numPrice + 4).toFixed(2);
    }
  } else {
    // Spirits: no price change mentioned, keep as is
    return numPrice.toFixed(2);
  }
}

// Generate description based on product data
function generateDescription(csvRow, existingProduct) {
  // If existing product has a description, use it as base
  let description = existingProduct?.description || '';
  
  // If description is empty or minimal, create one
  if (!description || description.trim().length < 20) {
    const parts = [];
    
    // Add category-specific info
    if (csvRow.Category === 'Wine') {
      if (csvRow['Wine Type']) {
        parts.push(`A premium ${csvRow['Wine Type'].toLowerCase()} wine`);
      } else {
        parts.push('A premium wine');
      }
      
      if (csvRow.Region) {
        parts.push(`from the renowned ${csvRow.Region} region`);
      }
      
      if (csvRow.Country) {
        parts.push(`in ${csvRow.Country}`);
      }
      
      if (csvRow.Producer) {
        parts.push(`crafted by ${csvRow.Producer}`);
      }
      
      if (csvRow.ABV) {
        parts.push(`with ${csvRow.ABV}% ABV`);
      }
    } else if (csvRow.Category === 'Spirit') {
      if (csvRow['Spirit Type']) {
        parts.push(`A premium ${csvRow['Spirit Type'].toLowerCase()}`);
      } else {
        parts.push('A premium spirit');
      }
      
      if (csvRow.Country) {
        parts.push(`from ${csvRow.Country}`);
      }
      
      if (csvRow.Producer) {
        parts.push(`by ${csvRow.Producer}`);
      }
      
      if (csvRow.ABV) {
        parts.push(`at ${csvRow.ABV}% ABV`);
      }
      
      if (csvRow['Volume (ml)']) {
        parts.push(`(${csvRow['Volume (ml)']}ml)`);
      }
    } else if (csvRow.Category === 'Beer') {
      if (csvRow['Beer Style']) {
        parts.push(`A premium ${csvRow['Beer Style']} beer`);
      } else {
        parts.push('A premium beer');
      }
      
      if (csvRow.Country) {
        parts.push(`from ${csvRow.Country}`);
      }
      
      if (csvRow.Producer) {
        parts.push(`by ${csvRow.Producer}`);
      }
      
      if (csvRow.ABV) {
        parts.push(`with ${csvRow.ABV}% ABV`);
      }
    }
    
    description = parts.join(' ') + '.';
    
    // Add price information if multiple products are mentioned in name
    // Check if name contains multiple product indicators
    const name = csvRow.Name;
    const price = parseFloat(csvRow.Price);
    const updatedPrice = updatePrice(csvRow.Price, csvRow.Category);
    
    // Check for gift boxes, packs, etc.
    if (name.toLowerCase().includes('gift box') || 
        name.toLowerCase().includes('pack') ||
        name.toLowerCase().includes('variety pack') ||
        name.toLowerCase().includes('4-pack') ||
        name.toLowerCase().includes('discovery box')) {
      description += ` Available at €${updatedPrice}.`;
    } else {
      description += ` Priced at €${updatedPrice}.`;
    }
  } else {
    // Existing description - check if it mentions multiple products
    // If it does, add price info
    const name = csvRow.Name;
    const updatedPrice = updatePrice(csvRow.Price, csvRow.Category);
    
    if (name.toLowerCase().includes('gift box') || 
        name.toLowerCase().includes('pack') ||
        name.toLowerCase().includes('variety pack') ||
        name.toLowerCase().includes('4-pack') ||
        name.toLowerCase().includes('discovery box')) {
      // Check if price is already mentioned
      if (!description.includes('€') && !description.includes('price')) {
        description += ` Available at €${updatedPrice}.`;
      }
    }
  }
  
  return description.trim();
}

// Normalize name for matching
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fuzzy match products
function findMatchingProduct(csvRow, existingProducts) {
  const csvName = normalizeName(csvRow.Name);
  
  // Try exact match first
  let match = existingProducts.find(p => 
    normalizeName(p.name) === csvName
  );
  
  if (match) return match;
  
  // Try partial match (CSV name contains product name or vice versa)
  match = existingProducts.find(p => {
    const productName = normalizeName(p.name);
    return csvName.includes(productName) || productName.includes(csvName);
  });
  
  if (match) return match;
  
  // Try matching by key words (producer + type)
  if (csvRow.Producer) {
    const producer = normalizeName(csvRow.Producer);
    const type = csvRow['Wine Type'] || csvRow['Spirit Type'] || csvRow['Beer Style'] || '';
    
    match = existingProducts.find(p => {
      const pName = normalizeName(p.name);
      const pProducer = p.producer ? normalizeName(p.producer) : '';
      const pType = p.wineType || p.spiritType || p.beerStyle || '';
      
      return (producer && pProducer && pProducer.includes(producer)) ||
             (type && pType && normalizeName(pType).includes(normalizeName(type)));
    });
  }
  
  return match;
}

// Parse CSV
function parseCSV(csvContent) {
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
    
    if (row.Name) {
      rows.push(row);
    }
  }
  
  return rows;
}

// Main function
async function main() {
  const csvPath = process.argv[2] || path.join(__dirname, '../products-import.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }
  
  console.log(`📖 Reading CSV from: ${csvPath}`);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const csvRows = parseCSV(csvContent);
  console.log(`✅ Parsed ${csvRows.length} products from CSV`);
  
  // Fetch existing products from API
  console.log('🔄 Fetching existing products from database...');
  try {
    // Use built-in fetch (Node.js 18+) or node-fetch
    let fetchFn;
    try {
      // Try built-in fetch first (Node.js 18+)
      fetchFn = globalThis.fetch || fetch;
    } catch {
      // Fallback to node-fetch
      fetchFn = (await import('node-fetch')).default;
    }
    
    const response = await fetchFn('http://localhost:3000/api/products?full=true');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const existingProducts = await response.json();
    console.log(`✅ Found ${existingProducts.length} existing products`);
    
    // Process each CSV row
    const updatedProducts = [];
    const matchedProducts = [];
    const unmatchedProducts = [];
    
    for (const csvRow of csvRows) {
      const existingProduct = findMatchingProduct(csvRow, existingProducts);
      
      if (existingProduct) {
        matchedProducts.push({
          csv: csvRow.Name,
          existing: existingProduct.name,
        });
        
        // Update product
        const updatedProduct = {
          ...existingProduct,
          price: parseFloat(updatePrice(csvRow.Price, csvRow.Category)),
          description: generateDescription(csvRow, existingProduct),
        };
        
        // Update other fields from CSV if they're missing
        if (!updatedProduct.region && csvRow.Region) {
          updatedProduct.region = csvRow.Region;
        }
        if (!updatedProduct.producer && csvRow.Producer) {
          updatedProduct.producer = csvRow.Producer;
        }
        if (!updatedProduct.wineType && csvRow['Wine Type']) {
          updatedProduct.wineType = csvRow['Wine Type'];
        }
        if (!updatedProduct.spiritType && csvRow['Spirit Type']) {
          updatedProduct.spiritType = csvRow['Spirit Type'];
        }
        if (!updatedProduct.beerStyle && csvRow['Beer Style']) {
          updatedProduct.beerStyle = csvRow['Beer Style'];
        }
        if (!updatedProduct.abv && csvRow.ABV) {
          updatedProduct.abv = parseFloat(csvRow.ABV);
        }
        if (!updatedProduct.volumeMl && csvRow['Volume (ml)']) {
          updatedProduct.volumeMl = parseInt(csvRow['Volume (ml)']);
        }
        
        updatedProducts.push(updatedProduct);
      } else {
        unmatchedProducts.push(csvRow.Name);
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Matched: ${matchedProducts.length} products`);
    console.log(`❌ Unmatched: ${unmatchedProducts.length} products`);
    
    if (unmatchedProducts.length > 0) {
      console.log(`\n⚠️  Unmatched products (first 10):`);
      unmatchedProducts.slice(0, 10).forEach(name => console.log(`   - ${name}`));
    }
    
    // Show example
    if (updatedProducts.length > 0) {
      const example = updatedProducts[0];
      const csvExample = csvRows.find(r => normalizeName(r.Name) === normalizeName(example.name));
      
      console.log(`\n📝 Example Update:`);
      console.log(`   Product: ${example.name}`);
      console.log(`   Old Price: €${csvExample?.Price || 'N/A'}`);
      console.log(`   New Price: €${example.price}`);
      console.log(`   Old Description: ${existingProducts.find(p => p.slug === example.slug)?.description || 'Empty'}`);
      console.log(`   New Description: ${example.description}`);
    }
    
    // Save updated products to JSON file
    const outputPath = path.join(__dirname, '../updated-products.json');
    fs.writeFileSync(outputPath, JSON.stringify(updatedProducts, null, 2));
    console.log(`\n💾 Saved ${updatedProducts.length} updated products to: ${outputPath}`);
    console.log(`\n✅ Next step: Use the admin panel to bulk import this JSON file`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure the Next.js dev server is running (npm run dev)');
    process.exit(1);
  }
}

main();

