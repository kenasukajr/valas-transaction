"use client"

import React, { useEffect, useState } from "react"

interface SimpleTransactionListProps {
  backendUrl: string
  refreshFlag: boolean
}

export default function SimpleTransactionList({ backendUrl, refreshFlag }: SimpleTransactionListProps) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('SimpleTransactionList rendered with props:', { backendUrl, refreshFlag })

  useEffect(() => {
    console.log('=== SIMPLE USEEFFECT TRIGGERED ===')
    
    const fetchData = async () => {
      try {
        console.log('Fetching from:', backendUrl)
        const response = await fetch(backendUrl)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const result = await response.json()
        console.log('Fetch successful:', result)
        setData(result)
        setError(null)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [backendUrl, refreshFlag])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Simple Transaction List</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
