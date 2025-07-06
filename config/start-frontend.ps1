# PowerShell script to start Next.js frontend with correct backend URL for all devices in LAN

# Get local IPv4 address (not 127.0.0.1)
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -eq 'Dhcp' -or $_.PrefixOrigin -eq 'Manual' } | Select-Object -First 1 -ExpandProperty IPAddress)
if (-not $ip) { $ip = "localhost" }

$backendUrl = "http://$ip:5000"
Write-Host "Starting frontend with BACKEND_URL: $backendUrl"

$env:NEXT_PUBLIC_BACKEND_URL = $backendUrl
npx next dev -H 0.0.0.0 -p 8000
