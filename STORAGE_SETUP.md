# Supabase Storage Setup

## Issue with Image Upload

If you're experiencing "Failed to fetch" errors when uploading images, it's likely because the Supabase storage bucket hasn't been created yet.

## Setup Steps

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Navigate to your project

2. **Create Storage Bucket**
   - Go to Storage → Buckets
   - Click "New Bucket"
   - Name: `images`
   - Make it Public: ✅ (checked)
   - Click "Create Bucket"

3. **Set Bucket Policies**
   The database.sql script includes the necessary policies, but you can also set them manually:
   
   ```sql
   -- Allow anyone to upload images
   CREATE POLICY "Anyone can upload images" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'images');

   -- Allow anyone to view images
   CREATE POLICY "Images are publicly accessible" ON storage.objects
     FOR SELECT USING (bucket_id = 'images');
   ```

## Temporary Solution

The app has been configured to work without images if upload fails. Users can still create listings, but images won't be saved until the storage bucket is properly configured.

## Testing Image Upload

After setting up the bucket, test the upload endpoint:

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/your/image.jpg"
```

## Alternative: Local Development

For local development, you might want to use a local file storage solution instead of Supabase storage. The upload endpoint can be modified to save files locally in the `public/uploads/` directory.
