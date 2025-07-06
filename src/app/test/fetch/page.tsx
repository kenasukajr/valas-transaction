"use client"

import React, { useState } from 'react'

export default function TestFetchPage() {
  const [status, setStatus] = useState('Ready')
  const [results, setResults] = useState('')

  const testFetch = async () => {
    setStatus('Testing...')
    setResults('')
    
    try {
      console.log('🚀 Starting fetch test from Next.js client')
      
      // Test nasabah API
      console.log('📡 Testing nasabah API...')
      const nasabahUrl = 'http://localhost:5000/api/nasabah'
      const nasabahResponse = await fetch(nasabahUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('✅ Nasabah response:', nasabahResponse.status, nasabahResponse.statusText)
      
      if (!nasabahResponse.ok) {
        throw new Error(`Nasabah API failed: ${nasabahResponse.status} ${nasabahResponse.statusText}`)
      }
      
      const nasabahData = await nasabahResponse.json()
      console.log('📊 Nasabah data received:', nasabahData.length, 'records')
      
      // Test transactions API
      console.log('📡 Testing transactions API...')
      const transactionsUrl = 'http://localhost:5000/api/transactions'
      const transactionsResponse = await fetch(transactionsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('✅ Transactions response:', transactionsResponse.status, transactionsResponse.statusText)
      
      if (!transactionsResponse.ok) {
        throw new Error(`Transactions API failed: ${transactionsResponse.status} ${transactionsResponse.statusText}`)
      }
      
      const transactionsData = await transactionsResponse.json()
      console.log('📊 Transactions data received:', transactionsData.length, 'records')
      
      setStatus('SUCCESS!')
      setResults(`✅ Nasabah API: ${nasabahResponse.status} - ${nasabahData.length} records
✅ Transactions API: ${transactionsResponse.status} - ${transactionsData.length} records
      
Sample Nasabah:
${JSON.stringify(nasabahData[0], null, 2)}

Sample Transaction:
${JSON.stringify(transactionsData[0], null, 2)}`)
      
    } catch (error: any) {
      console.error('❌ Fetch test failed:', error)
      setStatus('FAILED!')
      setResults(`❌ Error: ${error.message}
      
Check browser console for more details.

Error details:
- Name: ${error.name}
- Message: ${error.message}
- Stack: ${error.stack}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Fetch API dari Next.js Client</h1>
      
      <div className="mb-4">
        <button 
          onClick={testFetch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Test Fetch API
        </button>
      </div>
      
      <div className="mb-4">
        <strong>Status:</strong> <span className={status.includes('SUCCESS') ? 'text-green-600' : status.includes('FAILED') ? 'text-red-600' : 'text-blue-600'}>{status}</span>
      </div>
      
      {results && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Results:</h3>
          <pre className="whitespace-pre-wrap text-sm">{results}</pre>
        </div>
      )}
    </div>
  )
}
