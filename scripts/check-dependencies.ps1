#!/usr/bin/env pwsh
# Dependency Check Script
# Memastikan semua dependencies backend ter-install dengan benar

$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

function Write-Log {
    param([string]$Message, [string]$Color = "Cyan")
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Check-NodeModules {
    $nodeModulesPath = Join-Path $ProjectRoot "node_modules"
    if (-not (Test-Path $nodeModulesPath)) {
        Write-Log "node_modules folder not found, running npm install..." "Yellow"
        Set-Location $ProjectRoot
        npm install
        return $?
    }
    return $true
}

function Check-BackendDependencies {
    Write-Log "Checking backend dependencies..."
    
    $requiredPackages = @(
        "express",
        "cors", 
        "multer",
        "googleapis"
    )
    
    $missingPackages = @()
    
    foreach ($package in $requiredPackages) {
        $packagePath = Join-Path $ProjectRoot "node_modules\$package"
        if (-not (Test-Path $packagePath)) {
            $missingPackages += $package
        }
    }
    
    if ($missingPackages.Count -gt 0) {
        Write-Log "Missing packages: $($missingPackages -join ', ')" "Red"
        Write-Log "Installing missing packages..." "Yellow"
        Set-Location $ProjectRoot
        npm install $missingPackages
        return $?
    } else {
        Write-Log "All backend dependencies are installed" "Green"
        return $true
    }
}

function Test-BackendConnection {
    Write-Log "Testing backend server startup..."
    
    $backendDir = Join-Path $ProjectRoot "backend"
    $serverJs = Join-Path $backendDir "server.js"
    
    if (-not (Test-Path $serverJs)) {
        Write-Log "server.js not found in: $backendDir" "Red"
        return $false
    }
    
    # Test require dependencies
    $testScript = @"
try {
    const express = require('express');
    const cors = require('cors');
    const multer = require('multer');
    const { google } = require('googleapis');
    console.log('All dependencies loaded successfully');
    process.exit(0);
} catch (error) {
    console.error('Dependency error:', error.message);
    process.exit(1);
}
"@
    
    $testFile = Join-Path $ProjectRoot "temp-dependency-test.js"
    Set-Content $testFile $testScript
    
    try {
        Set-Location $ProjectRoot
        $result = node $testFile 2>&1
        Remove-Item $testFile -Force
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Backend dependencies test passed" "Green"
            return $true
        } else {
            Write-Log "Backend dependencies test failed: $result" "Red"
            return $false
        }
    } catch {
        Write-Log "Error testing dependencies: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Main execution
Write-Log "Starting dependency check..."

$success = $true

if (-not (Check-NodeModules)) {
    $success = $false
}

if (-not (Check-BackendDependencies)) {
    $success = $false
}

if (-not (Test-BackendConnection)) {
    $success = $false
}

if ($success) {
    Write-Log "All dependency checks passed!" "Green"
    exit 0
} else {
    Write-Log "Some dependency checks failed!" "Red"
    exit 1
}
