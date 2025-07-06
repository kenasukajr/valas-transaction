# PowerShell script for critical-path testing of nasabah API endpoints to reduce output size

$baseUrl = "http://localhost:5000/api/nasabah"
$logFile = "nasabah_api_critical_test_log.txt"

function Invoke-Api {
    param (
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )
    $logEntry = "Request: $Method $Url`n"
    if ($Body) {
        $logEntry += "Body: $Body`n"
    }
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers @{ "Content-Type" = "application/json" } -Body $Body
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        # Only log count of items if response is an array
        if ($response -is [System.Array]) {
            $logEntry += "Response: Array of length $($response.Length)`n"
        } else {
            $responseJson = $response | ConvertTo-Json -Depth 3
            $logEntry += "Response:`n$responseJson`n"
        }
        Write-Host $logEntry -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        $logEntry += "Error:`n$errorMsg`n"
        Write-Host $logEntry -ForegroundColor Red
    }
    $logEntry += "----------------------------------------`n"
    Add-Content -Path $logFile -Value $logEntry
}

Write-Host "=== Mulai Pengujian Critical-Path API Nasabah ==="
Add-Content -Path $logFile -Value "=== Mulai Pengujian Critical-Path API Nasabah ===`n"

# 1. GET all nasabah (log only count)
Invoke-Api -Method GET -Url $baseUrl

# 2. POST new nasabah (valid)
$body = '{"id":"critical123","name":"Nasabah Critical Test"}'
Invoke-Api -Method POST -Url $baseUrl -Body $body

# 3. PUT update nasabah (valid)
$body = '{"name":"Nasabah Critical Test Diperbarui"}'
Invoke-Api -Method PUT -Url "$baseUrl/critical123" -Body $body

# 4. POST bulk delete (valid id)
$body = '{"ids":["critical123"]}'
Invoke-Api -Method POST -Url "$baseUrl/bulk-delete" -Body $body

Write-Host "=== Selesai Pengujian Critical-Path API Nasabah ==="
Add-Content -Path $logFile -Value "=== Selesai Pengujian Critical-Path API Nasabah ===`n"
Write-Host "Hasil pengujian telah disimpan di file $logFile"
