# AI Prompt for Bulk Product Import

## Copy this entire prompt and give it to your AI assistant (ChatGPT, Claude, etc.)

---

**"Please format the following product data into a JSON array following this exact structure:**

**Required fields:**
- `name`: Product name (string)
- `category`: One of "Wine", "Beer", or "Spirit" (string)
- `price`: Price in euros as a number (e.g., 45.99, not "45.99")
- `country`: Country name (string, e.g., "France", "Italy", "Ireland")

**Optional but recommended fields:**
- `region`: Wine region (string, e.g., "Bordeaux", "Tuscany")
- `description`: Full product description (string)
- `producer`: Producer/Distillery name (string)
- `tasteProfile`: Tasting notes (string, e.g., "Red cherry, dried rose, spice")
- `foodPairing`: Food pairing suggestions (string, e.g., "Braised beef, truffle risotto")
- `grapes`: Array of grape varieties (array of strings, e.g., ["Nebbiolo", "Barbera"])
- `wineType`: For wines only - "Red", "White", "Rosé", "Sparkling", or "Prosecco" (string)
- `spiritType`: For spirits only - "Gin", "Vodka", "Rum", "Tequila", "Liqueur", or "Whiskey" (string)
- `beerStyle`: For beers only - "Lager", "IPA", "Pale Ale", "Stout", "Porter", "Pilsner", or "Sour" (string)
- `abv`: Alcohol by volume percentage as a number (e.g., 13.5)
- `volumeMl`: Bottle size in milliliters as a number (e.g., 750)
- `stock`: Stock quantity as a number (e.g., 10)
- `featured`: true or false (boolean)
- `new`: true or false (boolean)
- `onSale`: true or false (boolean)
- `salePrice`: Sale price as a number if onSale is true (e.g., 40.50)
- `christmasGift`: true or false (boolean)

**For images (use placeholders for now):**
- `image`: Primary image URL (string) - use "https://placeholder.com/400x500" as placeholder
- `images`: Array of additional image URLs (array of strings) - use empty array [] for now

**Important rules:**
1. **DO NOT include a `slug` field** - it will be auto-generated from the name
2. **Price must be a NUMBER, not a string** (e.g., 45.99 not "45.99")
3. **Grapes must be an ARRAY of strings**, not a comma-separated string (e.g., ["Cabernet", "Merlot"])
4. **Boolean fields** (featured, new, onSale, christmasGift) must be true/false, not strings
5. **Numbers** (price, abv, volumeMl, stock, salePrice) must be numbers, not strings
6. **Output as a valid JSON array** that can be directly imported into a database

**Example format:**
```json
[
  {
    "name": "Château Lilian Ladouys Saint-Estèphe 2019",
    "category": "Wine",
    "price": 45.99,
    "country": "France",
    "region": "Bordeaux",
    "description": "The King of Italian Wines. This exceptional Barolo hails from the legendary Piedmont region...",
    "producer": "Château Lilian Ladouys",
    "tasteProfile": "Fruit-forward, spicy, ripe berries, herbal, smooth",
    "foodPairing": "BBQ ribs, ratatouille, grilled sausages",
    "grapes": ["Cabernet Sauvignon", "Merlot"],
    "wineType": "Red",
    "abv": 13.5,
    "volumeMl": 750,
    "stock": 10,
    "featured": false,
    "new": false,
    "onSale": false,
    "christmasGift": false,
    "image": "https://placeholder.com/400x500",
    "images": []
  }
]
```

**Now format my product data below into this JSON array format:**"

---

## After getting the formatted JSON:

1. Copy the JSON array from the AI response
2. Go to Admin Dashboard → Click "Bulk Import JSON" button
3. Paste the JSON into the textarea
4. Click "Import Products"
5. Images can be added later by editing each product individually

## Adding Multiple Images Later:

After importing products, you can add multiple images via URL:

1. Edit any product
2. In the "Additional Image URLs" field, paste comma-separated URLs:
   ```
   https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg
   ```
3. Save the product
4. The images will appear in the product gallery

