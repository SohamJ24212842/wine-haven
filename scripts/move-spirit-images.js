// Script to move and rename spirit images from spirits_list/ to public/spirits/
const fs = require('fs');
const path = require('path');

const spiritsList = JSON.parse(fs.readFileSync(path.join(__dirname, '../../spirits_list/image-mappings.json'), 'utf8'));
const spiritsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../spirits-list.json'), 'utf8'));

// Create public/spirits directory if it doesn't exist
const targetDir = path.join(__dirname, '../public/spirits');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Helper function to generate slug from product name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/ñ/g, 'n')
    .replace(/é/g, 'e')
    .replace(/á/g, 'a')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ç/g, 'c');
}

// Create a map of product name to image paths from JSON
const productImageMap = new Map();
spiritsJson.forEach(product => {
  productImageMap.set(product.name, {
    main: product.image,
    gallery: product.images || []
  });
});

// Track which images we've copied
const copiedImages = new Set();
let mainCopied = 0;
let galleryCopied = 0;
let skipped = 0;

// Process each image mapping
Object.entries(spiritsList).forEach(([imageFile, mapping]) => {
  const sourcePath = path.join(__dirname, '../../spirits_list', imageFile);
  
  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️  Source image not found: ${imageFile}`);
    skipped++;
    return;
  }

  const productName = mapping.product;
  const imageType = mapping.type; // 'main' or 'gallery'
  
  // Get the expected image path from JSON
  const productImages = productImageMap.get(productName);
  if (!productImages) {
    console.warn(`⚠️  Product not found in JSON: ${productName}`);
    skipped++;
    return;
  }

  let targetFilename;
  let targetPath;

  if (imageType === 'main') {
    // Main image - use the image path from JSON
    const imagePath = productImages.main;
    if (!imagePath) {
      console.warn(`⚠️  No main image path for: ${productName}`);
      skipped++;
      return;
    }
    // Extract filename from path like "/spirits/slane-irish-whiskey.jpg"
    targetFilename = path.basename(imagePath);
    targetPath = path.join(targetDir, targetFilename);
    
    // Check if already copied
    if (copiedImages.has(targetPath)) {
      console.log(`⏭️  Skipping duplicate main image: ${targetFilename} (${productName})`);
      skipped++;
      return;
    }
    
    mainCopied++;
  } else {
    // Gallery image - need to find which gallery image this is
    const galleryImages = productImages.gallery || [];
    if (galleryImages.length === 0) {
      console.warn(`⚠️  No gallery images for: ${productName}`);
      skipped++;
      return;
    }
    
    // For gallery images, we need to match by index or use a naming convention
    // Since we don't have exact mapping, we'll use the image filename as a base
    // and append a suffix if needed
    const baseSlug = generateSlug(productName);
    const ext = path.extname(imageFile);
    
    // Try to find matching gallery path
    // If gallery has only one image, use it
    if (galleryImages.length === 1) {
      targetFilename = path.basename(galleryImages[0]);
    } else {
      // Multiple gallery images - use index or generate name
      // We'll use a pattern: product-slug-gallery-N.ext
      const galleryIndex = galleryImages.findIndex(img => {
        // Try to match by checking if the image file number matches
        const imgNum = imageFile.match(/\d+/)?.[0];
        return img.includes(imgNum) || img.includes(imageFile.replace('.jpeg', ''));
      });
      
      if (galleryIndex >= 0) {
        targetFilename = path.basename(galleryImages[galleryIndex]);
      } else {
        // Generate a name based on product and image number
        const imgNum = imageFile.match(/\d+/)?.[0] || '1';
        targetFilename = `${baseSlug}-gallery-${imgNum}${ext}`;
      }
    }
    
    targetPath = path.join(targetDir, targetFilename);
    
    if (copiedImages.has(targetPath)) {
      console.log(`⏭️  Skipping duplicate gallery image: ${targetFilename} (${productName})`);
      skipped++;
      return;
    }
    
    galleryCopied++;
  }

  // Copy the file
  try {
    fs.copyFileSync(sourcePath, targetPath);
    copiedImages.add(targetPath);
    console.log(`✅ Copied ${imageType}: ${imageFile} → ${targetFilename} (${productName})`);
  } catch (error) {
    console.error(`❌ Error copying ${imageFile}:`, error.message);
    skipped++;
  }
});

// Also copy the 500.jpg and 700.jpg files if they exist
const specialFiles = ['500.jpg', '700.jpg'];
specialFiles.forEach(filename => {
  const sourcePath = path.join(__dirname, '../../spirits_list', filename);
  const targetPath = path.join(targetDir, filename);
  
  if (fs.existsSync(sourcePath)) {
    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied special file: ${filename}`);
    } else {
      console.log(`⏭️  Already exists: ${filename}`);
    }
  }
});

console.log('\n📊 Summary:');
console.log(`   Main images copied: ${mainCopied}`);
console.log(`   Gallery images copied: ${galleryCopied}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Total processed: ${mainCopied + galleryCopied + skipped}`);

