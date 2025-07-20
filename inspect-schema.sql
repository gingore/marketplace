-- Schema Inspection Script
-- Run this in Supabase SQL Editor to see your current table structure

-- Check if listings table exists and what columns it has
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if messages table exists and what columns it has  
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'messages' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what storage buckets exist
SELECT name, public FROM storage.buckets;
