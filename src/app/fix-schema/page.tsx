"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FixSchema() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fixMessagesSchema = async () => {
    setLoading(true);
    setResult('Fixing messages schema...');
    
    try {
      // Drop and recreate the messages table
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: `
          -- Drop the existing messages table and related objects
          DROP TABLE IF EXISTS messages CASCADE;
          
          -- Recreate the messages table with the correct schema
          CREATE TABLE messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
            buyer_name VARCHAR(255) NOT NULL,
            buyer_email VARCHAR(255) NOT NULL,
            seller_email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Recreate index
          CREATE INDEX idx_messages_listing_id ON messages(listing_id);
          
          -- Enable Row Level Security (RLS)
          ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
          
          -- Recreate policies
          CREATE POLICY "Anyone can view messages" ON messages FOR SELECT USING (true);
          CREATE POLICY "Anyone can create messages" ON messages FOR INSERT WITH CHECK (true);
        `
      });
      
      if (dropError) {
        console.error('Error fixing schema:', dropError);
        setResult(`Error: ${JSON.stringify(dropError, null, 2)}`);
        return;
      }
      
      // Test inserting a message to verify the fix
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          listing_id: 'b7fdb23c-c289-489a-a967-f8bec3be5623',
          buyer_name: 'Test Buyer',
          buyer_email: 'test@example.com',
          seller_email: 'twinleaf@sinnoh.com',
          message: 'Test message after schema fix'
        }])
        .select();
      
      if (error) {
        setResult(`Insert test failed: ${JSON.stringify(error, null, 2)}`);
      } else {
        setResult(`Schema fixed successfully! Test message inserted: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      console.error('Fix schema error:', err);
      setResult(`Exception: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1>Fix Messages Schema</h1>
      <p className="mb-4 text-gray-600">
        This will drop and recreate the messages table to fix the schema cache issue.
      </p>
      <button 
        onClick={fixMessagesSchema}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Fixing...' : 'Fix Messages Schema'}
      </button>
      <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
        {result}
      </pre>
    </div>
  );
}
