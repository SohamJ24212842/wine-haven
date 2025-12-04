-- Update product prices for products with 0.00 prices
-- Run this in Supabase SQL Editor

-- 1. Green Spot 10 Year Old Single Pot Still Irish Whiskey
UPDATE products
SET price = 89.95
WHERE slug = 'green-spot-10-year-old-single-pot-still-irish-whiskey';

-- 2. Giffard Crème de Cacao 1885
UPDATE products
SET price = 31.50
WHERE slug = 'giffard-creme-de-cacao-1885';

-- 3. Patrón Añejo Tequila
UPDATE products
SET price = 110.00
WHERE slug = 'patron-anejo-tequila';

-- Verify the updates
SELECT slug, name, category, price
FROM products
WHERE slug IN (
  'green-spot-10-year-old-single-pot-still-irish-whiskey',
  'giffard-creme-de-cacao-1885',
  'patron-anejo-tequila'
)
ORDER BY slug;



