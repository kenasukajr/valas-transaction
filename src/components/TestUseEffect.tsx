"use client"

import { useEffect, useState } from "react"

export default function TestUseEffect() {
  const [mounted, setMounted] = useState(false)
  
  console.log('TestUseEffect component rendered')
  
  useEffect(() => {
    console.log('=== TEST USEEFFECT FIRED ===')
    setMounted(true)
  }, [])
  
  return (
    <div style={{ border: '2px solid red', padding: '10px', margin: '10px' }}>
      <h3>Test useEffect Component</h3>
      <p>Mounted: {mounted ? 'YES' : 'NO'}</p>
    </div>
  )
}
