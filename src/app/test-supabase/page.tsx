"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', '1e898322-689d-44ae-82d4-c4b1fb6949fe')
          .single();

        console.log('Supabase test result:', { data, error });
        setResult(data);
        setError(error?.message || null);
      } catch (err) {
        console.error('Test error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1>Supabase Connection Test</h1>
      <div className="mt-4">
        <h2>Result:</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
        {error && (
          <div className="mt-4">
            <h2>Error:</h2>
            <pre className="bg-red-100 p-4 rounded text-red-800">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
