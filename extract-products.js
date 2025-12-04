const fs = require('fs');

// Read the spirits-list.json file
const data = JSON.parse(fs.readFileSync('spirits-list.json', 'utf8'));

// Extract product information
const products = data.map(p => ({
  name: p.name,
  category: p.category,
  type: p.spiritType || p.wineType || 'N/A',
  price: p.price,
  image: p.image,
  hasGallery: p.images && p.images.length > 0,
  galleryCount: p.images ? p.images.length : 0
}));

// Write to a text file
const output = products.map((p, index) => 
  `${index + 1}. ${p.name} (${p.category} - ${p.type}) - Price: €${p.price} - Has Gallery: ${p.hasGallery ? 'Yes (' + p.galleryCount + ')' : 'No'}`
).join('\n');

fs.writeFileSync('products-list.txt', output);
console.log(`Extracted ${products.length} products to products-list.txt`);

// Also create a JSON version for easier processing
fs.writeFileSync('products-list.json', JSON.stringify(products, null, 2));
console.log(`Also created products-list.json`);








