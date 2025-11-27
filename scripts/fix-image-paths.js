// Script to fix image paths in spirits-list.json based on mapping file
const fs = require('fs');
const path = require('path');

const spirits = JSON.parse(fs.readFileSync('spirits-list.json', 'utf8'));
const mappingFile = path.join(__dirname, '../image-mapping.json');

if (!fs.existsSync(mappingFile)) {
  console.error('❌ image-mapping.json not found!');
  console.log('📝 Please create image-mapping.json with the format:');
  console.log(JSON.stringify({
    "bushmills-2011-causeway-collection.jpg": "image00074.jpg",
    "other-missing-image.jpg": "actual-filename.jpg"
  }, null, 2));
  process.exit(1);
}

const mappings = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
let updated = 0;

spirits.forEach((spirit) => {
  // Fix main image
  if (spirit.image) {
    const imageName = path.basename(spirit.image);
    if (mappings[imageName]) {
      const oldPath = spirit.image;
      spirit.image = `/spirits/${mappings[imageName]}`;
      console.log(`✅ Fixed main image: ${imageName} → ${mappings[imageName]}`);
      console.log(`   Product: ${spirit.name}`);
      updated++;
    }
  }
  
  // Fix gallery images
  if (spirit.images && Array.isArray(spirit.images)) {
    spirit.images = spirit.images.map(img => {
      const imageName = path.basename(img);
      if (mappings[imageName]) {
        console.log(`✅ Fixed gallery image: ${imageName} → ${mappings[imageName]}`);
        console.log(`   Product: ${spirit.name}`);
        updated++;
        return `/spirits/${mappings[imageName]}`;
      }
      return img;
    });
  }
});

if (updated > 0) {
  fs.writeFileSync('spirits-list.json', JSON.stringify(spirits, null, 2));
  console.log(`\n✅ Updated ${updated} image paths in spirits-list.json`);
} else {
  console.log('ℹ️  No image paths needed updating');
}

