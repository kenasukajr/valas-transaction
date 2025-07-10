import { networkInterfaces } from 'os'

/**
 * Auto-detect IP address berdasarkan konfigurasi environment
 */
export function getBackendUrl(): string {
  const networkMode = process.env.NETWORK_MODE || 'localhost'
  const frontendPort = process.env.FRONTEND_PORT || '8000'
  const backendPort = process.env.BACKEND_PORT || '5000'
  
  switch (networkMode) {
    case 'auto':
      const autoIP = detectLocalIP()
      return `http://${autoIP}:${backendPort}`
      
    case 'manual':
      const manualIP = process.env.MANUAL_IP || '192.168.1.6'
      return `http://${manualIP}:${backendPort}`
      
    case 'localhost':
    default:
      return `http://localhost:${backendPort}`
  }
}

/**
 * Deteksi IP address lokal secara otomatis
 */
export function detectLocalIP(): string {
  const interfaces = networkInterfaces()
  
  // Prioritas pencarian IP:
  // 1. Interface Wi-Fi atau Ethernet dengan IP 192.168.x.x
  // 2. Interface lain dengan IP private
  // 3. Fallback ke localhost
  
  for (const interfaceName of Object.keys(interfaces)) {
    const interface_info = interfaces[interfaceName]
    
    if (!interface_info) continue
    
    for (const info of interface_info) {
      // Skip loopback dan non-IPv4
      if (info.family !== 'IPv4' || info.internal) continue
      
      // Prioritas untuk subnet 192.168.x.x
      if (info.address.startsWith('192.168.')) {
        return info.address
      }
    }
  }
  
  // Fallback: cari IP private lainnya
  for (const interfaceName of Object.keys(interfaces)) {
    const interface_info = interfaces[interfaceName]
    
    if (!interface_info) continue
    
    for (const info of interface_info) {
      if (info.family !== 'IPv4' || info.internal) continue
      
      // IP private ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
      if (
        info.address.startsWith('10.') ||
        (info.address.startsWith('172.') && 
         parseInt(info.address.split('.')[1]) >= 16 && 
         parseInt(info.address.split('.')[1]) <= 31)
      ) {
        return info.address
      }
    }
  }
  
  // Last fallback
  return 'localhost'
}

/**
 * Get display URL untuk ditampilkan ke user
 */
export function getDisplayUrls() {
  const networkMode = process.env.NETWORK_MODE || 'localhost'
  const frontendPort = process.env.FRONTEND_PORT || '8000'
  
  const localUrl = `http://localhost:${frontendPort}`
  
  if (networkMode === 'localhost') {
    return {
      local: localUrl,
      network: null
    }
  }
  
  const ip = networkMode === 'auto' ? detectLocalIP() : (process.env.MANUAL_IP || '192.168.1.6')
  const networkUrl = `http://${ip}:${frontendPort}`
  
  return {
    local: localUrl,
    network: networkUrl
  }
}
