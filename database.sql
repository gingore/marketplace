CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  seller_email VARCHAR(255) NOT NULL,
  image_url TEXT,
  location VARCHAR(255) DEFAULT 'Palo Alto, CA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  seller_email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);

CREATE POLICY "Anyone can upload listing images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Anyone can view listing images" ON storage.objects 
FOR SELECT USING (bucket_id = 'listing-images');

CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_messages_listing_id ON messages(listing_id);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Anyone can create listings" ON listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own listings" ON listings FOR UPDATE USING (seller_email = current_setting('request.jwt.claims')::json->>'email');

CREATE POLICY "Anyone can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create messages" ON messages FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
