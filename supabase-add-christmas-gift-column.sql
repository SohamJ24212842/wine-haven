-- Add christmas_gift column to products table
-- Run this in your Supabase SQL Editor if the column is missing

-- Check if column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'christmas_gift'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN christmas_gift BOOLEAN DEFAULT false;
        
        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_products_christmas_gift ON products(christmas_gift);
        
        RAISE NOTICE 'Column christmas_gift added successfully';
    ELSE
        RAISE NOTICE 'Column christmas_gift already exists';
    END IF;
END $$;



