// Script to copy missing images from spirits_list/missing to public/spirits/
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../spirits_list/missing');
const targetDir = path.join(__dirname, '../public/spirits');

// Images to copy (from the mapping)
const imagesToCopy = [
  'image00001.jpeg',
  'image00002.jpeg',
  'image00003.jpeg',
  'image00004.jpeg',
  'image00005.jpeg',
  'image00006.jpeg',
  'image00007.jpeg',
  'image00008.jpeg',
  'image00009.jpeg',
  'image00010.jpeg',
  'image00011.jpeg',
  'image00012.jpeg',
  'image00013.jpeg',
  'image00014.jpeg',
  'image00015.jpeg',
  'image00016.jpeg',
  'image00018.jpeg',
  'image00019.jpeg',
  'bb.jpg',
  'tt.jpg'
];

// Also copy image00026.jpeg if it's in the main spirits_list folder
const image00026Source = path.join(__dirname, '../../spirits_list/image00026.jpeg');
const image00026Target = path.join(targetDir, 'image00026.jpeg');

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Source directory not found: ${sourceDir}`);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`✅ Created target directory: ${targetDir}`);
}

let copied = 0;
let skipped = 0;
let errors = 0;

// Copy images from missing folder
imagesToCopy.forEach(filename => {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);
  
  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️  Source file not found: ${filename}`);
    errors++;
    return;
  }
  
  if (fs.existsSync(targetPath)) {
    console.log(`⏭️  Already exists: ${filename}`);
    skipped++;
    return;
  }
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied: ${filename}`);
    copied++;
  } catch (error) {
    console.error(`❌ Error copying ${filename}:`, error.message);
    errors++;
  }
});

// Copy image00026.jpeg from main spirits_list folder if it exists
if (fs.existsSync(image00026Source)) {
  if (!fs.existsSync(image00026Target)) {
    try {
      fs.copyFileSync(image00026Source, image00026Target);
      console.log(`✅ Copied: image00026.jpeg`);
      copied++;
    } catch (error) {
      console.error(`❌ Error copying image00026.jpeg:`, error.message);
      errors++;
    }
  } else {
    console.log(`⏭️  Already exists: image00026.jpeg`);
    skipped++;
  }
} else {
  console.log(`ℹ️  image00026.jpeg not found in spirits_list folder (may already be in public/spirits)`);
}

console.log('\n📊 Summary:');
console.log(`   ✅ Copied: ${copied}`);
console.log(`   ⏭️  Skipped (already exists): ${skipped}`);
console.log(`   ❌ Errors: ${errors}`);

