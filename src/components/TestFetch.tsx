"use client"

import React, { useState } from "react"

export function TestFetch() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    setResult('Starting fetch test with RELATIVE URL...');
    
    try {
      const start = Date.now();
      const response = await fetch('/api/nasabah', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      const end = Date.now();
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ FETCH SUCCESS: ${response.status} in ${end - start}ms. Data count: ${data.length}`);
      } else {
        setResult(`❌ FETCH ERROR: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setResult(`❌ FETCH ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAxios = async () => {
    setLoading(true);
    setResult('Starting axios test with RELATIVE URL...');
    
    try {
      const start = Date.now();
      const axios = (await import('axios')).default;
      const response = await axios.get('/api/nasabah');
      const end = Date.now();
      
      setResult(`✅ AXIOS SUCCESS: ${response.status} in ${end - start}ms. Data count: ${response.data.length}`);
    } catch (error: any) {
      setResult(`❌ AXIOS ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-bold mb-4">Network Test</h3>
      <div className="flex gap-2 mb-4">
        <button 
          onClick={testFetch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Test Fetch
        </button>
        <button 
          onClick={testAxios}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Test Axios
        </button>
      </div>
      <div className="bg-gray-100 p-2 rounded">
        {loading ? '⏳ Loading...' : result || 'Click a button to test'}
      </div>
    </div>
  );
}
