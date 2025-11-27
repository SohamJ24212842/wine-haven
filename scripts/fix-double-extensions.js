/**
 * Fix double extensions (.jpg.jpeg → .jpg) in public/wines/ folder
 * Run: node scripts/fix-double-extensions.js
 */

const fs = require('fs');
const path = require('path');

const winesDir = path.join(__dirname, '../public/wines');

if (!fs.existsSync(winesDir)) {
  console.log('❌ public/wines/ directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(winesDir);
const imageFiles = files.filter(f => f.toLowerCase().endsWith('.jpg.jpeg') || f.toLowerCase().endsWith('.jpeg.jpeg'));

if (imageFiles.length === 0) {
  console.log('✅ No files with double extensions found!');
  process.exit(0);
}

console.log(`🔧 Found ${imageFiles.length} files with double extensions\n`);

let renamed = 0;
imageFiles.forEach(file => {
  const oldPath = path.join(winesDir, file);
  // Remove the last .jpeg or .jpg
  const newName = file.replace(/\.(jpg|jpeg)\.(jpg|jpeg)$/i, '.jpg');
  const newPath = path.join(winesDir, newName);
  
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${file} → ${newName}`);
    renamed++;
  } catch (error) {
    console.error(`❌ Failed to rename ${file}: ${error.message}`);
  }
});

console.log(`\n✅ Done! Renamed ${renamed}/${imageFiles.length} files`);
console.log('💡 Now run: node scripts/update-wine-images.js');

