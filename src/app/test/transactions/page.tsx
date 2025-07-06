"use client"

import React from 'react'
import { TransactionSummaryTable } from '../../../components/TransactionSummaryTable'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Transaction Summary Table</h1>
      <p className="mb-4">Testing with nasabahId: 1, backendUrl: localhost:5000</p>
      
      <div className="border rounded-lg p-4">
        <TransactionSummaryTable 
          nasabahId={1}
          backendUrl="http://localhost:5000"
        />
      </div>
    </div>
  )
}
