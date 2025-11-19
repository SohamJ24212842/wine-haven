# 🖼️ Wine Image Setup Instructions

## Step 1: Save the JSON File

1. Copy the JSON array you provided (the 70 wines)
2. Save it as: `wine-haven-next/wine-list-transformed.json`

## Step 2: Generate Filename List

Run this command to see all exact filenames:
```bash
node scripts/generate-filename-list.js
```

This will print all 70 filenames you need to use.

## Step 3: Rename Your Photos

Rename your 70 photos using the filenames from Step 2.

**Examples:**
- "Brunello di Montalcino Banfi 2019" → `brunello-di-montalcino-banfi-2019.jpg`
- "La Marca Prosecco" → `la-marca-prosecco.jpg`
- "Boutinot Mal.bek Rosé" → `boutinot-malbek-rose.jpg`

## Step 4: Upload Photos

Upload all 70 renamed photos to:
```
wine-haven-next/public/wines/
```

## Step 5: Update JSON Automatically

Run this command:
```bash
node scripts/update-wine-images.js
```

This will:
- ✅ Match each wine to its image file
- ✅ Update the JSON with correct paths (`/wines/filename.jpg`)
- ✅ Show you which wines don't have matches

## ✅ Done!

Your JSON will be ready for bulk import with all image paths set correctly.

---

## 📋 Quick Reference

**Folder:** `wine-haven-next/public/wines/` (already created)

**Scripts:**
- `scripts/generate-filename-list.js` - See all filenames
- `scripts/update-wine-images.js` - Update JSON with image paths

**Files:**
- `WINE_FILENAME_MAPPING.md` - Complete filename reference
- `wine-list-transformed.json` - Your wine data (save the JSON you provided here)

