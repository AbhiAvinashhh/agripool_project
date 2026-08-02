#!/usr/bin/env pwsh
# ============================================================
# AgriPool Azure Deployment Script
# ============================================================
# Prerequisites:
#   - Azure CLI installed and logged in (az login)
#   - Node.js installed
#   - Your MongoDB Atlas connection string
# ============================================================

param(
    [string]$ResourceGroup = "agripool-rg",
    [string]$Location = "eastus",
    [string]$AppServicePlan = "agripool-plan",
    [string]$BackendAppName = "agripool-api",        # Must be globally unique
    [string]$FrontendAppName = "agripool-web",       # Must be globally unique
    [Parameter(Mandatory=$true)]
    [string]$MongoDBUri,                             # Your MongoDB Atlas connection string
    [string]$SessionSecret = "agripool-super-secret-$(Get-Random -Maximum 9999)"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AgriPool Azure Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ----- 1. CHECK AZURE CLI LOGIN -----
Write-Host "`n[1/8] Checking Azure login..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "  Not logged in. Opening browser for login..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}
Write-Host "  Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host "  Subscription: $($account.name)" -ForegroundColor Green

# ----- 2. CREATE RESOURCE GROUP -----
Write-Host "`n[2/8] Creating resource group '$ResourceGroup' in '$Location'..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location | Out-Null
Write-Host "  Resource group ready." -ForegroundColor Green

# ----- 3. CREATE APP SERVICE PLAN -----
Write-Host "`n[3/8] Creating App Service Plan (Free tier, Linux)..." -ForegroundColor Yellow
az appservice plan create `
    --name $AppServicePlan `
    --resource-group $ResourceGroup `
    --sku F1 `
    --is-linux | Out-Null
Write-Host "  App Service Plan ready." -ForegroundColor Green

# ----- 4. CREATE BACKEND WEB APP -----
Write-Host "`n[4/8] Creating Backend App Service '$BackendAppName'..." -ForegroundColor Yellow
az webapp create `
    --name $BackendAppName `
    --resource-group $ResourceGroup `
    --plan $AppServicePlan `
    --runtime "NODE:20-lts" | Out-Null

$BackendUrl = "https://$BackendAppName.azurewebsites.net"
Write-Host "  Backend App created: $BackendUrl" -ForegroundColor Green

# ----- 5. SET BACKEND ENVIRONMENT VARIABLES -----
Write-Host "`n[5/8] Configuring backend environment variables..." -ForegroundColor Yellow

# We'll update CLIENT_URL after frontend is deployed; use placeholder for now
az webapp config appsettings set `
    --name $BackendAppName `
    --resource-group $ResourceGroup `
    --settings `
        MONGODB_URI="$MongoDBUri" `
        SESSION_SECRET="$SessionSecret" `
        NODE_ENV="production" `
        PORT="8080" `
        CLIENT_URL="https://$FrontendAppName.azurestaticapps.net" | Out-Null

Write-Host "  Environment variables set." -ForegroundColor Green

# ----- 6. DEPLOY BACKEND -----
Write-Host "`n[6/8] Deploying backend to Azure App Service..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\server"

# Create a zip of the server files (excluding node_modules)
$zipPath = "$env:TEMP\agripool-server.zip"
$filesToZip = Get-ChildItem -Exclude "node_modules", ".env" | Select-Object -ExpandProperty FullName
Compress-Archive -Path $filesToZip -DestinationPath $zipPath -Force

az webapp deploy `
    --name $BackendAppName `
    --resource-group $ResourceGroup `
    --src-path $zipPath `
    --type zip

# Install production dependencies on Azure
az webapp config appsettings set `
    --name $BackendAppName `
    --resource-group $ResourceGroup `
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true | Out-Null

Pop-Location
Write-Host "  Backend deployed!" -ForegroundColor Green

# ----- 7. BUILD AND DEPLOY FRONTEND -----
Write-Host "`n[7/8] Building and deploying frontend..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\client"

# Create .env.production with the backend URL
$envContent = "VITE_API_URL=$BackendUrl/api"
Set-Content -Path ".env.production" -Value $envContent
Write-Host "  Created .env.production: $envContent"

# Install dependencies and build
Write-Host "  Installing client dependencies..."
npm install --legacy-peer-deps --silent

Write-Host "  Building React app..."
npm run build

# Deploy to Azure Static Web Apps
Write-Host "  Creating Azure Static Web App '$FrontendAppName'..."
$swaCreate = az staticwebapp create `
    --name $FrontendAppName `
    --resource-group $ResourceGroup `
    --location "eastus2" `
    --source "$PSScriptRoot\client\dist" | ConvertFrom-Json

$FrontendUrl = "https://$($swaCreate.defaultHostname)"

# Deploy the built files
az staticwebapp deploy `
    --name $FrontendAppName `
    --resource-group $ResourceGroup `
    --source-path "dist" `
    --no-build

Pop-Location
Write-Host "  Frontend deployed!" -ForegroundColor Green

# ----- 8. UPDATE BACKEND CORS -----
Write-Host "`n[8/8] Updating backend CORS with frontend URL..." -ForegroundColor Yellow
az webapp config appsettings set `
    --name $BackendAppName `
    --resource-group $ResourceGroup `
    --settings CLIENT_URL="$FrontendUrl" | Out-Null

# Restart the backend to apply new CORS
az webapp restart --name $BackendAppName --resource-group $ResourceGroup | Out-Null

Write-Host "`n`n========================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT COMPLETE! 🚀" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n  Frontend (React App):" -ForegroundColor White
Write-Host "  → $FrontendUrl" -ForegroundColor Yellow
Write-Host "`n  Backend (API):" -ForegroundColor White
Write-Host "  → $BackendUrl" -ForegroundColor Yellow
Write-Host "`n  Health Check:" -ForegroundColor White
Write-Host "  → $BackendUrl/api/health" -ForegroundColor Yellow
Write-Host "`n  Azure Portal:" -ForegroundColor White
Write-Host "  → https://portal.azure.com/#resource/subscriptions/$($account.id)/resourceGroups/$ResourceGroup/overview" -ForegroundColor Yellow
Write-Host ""
