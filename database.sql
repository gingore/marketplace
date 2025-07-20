-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  location TEXT DEFAULT 'Palo Alto, CA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  message TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS (Row Level Security) policies
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to listings
CREATE POLICY "Public listings are viewable by everyone" ON listings
  FOR SELECT USING (true);

-- Allow anyone to insert new listings
CREATE POLICY "Anyone can insert listings" ON listings
  FOR INSERT WITH CHECK (true);

-- Allow public read access to messages
CREATE POLICY "Public messages are viewable by everyone" ON messages
  FOR SELECT USING (true);

-- Allow anyone to insert new messages
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Storage policies for images
CREATE POLICY "Anyone can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_listings_updated_at 
  BEFORE UPDATE ON listings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data (optional)
INSERT INTO listings (title, description, price, email, category, location) VALUES
  ('MacBook Pro 13"', 'Excellent condition, barely used. Comes with charger and original box.', '$1,200', 'seller@example.com', 'Electronics', 'Palo Alto, CA'),
  ('Mountain Bike', 'Great condition bike, perfect for trails and commuting.', '$450', 'bikeseller@example.com', 'Sporting Goods', 'Mountain View, CA'),
  ('iPhone 14', 'Like new, with all accessories and original packaging.', '$800', 'phoneseller@example.com', 'Electronics', 'San Francisco, CA'),
  ('Dining Table Set', 'Beautiful wooden dining table with 4 chairs.', '$300', 'furniture@example.com', 'Home Goods', 'Palo Alto, CA'),
  ('Guitar - Fender Stratocaster', 'American Standard Stratocaster in excellent condition.', '$1,500', 'musician@example.com', 'Musical Instruments', 'San Jose, CA');
