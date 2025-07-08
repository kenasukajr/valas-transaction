# PowerShell script to test nasabah API endpoints

$baseUrl = "http://localhost:5000/api/nasabah"

function Invoke-Api {
    param (
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )
    Write-Host "Request: $Method $Url"
    if ($Body) {
        Write-Host "Body: $Body"
    }
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers @{ "Content-Type" = "application/json" } -Body $Body
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        Write-Host "Response:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5 | Write-Host
    } catch {
        Write-Host "Error:" -ForegroundColor Red
        $_.Exception.Message
    }
    Write-Host "----------------------------------------"
}

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
