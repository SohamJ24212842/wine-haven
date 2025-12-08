# CSV Product Update Script

This script processes the Deliveroo CSV file to:
1. Match products with existing database products
2. Generate/enhance descriptions
3. Update prices according to rules:
   - **Wines below €20**: Add €2-3 (€3 for wines ≥€15, €2 for others)
   - **Wines above €20**: Add €4
   - **Beers**: Add €2.5
   - **Spirits**: No change

## Usage

1. **Copy your CSV file** to `wine-haven-next/products-import.csv`

2. **Start your dev server** (required to fetch existing products):
   ```bash
   npm run dev
   ```

3. **Run the script**:
   ```bash
   node scripts/update-products-from-csv.js
   ```

4. **Import the results**:
   - The script creates `updated-products.json`
   - Use the admin panel's bulk import feature to upload this file

## Example Output

### Example 1: Wine with Enhanced Description

**CSV Input:**
- Name: `Moët & Chandon Impérial Brut`
- Price: `69`
- Description: (empty)

**Updated Product:**
- Price: `73` (69 + 4)
- Description: `A premium sparkling wine from the renowned Champagne region in France crafted by Moët & Chandon with 12% ABV. Priced at €73.`

### Example 2: Beer with Multiple Products Mentioned

**CSV Input:**
- Name: `Duvel Discovery Box`
- Price: `10.5`
- Description: (empty)

**Updated Product:**
- Price: `13` (10.5 + 2.5)
- Description: `A premium beer from Belgium. Available at €13.`

### Example 3: Spirit (No Price Change)

**CSV Input:**
- Name: `Midleton Very Rare Barry Crockett`
- Price: `340`
- Description: (empty)

**Updated Product:**
- Price: `340` (no change)
- Description: `A premium whiskey from Ireland by Midleton at 40% ABV (700ml). Priced at €340.`

## How Matching Works

The script matches CSV products to existing database products by:
1. **Exact name match** (normalized, case-insensitive)
2. **Partial name match** (one name contains the other)
3. **Producer + Type match** (matches by producer and wine/spirit/beer type)

## Description Generation

Descriptions are generated based on:
- **Category** (Wine/Spirit/Beer)
- **Region/Country/Producer** from CSV
- **ABV and Volume** information
- **Price** (added at the end)
- **Multiple products** (gift boxes, packs) get special handling

If an existing product already has a good description, it's preserved and only price info is added if missing.

