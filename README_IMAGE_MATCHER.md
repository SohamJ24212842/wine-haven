# Image Matcher Tool - Quick Start Guide

## What This Tool Does

This interactive HTML tool helps you quickly match the 98 spirit images to your 83 products without having to manually write everything down.

## How to Use

1. **Open the tool**: 
   - Open `image-matcher.html` in your web browser
   - Make sure `products-list.json` is in the same folder

2. **View an image**:
   - The current image from `spirits_list` folder is displayed on the left
   - Use "Previous" and "Next" buttons to navigate through all 98 images

3. **Match an image to a product**:
   - Look at the image and identify which product it is
   - Search for the product in the list on the right (type to filter)
   - Click on the product to select it
   - Click "Match as Main Image" or "Match as Gallery Image"
   - The tool will record the mapping

4. **Mark new products**:
   - If an image shows a product NOT in your list, click "New Product"
   - This marks it for later identification

5. **Export results**:
   - Once you've matched all images, click "Export Results (JSON)" or "Export Results (CSV)"
   - This creates a file with all your mappings

## Features

- ✅ Visual image display
- ✅ Search/filter products
- ✅ Track progress (matched vs remaining)
- ✅ Export to JSON or CSV
- ✅ Mark products as matched
- ✅ Handle new/unidentified products

## Tips

- Use the search box to quickly find products by name, category, or type
- Products turn green when matched
- The stats at the top show your progress
- You can go back and change mappings if needed

## Output

The exported JSON will look like:
```json
{
  "image00001.jpeg": {
    "product": "Slane Irish Whiskey",
    "type": "main",
    "category": "Spirit"
  },
  "image00002.jpeg": {
    "product": "Giffard Limoncello",
    "type": "gallery",
    "category": "Spirit"
  }
}
```

This makes it easy to update your `spirits-list.json` file with the correct image paths!

