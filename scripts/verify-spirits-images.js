// Script to verify all spirit images exist in public/spirits/
const fs = require('fs');
const path = require('path');

const spirits = JSON.parse(fs.readFileSync('spirits-list.json', 'utf8'));
const spiritsDir = path.join(__dirname, '../public/spirits');

// Get all image files in public/spirits/
const imageFiles = new Set();
if (fs.existsSync(spiritsDir)) {
  const files = fs.readdirSync(spiritsDir);
  files.forEach(file => {
    imageFiles.add(file);
  });
}

let missingMain = [];
let missingGallery = [];
let foundMain = 0;
let foundGallery = 0;

spirits.forEach((spirit, index) => {
  // Check main image
  if (spirit.image) {
    const imageName = path.basename(spirit.image);
    if (imageFiles.has(imageName)) {
      foundMain++;
    } else {
      missingMain.push({
        product: spirit.name,
        image: spirit.image,
        expected: imageName
      });
    }
  }
  
  // Check gallery images
  if (spirit.images && Array.isArray(spirit.images)) {
    spirit.images.forEach(img => {
      const imageName = path.basename(img);
      if (imageFiles.has(imageName)) {
        foundGallery++;
      } else {
        missingGallery.push({
          product: spirit.name,
          image: img,
          expected: imageName
        });
      }
    });
  }
});

console.log('\n📊 Image Verification Results:\n');
console.log(`✅ Main images found: ${foundMain}/${spirits.length}`);
console.log(`✅ Gallery images found: ${foundGallery}`);

if (missingMain.length > 0) {
  console.log(`\n❌ Missing main images (${missingMain.length}):`);
  missingMain.forEach(({ product, expected }) => {
    console.log(`   - ${product}: ${expected}`);
  });
}

if (missingGallery.length > 0) {
  console.log(`\n❌ Missing gallery images (${missingGallery.length}):`);
  missingGallery.forEach(({ product, expected }) => {
    console.log(`   - ${product}: ${expected}`);
  });
}

if (missingMain.length === 0 && missingGallery.length === 0) {
  console.log('\n✅ All images are present!');
}

