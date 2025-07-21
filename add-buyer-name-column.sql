-- Add buyer_name column to messages table
-- Run this if you have an existing messages table that's missing the buyer_name column

ALTER TABLE messages ADD COLUMN buyer_name VARCHAR(255);

-- If you want to make it NOT NULL and have existing data, you might need to:
-- 1. First add the column as nullable (above)
-- 2. Update existing rows with default values
-- 3. Then make it NOT NULL

-- UPDATE messages SET buyer_name = 'Unknown Buyer' WHERE buyer_name IS NULL;
-- ALTER TABLE messages ALTER COLUMN buyer_name SET NOT NULL;

-- Or if you prefer to start fresh and there's no important data:
-- DROP TABLE messages;
-- Then recreate it using the schema in database.sql
