// Script to clean up spirit descriptions - remove repetitive "Description" header
const fs = require('fs');

const spirits = JSON.parse(fs.readFileSync('spirits-list.json', 'utf8'));

let updated = 0;

spirits.forEach((spirit, i) => {
  if (spirit.description) {
    let desc = spirit.description;
    
    // Remove "Description\n\n" at the start if it exists
    if (desc.startsWith('Description\n\n')) {
      desc = desc.substring('Description\n\n'.length);
      spirit.description = desc;
      updated++;
    }
    
    // Also handle "Description\n" (single newline)
    if (desc.startsWith('Description\n')) {
      desc = desc.substring('Description\n'.length);
      spirit.description = desc;
      updated++;
    }
  }
});

if (updated > 0) {
  fs.writeFileSync('spirits-list.json', JSON.stringify(spirits, null, 2));
  console.log(`✅ Cleaned ${updated} descriptions`);
  console.log('✅ Updated spirits-list.json');
} else {
  console.log('ℹ️  No descriptions needed cleaning');
}




