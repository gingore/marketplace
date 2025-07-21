"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDirectInsert() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testWithoutBuyerName = async () => {
    setLoading(true);
    setResult('Testing insert without buyer_name...');
    
    try {
      // Try inserting without buyer_name to see if that works
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          listing_id: 'b7fdb23c-c289-489a-a967-f8bec3be5623',
          buyer_email: 'test@example.com',
          seller_email: 'twinleaf@sinnoh.com',
          message: 'Test message without buyer_name'
        }])
        .select();
      
      if (error) {
        setResult(`Error: ${JSON.stringify(error, null, 2)}`);
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

  const testWithBuyerName = async () => {
    setLoading(true);
    setResult('Testing insert with buyer_name...');
    
    try {
      // Try inserting with buyer_name
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          listing_id: 'b7fdb23c-c289-489a-a967-f8bec3be5623',
          buyer_name: 'Test Buyer',
          buyer_email: 'test@example.com',
          seller_email: 'twinleaf@sinnoh.com',
          message: 'Test message with buyer_name'
        }])
        .select();
      
      if (error) {
        setResult(`Error: ${JSON.stringify(error, null, 2)}`);
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

  const checkTableSchema = async () => {
    setLoading(true);
    setResult('Checking table schema...');
    
    try {
      // Try to select from messages to see what columns exist
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .limit(1);
      
      if (error) {
        setResult(`Schema check error: ${JSON.stringify(error, null, 2)}`);
      } else {
        setResult(`Schema check success. Found ${data.length} rows. First row structure: ${JSON.stringify(data[0] || {}, null, 2)}`);
      }
    } catch (err) {
      console.error('Schema check error:', err);
      setResult(`Exception: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1>Test Direct Insert</h1>
      <div className="space-y-4">
        <button 
          onClick={checkTableSchema}
          disabled={loading}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
        >
          {loading ? 'Testing...' : 'Check Schema'}
        </button>
        <button 
          onClick={testWithoutBuyerName}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          {loading ? 'Testing...' : 'Test Without buyer_name'}
        </button>
        <button 
          onClick={testWithBuyerName}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Testing...' : 'Test With buyer_name'}
        </button>
      </div>
      <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
        {result}
      </pre>
    </div>
  );
}
