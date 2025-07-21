"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestMessage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSchemaWithoutBuyerName = async () => {
    setLoading(true);
    setResult('Testing schema without buyer_name...');
    
    try {
      // Try to insert without buyer_name field
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          listing_id: 'b7fdb23c-c289-489a-a967-f8bec3be5623',
          buyer_email: 'test@example.com',
          seller_email: 'twinleaf@sinnoh.com',
          message: 'Test message without buyer_name'
        }])
        .select();
      
      console.log('Insert without buyer_name result:', { data, error });
      
      if (error) {
        setResult(`Insert Error (no buyer_name): ${JSON.stringify(error, null, 2)}`);
      } else {
        setResult(`Success (no buyer_name): ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      console.error('Test error:', err);
      setResult(`Exception: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testSchema = async () => {
    setLoading(true);
    setResult('Testing schema...');
    
    try {
      // First, let's try to select from messages to see what columns exist
      const { data: messages, error: selectError } = await supabase
        .from('messages')
        .select('*')
        .limit(1);
      
      console.log('Messages select result:', { messages, selectError });
      
      if (selectError) {
        setResult(`Select Error: ${JSON.stringify(selectError, null, 2)}`);
        return;
      }
      
      // Now let's try to insert with buyer_name field
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          listing_id: 'b7fdb23c-c289-489a-a967-f8bec3be5623',
          buyer_name: 'Test Buyer',
          buyer_email: 'test@example.com',
          seller_email: 'twinleaf@sinnoh.com',
          message: 'Test message'
        }])
        .select();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        setResult(`Insert Error: ${JSON.stringify(error, null, 2)}`);
      } else {
        setResult(`Success: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      console.error('Test error:', err);
      setResult(`Exception: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1>Message Schema Test</h1>
      <div className="space-x-4">
        <button 
          onClick={testSchema}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          {loading ? 'Testing...' : 'Test Schema (with buyer_name)'}
        </button>
        <button 
          onClick={testSchemaWithoutBuyerName}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          {loading ? 'Testing...' : 'Test Schema (without buyer_name)'}
        </button>
      </div>
      <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
        {result}
      </pre>
    </div>
  );
}
