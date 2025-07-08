#!/usr/bin/env pwsh
# Server Manager Script
# Menjalankan Server Manager GUI atau operasi server melalui command line

param(
    [string]$Action = "gui",  # gui, start-backend, stop-backend, start-frontend, stop-frontend, restart-all
    [string]$IP = $null       # IP address override
)

$ErrorActionPreference = "Continue"
$ProjectRoot = $PSScriptRoot  # Use current script directory as project root
$BackendDir = Join-Path $ProjectRoot "backend"
$ServerManagerExe = Join-Path $ProjectRoot "tools\server-manager\bin\Debug\net8.0-windows\ServerManager.exe"

function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Cyan
}

function Get-LocalIP {
    try {
        $interfaces = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.InterfaceDescription -notlike "*Loopback*" }
        $ipAddresses = @()
        
        foreach ($interface in $interfaces) {
            $ipConfig = Get-NetIPAddress -InterfaceIndex $interface.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue
            foreach ($ip in $ipConfig) {
                if ($ip.IPAddress -notlike "169.254.*" -and $ip.IPAddress -ne "127.0.0.1") {
                    $ipAddresses += $ip.IPAddress
                }
            }
        }
        
        if ($ipAddresses.Count -eq 1) {
            return $ipAddresses[0]
        } elseif ($ipAddresses.Count -gt 1) {
            Write-Log "Multiple IP addresses found: $($ipAddresses -join ', ')"
            Write-Log "Using first IP: $($ipAddresses[0])"
            return $ipAddresses[0]
        } else {
            Write-Log "No valid IP address found, using localhost"
            return "localhost"
        }
    } catch {
        Write-Log "Error getting local IP: $($_.Exception.Message)"
        return "localhost"
    }
}

function Start-Backend {
    param([string]$IP = "localhost")
    
    Write-Log "Starting backend server..."
    
    if (-not (Test-Path $BackendDir)) {
        Write-Error "Backend directory not found: $BackendDir"
        return $false
    }
    
    $serverJs = Join-Path $BackendDir "server.js"
    if (-not (Test-Path $serverJs)) {
        Write-Error "server.js not found in: $BackendDir"
        return $false
    }
    
    # Update server.js to listen on all interfaces
    $content = Get-Content $serverJs -Raw
    $content = $content -replace "app\.listen\(([^,]+), ?'[^']*'", "app.listen(`$1, '0.0.0.0'"
    Set-Content $serverJs $content
    
    # Start backend
    $process = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $BackendDir -PassThru -WindowStyle Hidden
    Write-Log "Backend started with PID: $($process.Id)"
    Write-Log "Backend URL: http://${IP}:5000"
    
    return $true
}

function Stop-Backend {
    Write-Log "Stopping backend server..."
    
    # Kill processes on port 5000
    try {
        $processes = netstat -ano | findstr :5000
        if ($processes) {
            $processes | ForEach-Object {
                $parts = $_ -split '\s+' | Where-Object { $_ -ne "" }
                if ($parts.Length -ge 5) {
                    $processId = $parts[4]
                    taskkill /PID $processId /F 2>$null
                    Write-Log "Killed process PID: $processId"
                }
            }
        } else {
            Write-Log "No processes found on port 5000"
        }
    } catch {
        Write-Log "Error stopping backend: $($_.Exception.Message)"
    }
}

function Start-Frontend {
    param([string]$IP = "localhost")
    
    Write-Log "Starting frontend server..."
    
    # Update .env.local
    $envFile = Join-Path $ProjectRoot ".env.local"
    Set-Content $envFile "NEXT_PUBLIC_BACKEND_URL=http://${IP}:5000"
    Write-Log "Updated .env.local: NEXT_PUBLIC_BACKEND_URL=http://${IP}:5000"
    
    # Start frontend
    $process = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $ProjectRoot -PassThru -WindowStyle Hidden
    Write-Log "Frontend started with PID: $($process.Id)"
    Write-Log "Frontend URL: http://${IP}:8000"
    
    return $true
}

function Stop-Frontend {
    Write-Log "Stopping frontend server..."
    
    # Kill processes on port 8000
    try {
        $processes = netstat -ano | findstr :8000
        if ($processes) {
            $processes | ForEach-Object {
                $parts = $_ -split '\s+' | Where-Object { $_ -ne "" }
                if ($parts.Length -ge 5) {
                    $processId = $parts[4]
                    taskkill /PID $processId /F 2>$null
                    Write-Log "Killed process PID: $processId"
                }
            }
        } else {
            Write-Log "No processes found on port 8000"
        }
    } catch {
        Write-Log "Error stopping frontend: $($_.Exception.Message)"
    }
}

function Ensure-DirectoryJunctions {
    # Create junction from tools\backend to backend for backward compatibility with C# GUI
    $toolsBackend = Join-Path $ProjectRoot "tools\backend"
    $actualBackend = Join-Path $ProjectRoot "backend"
    
    if (-not (Test-Path $toolsBackend) -and (Test-Path $actualBackend)) {
        try {
            New-Item -ItemType Junction -Path $toolsBackend -Target $actualBackend -Force | Out-Null
            Write-Log "Created junction: tools\backend -> backend"
        } catch {
            Write-Log "Warning: Could not create backend junction: $($_.Exception.Message)"
        }
    }
}

# Main logic
Ensure-DirectoryJunctions

switch ($Action.ToLower()) {
    "gui" {
        Write-Log "Starting Server Manager GUI..."
        if (Test-Path $ServerManagerExe) {
            Start-Process $ServerManagerExe
            Write-Log "Server Manager GUI started"
        } else {
            Write-Error "Server Manager executable not found: $ServerManagerExe"
            Write-Log "Please build the Server Manager first or use command line options"
        }
    }
    "start-backend" {
        $localIP = if ($IP) { $IP } else { Get-LocalIP }
        Start-Backend -IP $localIP
    }
    "stop-backend" {
        Stop-Backend
    }
    "start-frontend" {
        $localIP = if ($IP) { $IP } else { Get-LocalIP }
        Start-Frontend -IP $localIP
    }
    "stop-frontend" {
        Stop-Frontend
    }
    "restart-all" {
        $localIP = if ($IP) { $IP } else { Get-LocalIP }
        Write-Log "Restarting all servers..."
        Stop-Backend
        Stop-Frontend
        Start-Sleep 2
        Start-Backend -IP $localIP
        Start-Sleep 2
        Start-Frontend -IP $localIP
        Write-Log "All servers restarted"
    }
    "status" {
        Write-Log "Checking server status..."
        
        $backend = netstat -ano | findstr :5000
        $frontend = netstat -ano | findstr :8000
        
        if ($backend) {
            Write-Host "Backend: RUNNING on port 5000" -ForegroundColor Green
        } else {
            Write-Host "Backend: STOPPED" -ForegroundColor Red
        }
        
        if ($frontend) {
            Write-Host "Frontend: RUNNING on port 8000" -ForegroundColor Green
        } else {
            Write-Host "Frontend: STOPPED" -ForegroundColor Red
        }
    }
    default {
        Write-Host @"
Server Manager Script Usage:

.\ServerManager.ps1 [Action] [IP]

Actions:
  gui             - Start Server Manager GUI (default)
  start-backend   - Start backend server
  stop-backend    - Stop backend server  
  start-frontend  - Start frontend server
  stop-frontend   - Stop frontend server
  restart-all     - Restart both servers
  status          - Check server status

Examples:
  .\ServerManager.ps1                    # Start GUI
  .\ServerManager.ps1 start-backend      # Start backend with auto-detected IP
  .\ServerManager.ps1 start-frontend 192.168.1.100  # Start frontend with specific IP
  .\ServerManager.ps1 restart-all        # Restart all servers
  .\ServerManager.ps1 status             # Check status
"@ -ForegroundColor Yellow
    }
}
