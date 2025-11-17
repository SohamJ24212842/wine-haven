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
- `description`: Full product description with structured sections (string) - Format as:
  ```
  [Title/Subtitle if applicable]
  
  Description
  
  [Main description paragraph about the wine/producer/history]
  
  Language of Wine
  
  [Detailed tasting notes: color, aromas, flavors, texture, finish]
  
  Food Pairing
  
  [Food pairing suggestions]
  ```
- `producer`: Producer/Distillery name (string)
- `tasteProfile`: **SHORT** tasting notes (string) - Keep it concise: 5-8 key descriptors, comma-separated. Example: "Fruit-forward, spicy, ripe berries, herbal, smooth". This appears in Quick Look, so keep it brief!
- `foodPairing`: **SHORT** food pairing suggestions (string) - Keep it concise: 3-5 items, comma-separated. Example: "BBQ ribs, ratatouille, grilled sausages". This appears in Quick Look, so keep it brief!
- `grapes`: Array of grape varieties (array of strings, e.g., ["Nebbiolo", "Barbera"])
- `wineType`: For wines only - "Red", "White", "Rosé", "Sparkling", or "Prosecco" (string)
- `spiritType`: For spirits only - "Gin", "Vodka", "Rum", "Tequila", "Liqueur", or "Whiskey" (string)
- `beerStyle`: For beers only - "Lager", "IPA", "Pale Ale", "Stout", "Porter", "Pilsner", "Sour", "Wheat Beer", or "Ginger Beer" (string)
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
    "description": "Cru Bourgeois Excellence\n\nDescription\n\nChâteau Lilian Ladouys holds the prestigious Cru Bourgeois Exceptional designation, representing the pinnacle of quality outside the 1855 Classification. With vineyards ideally positioned near Château Cos d'Estournel, this historic estate benefits from exceptional terroir and modern, sustainable viticulture. A wine that beautifully balances power with finesse.\n\nLanguage of Wine\n\nDeep ruby-purple with complex aromas of blackberry, cassis, and violet. Hints of graphite, sweet tobacco, and toasted oak. Concentrated dark fruit flavors meld with black pepper, cedar wood, and dark chocolate. Velvety tannins and vibrant acidity with a polished, sophisticated finish—built for aging yet approachable now.\n\nFood Pairing\n\nIdeal with grilled entrecôte, steak frites, or beef bourguignon. Pairs exceptionally well with roasted venison, duck breast with cherry sauce, or wild mushroom risotto. Also excellent with aged Cheddar or Époisses.",
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

**IMPORTANT FORMATTING INSTRUCTIONS:**

When formatting the `description` field, structure it exactly like this example with clear section headers:
- Use `\n\n` (double newline) to separate sections
- Include "Description" as a header
- Include "Language of Wine" as a header  
- Include "Food Pairing" as a header
- Keep the text flowing naturally within each section
- If there's a title/subtitle (like "Cru Bourgeois Excellence"), put it at the very top before "Description"

The `tasteProfile` and `foodPairing` fields should contain **SHORT** versions extracted from their respective sections (without the headers). These appear in Quick Look, so keep them concise!

**CRITICAL: Format descriptions with structured sections:**

For the `description` field, format it with clear sections separated by double newlines (`\n\n`):
1. **Title/Subtitle** (if applicable) at the top
2. **"Description"** header followed by the main description paragraph
3. **"Language of Wine"** header followed by detailed tasting notes
4. **"Food Pairing"** header followed by food pairing suggestions

Example structure:
```
Cru Bourgeois Excellence

Description

[Main description about the wine/producer]

Language of Wine

[Detailed tasting notes: color, aromas, flavors, texture, finish]

Food Pairing

[Food pairing suggestions]
```

Extract the "Language of Wine" content into the `tasteProfile` field as a **SHORT** version (5-8 descriptors, comma-separated, without the header).
Extract the "Food Pairing" content into the `foodPairing` field as a **SHORT** version (3-5 items, comma-separated, without the header).

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

## Field Usage Summary:

- **`description`**: Full detailed version with all sections → Shown on **Product Detail Page**
- **`tasteProfile`**: Short version (5-8 descriptors) → Shown in **Quick Look Modal**
- **`foodPairing`**: Short version (3-5 items) → Shown in **Quick Look Modal**

