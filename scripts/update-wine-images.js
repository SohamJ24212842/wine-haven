/**
 * Script to update wine-list-transformed.json with image paths
 * 
 * Usage:
 * 1. Place all wine images in public/wines/ folder
 * 2. Run: node scripts/update-wine-images.js
 * 
 * This script will:
 * - Read wine-list-transformed.json
 * - Generate slug from wine name
 * - Match to image files in public/wines/
 * - Update the JSON with correct image paths
 */

const fs = require('fs');
const path = require('path');

// Slugify function (matches the one in text.ts)
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

// Get all image files from public/wines/
const winesDir = path.join(__dirname, '../public/wines');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

function getImageFiles() {
  if (!fs.existsSync(winesDir)) {
    console.log('⚠️  public/wines/ directory does not exist!');
    return [];
  }
  
  const files = fs.readdirSync(winesDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
}

// Find matching image for a wine name
function findImageForWine(wineName, imageFiles) {
  const slug = slugify(wineName);
  
  // Try exact match first
  for (const file of imageFiles) {
    const fileBase = path.basename(file, path.extname(file));
    if (fileBase === slug) {
      return `/wines/${file}`;
    }
  }
  
  // Try partial match (in case of slight naming differences)
  for (const file of imageFiles) {
    const fileBase = path.basename(file, path.extname(file));
    if (fileBase.includes(slug) || slug.includes(fileBase)) {
      console.log(`  ⚠️  Partial match: "${wineName}" → "${file}"`);
      return `/wines/${file}`;
    }
  }
  
  return null;
}

// Main function
function updateWineImages() {
  const jsonPath = path.join(__dirname, '../wine-list-transformed.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.log('❌ wine-list-transformed.json not found!');
    console.log('   Please place it in the root directory.');
    return;
  }
  
  console.log('📖 Reading wine-list-transformed.json...');
  const wines = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log('🖼️  Scanning public/wines/ for images...');
  const imageFiles = getImageFiles();
  console.log(`   Found ${imageFiles.length} image files`);
  
  if (imageFiles.length === 0) {
    console.log('⚠️  No images found! Please upload images to public/wines/ first.');
    return;
  }
  
  console.log('\n🔄 Updating image paths...\n');
  
  let updated = 0;
  let missing = [];
  
  wines.forEach((wine, index) => {
    const imagePath = findImageForWine(wine.name, imageFiles);
    
    if (imagePath) {
      wine.image = imagePath;
      updated++;
      console.log(`✅ [${index + 1}/${wines.length}] ${wine.name}`);
    } else {
      missing.push(wine.name);
      console.log(`❌ [${index + 1}/${wines.length}] ${wine.name} - NO MATCH`);
    }
  });
  
  // Save updated JSON
  fs.writeFileSync(jsonPath, JSON.stringify(wines, null, 2), 'utf8');
  
  console.log('\n📊 Summary:');
  console.log(`   ✅ Updated: ${updated}/${wines.length}`);
  console.log(`   ❌ Missing: ${missing.length}/${wines.length}`);
  
  if (missing.length > 0) {
    console.log('\n⚠️  Wines without matching images:');
    missing.forEach(name => console.log(`   - ${name}`));
    console.log('\n💡 Tip: Check if image filenames match the wine names (slugified)');
  }
  
  console.log('\n✅ Done! Updated wine-list-transformed.json');
}

// Run the script
updateWineImages();

