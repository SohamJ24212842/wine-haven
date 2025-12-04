-- Update all product prices in a single query
-- Run this in Supabase SQL Editor

UPDATE products
SET price = CASE slug
  WHEN 'green-spot-10-year-old-single-pot-still-irish-whiskey' THEN 89.95
  WHEN 'giffard-creme-de-cacao-1885' THEN 31.50
  WHEN 'patron-anejo-tequila' THEN 110.00
END
WHERE slug IN (
  'green-spot-10-year-old-single-pot-still-irish-whiskey',
  'giffard-creme-de-cacao-1885',
  'patron-anejo-tequila'
);

-- Verify the updates
SELECT slug, name, category, price
FROM products
WHERE slug IN (
  'green-spot-10-year-old-single-pot-still-irish-whiskey',
  'giffard-creme-de-cacao-1885',
  'patron-anejo-tequila'
)
ORDER BY slug;



