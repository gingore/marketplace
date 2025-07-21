"use client";

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

// Simple test to log API response structure
export default function TestAPI() {
  const [result, setResult] = useState<object | null>(null);

  useEffect(() => {
    async function test() {
      const res = await apiClient.getListing('1e898322-689d-44ae-82d4-c4b1fb6949fe');
      console.log('API Client Result:', res);
      setResult(res);
    }
    test();
  }, []);
  
  return (
    <div className="p-8">
      <h1>API Test</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
