# PowerShell script for full testing of nasabah API endpoints including happy path, error path, and edge cases

$baseUrl = "http://localhost:5000/api/nasabah"
$logFile = "nasabah_api_test_log.txt"

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
        $responseJson = $response | ConvertTo-Json -Depth 5
        $logEntry += "Response:`n$responseJson`n"
        Write-Host $logEntry -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        $logEntry += "Error:`n$errorMsg`n"
        Write-Host $logEntry -ForegroundColor Red
    }
    $logEntry += "----------------------------------------`n"
    Add-Content -Path $logFile -Value $logEntry
}

Write-Host "=== Mulai Pengujian API Nasabah ==="
Add-Content -Path $logFile -Value "=== Mulai Pengujian API Nasabah ===`n"

# 1. GET all nasabah
Invoke-Api -Method GET -Url $baseUrl

# 2. POST new nasabah (valid)
$body = '{"id":"test123","name":"Nasabah Test"}'
Invoke-Api -Method POST -Url $baseUrl -Body $body

# 3. POST new nasabah (invalid, missing id)
$body = '{"name":"Nasabah Tanpa ID"}'
Invoke-Api -Method POST -Url $baseUrl -Body $body

# 4. PUT update nasabah (valid)
$body = '{"name":"Nasabah Test Diperbarui"}'
Invoke-Api -Method PUT -Url "$baseUrl/test123" -Body $body

# 5. PUT update nasabah (invalid id)
$body = '{"name":"Data Baru"}'
Invoke-Api -Method PUT -Url "$baseUrl/invalidid" -Body $body

# 6. POST bulk delete (valid id)
$body = '{"ids":["test123"]}'
Invoke-Api -Method POST -Url "$baseUrl/bulk-delete" -Body $body

# 7. POST bulk delete (empty array)
$body = '{"ids":[]}'
Invoke-Api -Method POST -Url "$baseUrl/bulk-delete" -Body $body

# 8. POST bulk delete (invalid id)
$body = '{"ids":["invalidid"]}'
Invoke-Api -Method POST -Url "$baseUrl/bulk-delete" -Body $body

Write-Host "=== Selesai Pengujian API Nasabah ==="
Add-Content -Path $logFile -Value "=== Selesai Pengujian API Nasabah ===`n"
Write-Host "Hasil pengujian telah disimpan di file $logFile"
