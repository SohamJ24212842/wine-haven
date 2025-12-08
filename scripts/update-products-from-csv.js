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

// Enhanced description generation with tasting notes, food pairings, and rich language
function generateDescription(csvRow, existingProduct) {
  // If existing product has a good description, preserve it
  let description = existingProduct?.description || '';
  
  // If description is empty or minimal, create a rich one
  if (!description || description.trim().length < 50) {
    const name = csvRow.Name.toLowerCase();
    const wineType = csvRow['Wine Type']?.toLowerCase() || '';
    const spiritType = csvRow['Spirit Type']?.toLowerCase() || '';
    const beerStyle = csvRow['Beer Style']?.toLowerCase() || '';
    const region = csvRow.Region || '';
    const country = csvRow.Country || '';
    const producer = csvRow.Producer || '';
    const updatedPrice = updatePrice(csvRow.Price, csvRow.Category);
    
    if (csvRow.Category === 'Wine') {
      description = generateWineDescription(csvRow, name, wineType, region, country, producer, updatedPrice);
    } else if (csvRow.Category === 'Spirit') {
      description = generateSpiritDescription(csvRow, name, spiritType, country, producer, updatedPrice);
    } else if (csvRow.Category === 'Beer') {
      description = generateBeerDescription(csvRow, name, beerStyle, country, producer, updatedPrice);
    }
  } else {
    // Existing description - just ensure price is mentioned if it's a pack/gift box
    const name = csvRow.Name.toLowerCase();
    const updatedPrice = updatePrice(csvRow.Price, csvRow.Category);
    
    if ((name.includes('gift box') || name.includes('pack') || name.includes('variety pack') || 
         name.includes('4-pack') || name.includes('discovery box')) &&
        !description.includes('€') && !description.includes('price')) {
      description += ` Available at €${updatedPrice}.`;
    }
  }
  
  return description.trim();
}

// Generate rich wine descriptions
function generateWineDescription(csvRow, name, wineType, region, country, producer, price) {
  const parts = [];
  const tastingNotes = [];
  const foodPairings = [];
  
  // Base description with region/producer
  if (wineType === 'sparkling' || wineType === 'prosecco' || name.includes('champagne') || name.includes('brut') || name.includes('cuvée')) {
    parts.push('Elegant and refined');
    if (region && region.toLowerCase() === 'champagne') {
      parts.push('Champagne');
    } else if (wineType === 'prosecco') {
      parts.push('Prosecco');
    } else {
      parts.push('sparkling wine');
    }
    tastingNotes.push('fine bubbles', 'crisp acidity', 'citrus notes', 'green apple', 'toast');
    foodPairings.push('seafood', 'oysters', 'celebrations', 'aperitifs');
  } else if (wineType === 'red' || name.includes('red')) {
    parts.push('Rich and full-bodied');
    if (region) {
      if (region.toLowerCase().includes('bordeaux')) {
        parts.push('Bordeaux');
        tastingNotes.push('cassis', 'cedar', 'fine-grained tannins', 'blackcurrant');
        foodPairings.push('roast meats', 'aged cheeses', 'lamb');
      } else if (region.toLowerCase().includes('rioja')) {
        parts.push('Rioja');
        tastingNotes.push('ripe cherry', 'vanilla', 'sweet spice', 'American oak');
        foodPairings.push('tapas', 'chorizo', 'manchego cheese');
      } else if (region.toLowerCase().includes('tuscany') || region.toLowerCase().includes('chianti')) {
        parts.push('Tuscan red');
        tastingNotes.push('sour cherry', 'leather', 'savoury notes', 'herbs');
        foodPairings.push('pasta', 'tomato-based dishes', 'grilled meats');
      } else if (region.toLowerCase().includes('mendoza') || country.toLowerCase() === 'argentina') {
        parts.push('Argentine red');
        tastingNotes.push('blackberry', 'plum', 'cocoa', 'smooth finish');
        foodPairings.push('steak', 'barbecue', 'grilled meats');
      } else {
        parts.push('red wine');
        tastingNotes.push('dark fruits', 'spice', 'balanced tannins');
        foodPairings.push('red meats', 'pasta', 'cheese');
      }
    } else {
      parts.push('red wine');
      tastingNotes.push('dark fruits', 'spice', 'balanced tannins');
      foodPairings.push('red meats', 'pasta', 'cheese');
    }
  } else if (wineType === 'white' || name.includes('white') || name.includes('chardonnay') || name.includes('sauvignon')) {
    parts.push('Crisp and refreshing');
    if (name.includes('chardonnay')) {
      parts.push('Chardonnay');
      tastingNotes.push('green apple', 'citrus', 'buttery notes', 'oak');
      foodPairings.push('chicken', 'seafood', 'creamy sauces');
    } else if (name.includes('sauvignon')) {
      parts.push('Sauvignon Blanc');
      tastingNotes.push('zesty citrus', 'passionfruit', 'fresh-cut herbs', 'gooseberry');
      foodPairings.push('goat cheese', 'seafood', 'salads');
    } else if (name.includes('albariño') || name.includes('albarino')) {
      parts.push('Albariño');
      tastingNotes.push('sea-breeze minerality', 'peach', 'lime', 'citrus');
      foodPairings.push('seafood', 'shellfish', 'tapas');
    } else {
      parts.push('white wine');
      tastingNotes.push('citrus', 'stone fruits', 'crisp acidity');
      foodPairings.push('seafood', 'poultry', 'light dishes');
    }
  } else if (wineType === 'rosé' || name.includes('rosé') || name.includes('rose')) {
    parts.push('Delicate and elegant');
    parts.push('rosé');
    tastingNotes.push('strawberry', 'raspberry', 'floral notes', 'mineral finish');
    foodPairings.push('salads', 'light seafood', 'summer dishes', 'aperitifs');
  } else if (name.includes('porto') || name.includes('port')) {
    parts.push('Rich and luscious');
    parts.push('Port');
    tastingNotes.push('dark fruits', 'caramel', 'spice', 'sweet finish');
    foodPairings.push('blue cheese', 'chocolate', 'desserts');
  } else if (name.includes('sherry')) {
    parts.push('Complex and nutty');
    parts.push('Sherry');
    tastingNotes.push('almond', 'caramel', 'oxidative notes');
    foodPairings.push('tapas', 'nuts', 'cured meats');
  } else {
    parts.push('Premium wine');
  }
  
  // Add origin
  if (region && country) {
    parts.push(`from the renowned ${region} region in ${country}`);
  } else if (country) {
    parts.push(`from ${country}`);
  }
  
  // Add producer
  if (producer) {
    parts.push(`crafted by ${producer}`);
  }
  
  // Build full description
  let fullDesc = parts.join(' ') + '. ';
  
  // Add tasting notes
  if (tastingNotes.length > 0) {
    const notes = tastingNotes.slice(0, 3).join(', ');
    fullDesc += `Features notes of ${notes}. `;
  }
  
  // Add food pairing
  if (foodPairings.length > 0) {
    const pairing = foodPairings[0];
    fullDesc += `Perfect with ${pairing}.`;
  }
  
  return fullDesc;
}

// Generate rich spirit descriptions
function generateSpiritDescription(csvRow, name, spiritType, country, producer, price) {
  const parts = [];
  const tastingNotes = [];
  const servingSuggestions = [];
  
  if (spiritType === 'whiskey' || spiritType === 'whisky' || name.includes('whiskey') || name.includes('whisky')) {
    if (name.includes('irish') || country.toLowerCase() === 'ireland') {
      parts.push('Smooth and approachable');
      parts.push('Irish whiskey');
      tastingNotes.push('honey', 'vanilla', 'smooth finish', 'light spice');
      servingSuggestions.push('neat', 'on the rocks', 'in cocktails');
    } else if (name.includes('scotch') || name.includes('scotch') || country.toLowerCase() === 'scotland') {
      parts.push('Complex and peaty');
      parts.push('Scotch whisky');
      tastingNotes.push('smoke', 'peat', 'caramel', 'oak');
      servingSuggestions.push('neat', 'with a drop of water');
    } else if (name.includes('bourbon') || name.includes('tennessee')) {
      parts.push('Rich and bold');
      parts.push('American whiskey');
      tastingNotes.push('vanilla', 'caramel', 'oak', 'sweet corn');
      servingSuggestions.push('neat', 'in cocktails', 'on the rocks');
    } else {
      parts.push('Premium whiskey');
      tastingNotes.push('complex', 'smooth', 'well-balanced');
    }
  } else if (spiritType === 'gin' || name.includes('gin')) {
    parts.push('Botanical and aromatic');
    parts.push('gin');
    tastingNotes.push('juniper', 'citrus', 'herbs', 'botanicals');
    servingSuggestions.push('in a G&T', 'in cocktails', 'with tonic');
  } else if (spiritType === 'vodka' || name.includes('vodka')) {
    parts.push('Clean and smooth');
    parts.push('vodka');
    tastingNotes.push('crisp', 'neutral', 'smooth finish');
    servingSuggestions.push('in cocktails', 'on the rocks', 'in martinis');
  } else if (spiritType === 'tequila' || name.includes('tequila')) {
    parts.push('Authentic and vibrant');
    parts.push('tequila');
    if (name.includes('reposado')) {
      tastingNotes.push('agave', 'vanilla', 'oak', 'smooth');
    } else if (name.includes('añejo') || name.includes('anejo')) {
      tastingNotes.push('caramel', 'vanilla', 'oak', 'complex');
    } else {
      tastingNotes.push('agave', 'citrus', 'pepper', 'crisp');
    }
    servingSuggestions.push('in margaritas', 'neat', 'with lime');
  } else if (spiritType === 'rum' || name.includes('rum')) {
    parts.push('Rich and warming');
    parts.push('rum');
    tastingNotes.push('caramel', 'vanilla', 'spice', 'smooth');
    servingSuggestions.push('in cocktails', 'neat', 'with cola');
  } else if (spiritType === 'liqueur' || name.includes('liqueur') || name.includes('cognac')) {
    parts.push('Smooth and elegant');
    if (name.includes('cognac')) {
      parts.push('Cognac');
      tastingNotes.push('dried fruits', 'oak', 'spice', 'smooth');
    } else {
      parts.push('liqueur');
      tastingNotes.push('sweet', 'aromatic', 'smooth');
    }
    servingSuggestions.push('neat', 'in cocktails', 'as a digestif');
  } else {
    parts.push('Premium spirit');
  }
  
  // Add origin
  if (country) {
    parts.push(`from ${country}`);
  }
  
  // Add producer
  if (producer) {
    parts.push(`by ${producer}`);
  }
  
  // Add ABV and volume
  if (csvRow.ABV) {
    parts.push(`at ${csvRow.ABV}% ABV`);
  }
  if (csvRow['Volume (ml)']) {
    parts.push(`(${csvRow['Volume (ml)']}ml)`);
  }
  
  // Build full description
  let fullDesc = parts.join(' ') + '. ';
  
  // Add tasting notes
  if (tastingNotes.length > 0) {
    const notes = tastingNotes.slice(0, 3).join(', ');
    fullDesc += `Features ${notes}. `;
  }
  
  // Add serving suggestion
  if (servingSuggestions.length > 0) {
    fullDesc += `Best enjoyed ${servingSuggestions[0]}.`;
  }
  
  return fullDesc;
}

// Generate rich beer descriptions
function generateBeerDescription(csvRow, name, beerStyle, country, producer, price) {
  const parts = [];
  const tastingNotes = [];
  const foodPairings = [];
  
  if (beerStyle === 'ipa' || name.includes('ipa')) {
    parts.push('Bold and hoppy');
    parts.push('IPA');
    tastingNotes.push('citrus', 'pine', 'tropical fruits', 'bitter finish');
    foodPairings.push('spicy foods', 'burgers', 'curries');
  } else if (beerStyle === 'lager' || name.includes('lager')) {
    parts.push('Crisp and refreshing');
    parts.push('lager');
    tastingNotes.push('clean', 'light', 'crisp', 'refreshing');
    foodPairings.push('pizza', 'grilled foods', 'light meals');
  } else if (beerStyle === 'wheat beer' || name.includes('weissbier') || name.includes('wheat')) {
    parts.push('Light and fruity');
    parts.push('wheat beer');
    tastingNotes.push('banana', 'clove', 'citrus', 'cloudy');
    foodPairings.push('seafood', 'salads', 'light dishes');
  } else if (beerStyle === 'pilsner' || name.includes('pilsner')) {
    parts.push('Crisp and golden');
    parts.push('pilsner');
    tastingNotes.push('hops', 'clean', 'refreshing', 'light bitterness');
    foodPairings.push('sausages', 'grilled foods', 'pub fare');
  } else if (name.includes('ginger beer')) {
    parts.push('Spicy and refreshing');
    parts.push('ginger beer');
    tastingNotes.push('ginger', 'spice', 'refreshing', 'zesty');
    foodPairings.push('spicy foods', 'Asian cuisine', 'as a mixer');
  } else {
    parts.push('Premium beer');
    tastingNotes.push('balanced', 'flavorful', 'refreshing');
    foodPairings.push('pub fare', 'grilled foods');
  }
  
  // Add origin
  if (country) {
    parts.push(`from ${country}`);
  }
  
  // Add producer
  if (producer) {
    parts.push(`by ${producer}`);
  }
  
  // Add ABV
  if (csvRow.ABV) {
    parts.push(`with ${csvRow.ABV}% ABV`);
  }
  
  // Build full description
  let fullDesc = parts.join(' ') + '. ';
  
  // Add tasting notes
  if (tastingNotes.length > 0) {
    const notes = tastingNotes.slice(0, 3).join(', ');
    fullDesc += `Features ${notes}. `;
  }
  
  // Add food pairing
  if (foodPairings.length > 0) {
    fullDesc += `Perfect with ${foodPairings[0]}.`;
  }
  
  // Special handling for packs/gift boxes
  if (name.includes('gift box') || name.includes('pack') || name.includes('variety pack') || 
      name.includes('4-pack') || name.includes('discovery box')) {
    fullDesc += ` Available at €${price}.`;
  }
  
  return fullDesc;
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
    const newProducts = [];
    const matchedProducts = [];
    const unmatchedProducts = [];
    
    // Slugify function (simplified version)
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
        // Create new product for unmatched items
        unmatchedProducts.push(csvRow.Name);
        
        const newProduct = {
          slug: slugify(csvRow.Name),
          category: csvRow.Category,
          name: csvRow.Name,
          price: parseFloat(updatePrice(csvRow.Price, csvRow.Category)),
          description: generateDescription(csvRow, null), // Generate new description
          image: '', // Will need to be added later
          country: csvRow.Country || '',
          region: csvRow.Region || undefined,
          producer: csvRow.Producer || undefined,
          wineType: csvRow['Wine Type'] || undefined,
          spiritType: csvRow['Spirit Type'] || undefined,
          beerStyle: csvRow['Beer Style'] || undefined,
          abv: csvRow.ABV ? parseFloat(csvRow.ABV) : undefined,
          volumeMl: csvRow['Volume (ml)'] ? parseInt(csvRow['Volume (ml)']) : undefined,
          stock: 0,
          featured: false,
          new: true, // Mark as new product
          onSale: false,
          christmasGift: false,
        };
        
        newProducts.push(newProduct);
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Matched & Updated: ${matchedProducts.length} products`);
    console.log(`🆕 New Products: ${newProducts.length} products`);
    console.log(`📦 Total Products: ${updatedProducts.length + newProducts.length} products`);
    
    if (unmatchedProducts.length > 0) {
      console.log(`\n🆕 New products to be created (first 10):`);
      unmatchedProducts.slice(0, 10).forEach(name => console.log(`   - ${name}`));
    }
    
    // Show example of updated product
    if (updatedProducts.length > 0) {
      const example = updatedProducts[0];
      const csvExample = csvRows.find(r => normalizeName(r.Name) === normalizeName(example.name));
      const oldProduct = existingProducts.find(p => p.slug === example.slug);
      
      console.log(`\n📝 Example Updated Product:`);
      console.log(`   Product: ${example.name}`);
      console.log(`   Old Price: €${csvExample?.Price || oldProduct?.price || 'N/A'}`);
      console.log(`   New Price: €${example.price}`);
      console.log(`   Old Description: ${oldProduct?.description || 'Empty'}`);
      console.log(`   New Description: ${example.description.substring(0, 100)}...`);
    }
    
    // Show example of new product
    if (newProducts.length > 0) {
      const example = newProducts[0];
      console.log(`\n📝 Example New Product:`);
      console.log(`   Product: ${example.name}`);
      console.log(`   Price: €${example.price}`);
      console.log(`   Description: ${example.description.substring(0, 100)}...`);
      console.log(`   Slug: ${example.slug}`);
    }
    
    // Combine updated and new products
    const allProducts = [...updatedProducts, ...newProducts];
    
    // Save all products to JSON file
    const outputPath = path.join(__dirname, '../updated-products.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
    console.log(`\n💾 Saved ${allProducts.length} products to: ${outputPath}`);
    console.log(`   - ${updatedProducts.length} updated products`);
    console.log(`   - ${newProducts.length} new products`);
    console.log(`\n✅ Next step: Use the admin panel to bulk import this JSON file`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure the Next.js dev server is running (npm run dev)');
    process.exit(1);
  }
}

main();

