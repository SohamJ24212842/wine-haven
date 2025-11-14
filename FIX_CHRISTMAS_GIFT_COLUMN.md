# Fix: Missing `christmas_gift` Column

## Problem
The import is failing with error: `Could not find the 'christmas_gift' column of 'products' in the schema cache (Code: PGRST204)`

This means the `christmas_gift` column doesn't exist in your Supabase database table.

## Solution

### Option 1: Run the Migration SQL (Recommended)

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-add-christmas-gift-column.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see a success message

### Option 2: Add Column Manually

1. Go to your Supabase project dashboard
2. Click on **Table Editor** in the left sidebar
3. Select the `products` table
4. Click **Add Column**
5. Set:
   - **Name**: `christmas_gift`
   - **Type**: `bool` (boolean)
   - **Default value**: `false`
   - **Nullable**: No (unchecked)
6. Click **Save**

### After Adding the Column

1. Go back to your admin dashboard
2. Click **"Import Products"** again
3. The import should now work!

## Verify the Column Exists

You can verify the column was added by running this query in the SQL Editor:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'christmas_gift';
```

You should see one row with `christmas_gift`, `boolean`, and `false`.



