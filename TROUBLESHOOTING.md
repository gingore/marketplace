# Troubleshooting Guide

## 🚨 CRITICAL: Schema Cache Issue (PGRST204)

**Problem**: Getting error "Could not find the 'email' column of 'listings' in the schema cache" when creating listings.

**Root Cause**: Supabase's PostgREST schema cache is out of sync with your database.

**Solution Steps**:

1. **Go to your Supabase Dashboard**
2. **Navigate to Settings → API**
3. **Find "Schema Cache" section**
4. **Click "Reload Schema"** or **"Refresh Schema Cache"**
5. **Wait 30-60 seconds for cache to refresh**
6. **Test the app again**

**Alternative Solution - Reset Database**:
If schema refresh doesn't work:
1. Go to SQL Editor in Supabase
2. Run: `DROP TABLE IF EXISTS listings CASCADE;`
3. Run: `DROP TABLE IF EXISTS messages CASCADE;`
4. Copy and paste the entire `database.sql` script again
5. Run the script to recreate everything

**Why This Happens**: 
- Database schema was modified outside of migrations
- Supabase cache didn't automatically update
- Common with manual SQL script execution

## Common Issues and Solutions

### 1. "Failed to fetch" or "Could not find the 'email' column" Errors

**Problem**: The database tables haven't been created yet.

**Solution**:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `database.sql`
4. Paste and run the script
5. Restart your development server

### 2. Image Upload Fails

**Problem**: Supabase storage bucket doesn't exist or isn't configured properly.

**Solution**:
1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `images`
3. Make it public ✅
4. The policies are already set up in `database.sql`

**Temporary Workaround**: The app is configured to work without images if upload fails.

### 3. Environment Variables Not Found

**Problem**: Missing or incorrect `.env.local` file.

**Solution**:
```bash
# Create .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. "Connection refused" on localhost:3000

**Problem**: Development server not running.

**Solution**:
```bash
npm run dev
```

### 5. Build Errors

**Problem**: TypeScript or dependency issues.

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

### 6. No Listings Showing

**Problem**: Database is empty or not connected.

**Solutions**:
1. Check that `database.sql` was run (it includes sample data)
2. Verify Supabase credentials in `.env.local`
3. Check browser console for errors
4. Test API endpoint: `curl http://localhost:3000/api/listings`

### 7. RLS (Row Level Security) Issues

**Problem**: Supabase policies blocking access.

**Solution**: The `database.sql` script includes all necessary policies. If you modified them:
```sql
-- Reset policies to allow all access for development
DROP POLICY IF EXISTS "Enable read access for all users" ON listings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON listings;

CREATE POLICY "Enable read access for all users" ON listings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON listings FOR INSERT WITH CHECK (true);
```

## Testing Your Setup

### 1. Test Database Connection
```bash
curl http://localhost:3000/api/listings
# Should return: {"success":true,"data":[...],"pagination":{...}}
```

### 2. Test Creating a Listing (without image)
```bash
curl -X POST http://localhost:3000/api/listings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Item",
    "price": "$99.99",
    "email": "test@example.com",
    "category": "Electronics",
    "location": "Test City"
  }'
```

### 3. Test Image Upload
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/image.jpg"
```

## Getting Help

1. Check this troubleshooting guide first
2. Look at the browser console for JavaScript errors
3. Check the terminal for server-side errors
4. Verify all setup steps in README.md were completed
5. Test the API endpoints directly with curl/Postman

## Development Tips

- Use `npm run build` to catch TypeScript errors early
- Check Supabase dashboard for database errors
- Use browser dev tools to inspect network requests
- The app has error boundaries to catch and display errors gracefully
