/**
 * Generate filename list from wine-list-transformed.json
 * Run: node scripts/generate-filename-list.js
 */

const fs = require('fs');
const path = require('path');

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

const jsonPath = path.join(__dirname, '../wine-list-transformed.json');

if (!fs.existsSync(jsonPath)) {
  console.log('❌ wine-list-transformed.json not found!');
  process.exit(1);
}

const wines = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`# Filename List for ${wines.length} Wines\n`);
console.log('Copy these exact filenames when renaming your photos:\n');

wines.forEach((wine, index) => {
  const filename = `${slugify(wine.name)}.jpg`;
  console.log(`${index + 1}. ${filename}`);
});

console.log(`\n✅ Total: ${wines.length} wines`);
console.log('\n📁 Upload all photos to: wine-haven-next/public/wines/');

