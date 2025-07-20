-- Migration script to fix existing database schema
-- Run this if your database has seller_email instead of email, or missing title/description columns

-- First, check what columns exist
-- You can run: \d listings; in psql to see current schema

-- If your table has seller_email instead of email, rename it:
-- ALTER TABLE listings RENAME COLUMN seller_email TO email;

-- If your table is missing title column, add it:
-- ALTER TABLE listings ADD COLUMN IF NOT EXISTS title TEXT;

-- If your table is missing description column, add it:
-- ALTER TABLE listings ADD COLUMN IF NOT EXISTS description TEXT;

-- If title column exists but has no NOT NULL constraint:
-- UPDATE listings SET title = 'Untitled Item' WHERE title IS NULL;
-- ALTER TABLE listings ALTER COLUMN title SET NOT NULL;

-- Complete migration script (run these one by one and check results):

-- Step 1: Add missing columns if they don't exist
ALTER TABLE listings ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 2: If you have seller_email column instead of email, rename it
-- (Only run this if you have seller_email column)
-- ALTER TABLE listings RENAME COLUMN seller_email TO email;

-- Step 3: Update any null titles with a default value
UPDATE listings SET title = 'Untitled Item' WHERE title IS NULL;

-- Step 4: Make title required (after ensuring no nulls exist)
ALTER TABLE listings ALTER COLUMN title SET NOT NULL;

-- Step 5: Verify the final schema matches expectations:
-- Expected columns: id, title, description, price, email, category, image_url, location, created_at, updated_at
