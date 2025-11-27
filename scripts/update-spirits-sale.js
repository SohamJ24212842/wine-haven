// Script to update all spirits to be on sale with 10% discount
const fs = require('fs');

const spirits = JSON.parse(fs.readFileSync('spirits-list.json', 'utf8'));

let updated = 0;

spirits.forEach((spirit) => {
  // Calculate 10% discount
  const salePrice = Math.round((spirit.price * 0.9) * 100) / 100;
  
  // Update sale fields
  spirit.onSale = true;
  spirit.salePrice = salePrice;
  
  updated++;
});

// Write back to file
fs.writeFileSync('spirits-list.json', JSON.stringify(spirits, null, 2));

console.log(`✅ Updated ${updated} spirits to be on sale with 10% discount`);
console.log(`   Sale price = original price × 0.9`);

