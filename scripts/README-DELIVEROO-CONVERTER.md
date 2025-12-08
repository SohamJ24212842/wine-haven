# Deliveroo CSV to Product Database Converter

This script converts Deliveroo CSV export format to your product database format, matching products with existing database entries and adding all required fields.

## Features

- ✅ **Matches Deliveroo products** with existing database products
- ✅ **Adds missing fields** (category, country, region, producer, etc.) from database
- ✅ **Handles DRS fee** for beers (€0.15 per beer, automatically added to price)
- ✅ **Outputs CSV** in Deliveroo template format (ready for re-import)
- ✅ **Preserves item_id** for syncing with Deliveroo
- ✅ **Auto-detects category** for unmatched products

## Usage

1. **Copy your Deliveroo export CSV** to `wine-haven-next/deliveroo-export.csv`

2. **Start your dev server** (required to fetch existing products):
   ```bash
   npm run dev
   ```

3. **Run the converter script**:
   ```bash
   node scripts/convert-deliveroo-to-products.js
   ```

4. **Output**: Creates `products-deliveroo-format.csv` ready for Deliveroo import

## DRS Fee Handling

- **Beers**: Automatically adds €0.15 DRS deposit fee to `delivery_price` and `instore_price`
- **Single beers**: Adds €0.15, sets `irish_drs_items_per_pack` to `1`
- **Beer packs**: Calculates number of beers based on volume (e.g., 4-pack = 1320ml = 4 beers = €0.60)
- **Wines & Spirits**: No DRS fee

## Output CSV Format

The output CSV includes all Deliveroo required fields plus your product database fields:

**Deliveroo Fields:**
- `item_id`, `item_name`, `item_description`, `delivery_price`, `instore_price`
- `age_restricted`, `irish_drs_deposit_fee`, `irish_drs_items_per_pack`
- Plus all other Deliveroo template fields (set to defaults)

**Product Database Fields:**
- `category`, `country`, `region`, `producer`
- `wine_type`, `spirit_type`, `beer_style`
- `abv`, `volume_ml`, `image_url`
- `featured`, `new`, `on_sale`, `stock`

## Example

**Input (Deliveroo CSV):**
```csv
item_id,item_name,delivery_price
abc123,Stella Artois 4-Pack,10.5
```

**Output (with database match):**
```csv
item_id,item_name,delivery_price,irish_drs_deposit_fee,irish_drs_items_per_pack,category,country,...
abc123,Stella Artois 4-Pack,11.10,0.60,4,Beer,Belgium,...
```

(Price: €10.5 + €0.60 DRS fee = €11.10 for 4-pack)

## Notes

- Products matched with database will use database names/descriptions (more accurate)
- Unmatched products will be marked as `new: true` and may need manual updates
- All products are marked as `age_restricted: true`
- DRS fee is automatically calculated and added to beer prices

