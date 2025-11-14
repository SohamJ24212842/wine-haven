-- Optional: Remove category constraint to allow custom categories
-- Run this in your Supabase SQL Editor if you want to allow adding new categories beyond Wine, Beer, Spirit

-- Remove the CHECK constraint on category
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Note: After running this, you can add any category name (e.g., "Cider", "Sake", etc.)
-- If you want to keep the constraint, you'll need to manually add new categories to the CHECK constraint
-- Example: ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN ('Wine', 'Beer', 'Spirit', 'Cider', 'Sake'));



