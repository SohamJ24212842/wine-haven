-- Migration: Add "Wheat Beer" and "Ginger Beer" to beer_style check constraint
-- Run this in your Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_beer_style_check;

-- Add the new constraint with additional beer styles
ALTER TABLE products ADD CONSTRAINT products_beer_style_check 
  CHECK (beer_style IN ('Lager', 'IPA', 'Pale Ale', 'Stout', 'Porter', 'Pilsner', 'Sour', 'Wheat Beer', 'Ginger Beer'));

