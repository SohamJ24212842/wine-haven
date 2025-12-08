# Example: How Products Are Updated from CSV

## Example 1: Wine Below €20 (Add €2-3)

### CSV Input:
```csv
Name,Category,Price,Description,Country,Region,Producer,Wine Type,ABV,Volume (ml)
Montegrande Prosecco,Wine,18.95,,Italy,Veneto,Montegrande,Prosecco,,11.5,750
```

### Processing:
- **Price Update**: €18.95 → €20.95 (added €2, since <€15 threshold)
- **Description Generation**: 
  - Empty description → Generate new one
  - Category: Wine
  - Type: Prosecco
  - Region: Veneto
  - Country: Italy
  - Producer: Montegrande
  - ABV: 11.5%

### Output:
```json
{
  "name": "Montegrande Prosecco",
  "price": 20.95,
  "description": "A premium prosecco wine from the renowned Veneto region in Italy crafted by Montegrande with 11.5% ABV. Priced at €20.95."
}
```

---

## Example 2: Wine Above €20 (Add €4)

### CSV Input:
```csv
Name,Category,Price,Description,Country,Region,Producer,Wine Type,ABV,Volume (ml)
Moët & Chandon Impérial Brut,Wine,69,,France,Champagne,Moët & Chandon,Sparkling,,12,750
```

### Processing:
- **Price Update**: €69 → €73 (added €4)
- **Description Generation**:
  - Empty description → Generate new one
  - Category: Wine
  - Type: Sparkling
  - Region: Champagne
  - Country: France
  - Producer: Moët & Chandon
  - ABV: 12%

### Output:
```json
{
  "name": "Moët & Chandon Impérial Brut",
  "price": 73,
  "description": "A premium sparkling wine from the renowned Champagne region in France crafted by Moët & Chandon with 12% ABV. Priced at €73."
}
```

---

## Example 3: Beer (Add €2.5)

### CSV Input:
```csv
Name,Category,Price,Description,Country,Producer,Beer Style,ABV,Volume (ml)
Duvel Discovery Box,Beer,10.5,,Belgium,Duvel,,IPA,9,660
```

### Processing:
- **Price Update**: €10.5 → €13 (added €2.5)
- **Description Generation**:
  - Empty description → Generate new one
  - Category: Beer
  - Style: IPA
  - Country: Belgium
  - Producer: Duvel
  - ABV: 9%
  - **Special**: Contains "Discovery Box" → Use "Available at" instead of "Priced at"

### Output:
```json
{
  "name": "Duvel Discovery Box",
  "price": 13,
  "description": "A premium IPA beer from Belgium by Duvel with 9% ABV. Available at €13."
}
```

---

## Example 4: Spirit (No Price Change)

### CSV Input:
```csv
Name,Category,Price,Description,Country,Producer,Spirit Type,ABV,Volume (ml)
Midleton Very Rare Barry Crockett,Spirit,340,,Ireland,Midleton,Whiskey,,40,700
```

### Processing:
- **Price Update**: €340 → €340 (no change for spirits)
- **Description Generation**:
  - Empty description → Generate new one
  - Category: Spirit
  - Type: Whiskey
  - Country: Ireland
  - Producer: Midleton
  - ABV: 40%
  - Volume: 700ml

### Output:
```json
{
  "name": "Midleton Very Rare Barry Crockett",
  "price": 340,
  "description": "A premium whiskey from Ireland by Midleton at 40% ABV (700ml). Priced at €340."
}
```

---

## Example 5: Wine with Existing Description (Preserved)

### CSV Input:
```csv
Name,Category,Price,Description,Country,Region,Producer,Wine Type,ABV,Volume (ml)
Labastide Dauzac Margaux 2021,Wine,43.9,Classic Bordeaux with cassis and fine tannins,France,Bordeaux,Château Labastide Dauzac,Red,,13.5,750
```

### Processing:
- **Price Update**: €43.9 → €47.9 (added €4)
- **Description**: Existing description found → **Preserve it**, but add price if not mentioned
- Check: Description already mentions characteristics → Keep it

### Output:
```json
{
  "name": "Labastide Dauzac Margaux 2021",
  "price": 47.9,
  "description": "Classic Bordeaux with cassis and fine tannins. Priced at €47.9."
}
```

---

## Example 6: Multiple Products Mentioned (Gift Box)

### CSV Input:
```csv
Name,Category,Price,Description,Country,Producer,Beer Style,ABV,Volume (ml)
Stella Artois 4-Pack,Beer,10.5,,Belgium,Anheuser-Busch InBev,Lager,4.8,2000
```

### Processing:
- **Price Update**: €10.5 → €13 (added €2.5)
- **Description Generation**:
  - Contains "4-Pack" → Special handling
  - Use "Available at" instead of "Priced at"
  - Note: Volume is 2000ml (4 × 500ml) → Mentioned in description

### Output:
```json
{
  "name": "Stella Artois 4-Pack",
  "price": 13,
  "description": "A premium lager beer from Belgium by Anheuser-Busch InBev with 4.8% ABV (2000ml). Available at €13."
}
```

---

## Summary of Price Rules

| Category | Price Range | Price Increase |
|----------|-------------|----------------|
| Wine | < €15 | +€2 |
| Wine | €15 - €20 | +€3 |
| Wine | > €20 | +€4 |
| Beer | Any | +€2.5 |
| Spirit | Any | No change |

## Description Rules

1. **Empty Description**: Generate new description with:
   - Category-specific intro
   - Region/Country/Producer info
   - ABV and volume
   - Price at end

2. **Existing Description**: 
   - Preserve existing description
   - Add price if not mentioned
   - Special handling for gift boxes/packs

3. **Multiple Products** (gift boxes, packs):
   - Use "Available at" instead of "Priced at"
   - Mention total volume if applicable

