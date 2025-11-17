# Bulk Product Import Format

## Data Format Specification

Use this format when asking an AI assistant to format your product data for bulk import into Wine Haven's database.

### Required Fields (Must Have)
- **name**: Product name (e.g., "Château Lilian Ladouys Saint-Estèphe 2019")
- **category**: One of: "Wine", "Beer", "Spirit"
- **price**: Number in euros (e.g., 45.99)
- **country**: Country name (e.g., "France", "Italy", "Ireland")

### Optional but Recommended Fields
- **region**: Wine region (e.g., "Bordeaux", "Tuscany", "Barossa Valley")
- **description**: Full product description
- **producer**: Producer/Distillery name
- **tasteProfile**: Tasting notes (e.g., "Red cherry, dried rose, spice")
- **foodPairing**: Food pairing suggestions (e.g., "Braised beef, truffle risotto")
- **grapes**: Array of grape varieties (e.g., ["Nebbiolo", "Barbera"])
- **wineType**: For wines only - "Red", "White", "Rosé", "Sparkling", "Prosecco"
- **spiritType**: For spirits only - "Gin", "Vodka", "Rum", "Tequila", "Liqueur", "Whiskey"
- **beerStyle**: For beers only - "Lager", "IPA", "Pale Ale", "Stout", "Porter", "Pilsner", "Sour"
- **abv**: Alcohol by volume percentage (e.g., 13.5)
- **volumeMl**: Bottle size in milliliters (e.g., 750)
- **stock**: Stock quantity (number)
- **featured**: true/false (featured products)
- **new**: true/false (new products)
- **onSale**: true/false (on sale)
- **salePrice**: Sale price if onSale is true
- **christmasGift**: true/false (Christmas gift products)

### Image Fields (Can Add Later)
- **image**: Primary image URL (can be placeholder for now)
- **images**: Array of additional image URLs (optional)

### Example Product Object

```json
{
  "name": "Château Lilian Ladouys Saint-Estèphe 2019",
  "category": "Wine",
  "price": 45.99,
  "country": "France",
  "region": "Bordeaux",
  "description": "The King of Italian Wines. This exceptional Barolo hails from the legendary Piedmont region...",
  "producer": "Château Lilian Ladouys",
  "tasteProfile": "Aromas of red cherry, dried rose petals, and tar intertwine with notes of leather and tobacco.",
  "foodPairing": "Perfect with rich meat dishes such as braised beef, osso buco, wild game.",
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
```

### Output Format Request

When asking an AI to format your data, use this prompt:

---

## PROMPT FOR AI ASSISTANT:

**"Please format the following product data into a JSON array following this exact structure:**

**Required fields: name, category (Wine/Beer/Spirit), price (number), country**

**Optional fields: region, description, producer, tasteProfile, foodPairing, grapes (array), wineType (for wines), spiritType (for spirits), beerStyle (for beers), abv, volumeMl, stock, featured, new, onSale, salePrice, christmasGift**

**For images, use placeholder: "https://placeholder.com/400x500" for the image field and empty array [] for images field.**

**Auto-generate slug from name (lowercase, remove accents, replace spaces with hyphens).**

**Output as a JSON array that can be directly imported into a database."**

---

### Notes:
- **Slug** will be auto-generated from name (no need to provide)
- **Images** can be added later via admin dashboard
- **Price** must be a number (not a string)
- **Grapes** should be an array of strings
- **Boolean fields** (featured, new, onSale, etc.) should be true/false, not strings

