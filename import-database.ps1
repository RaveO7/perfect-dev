# Script pour importer perfect_bdd.sql dans MySQL
Write-Host "🔍 Vérification de la connexion MySQL..." -ForegroundColor Yellow

$mysqlPath = "D:\xampp\mysql\bin\mysql.exe"
$maxAttempts = 30
$attempt = 0
$connected = $false

# Attendre que MySQL soit disponible
while ($attempt -lt $maxAttempts -and -not $connected) {
    $attempt++
    $result = & $mysqlPath -u root -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $connected = $true
        Write-Host "✅ MySQL est connecté!" -ForegroundColor Green
        break
    } else {
        Write-Host "⏳ Tentative $attempt/$maxAttempts - MySQL n'est pas encore disponible..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $connected) {
    Write-Host "❌ Impossible de se connecter à MySQL. Assurez-vous que MySQL est démarré dans XAMPP." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Création de la base de données si elle n'existe pas..." -ForegroundColor Yellow
& $mysqlPath -u root -e "CREATE DATABASE IF NOT EXISTS perfect_bdd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1 | Out-Null

Write-Host "📥 Import du fichier perfect_bdd.sql..." -ForegroundColor Yellow
$sqlFile = Join-Path $PSScriptRoot "perfect_bdd.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier $sqlFile introuvable!" -ForegroundColor Red
    exit 1
}

# Importer le fichier SQL
& $mysqlPath -u root perfect_bdd < $sqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Import réussi!" -ForegroundColor Green
    Write-Host "📊 Vérification des tables..." -ForegroundColor Yellow
    & $mysqlPath -u root perfect_bdd -e "SHOW TABLES; SELECT COUNT(*) as total_videos FROM Videos;"
} else {
    Write-Host "❌ Erreur lors de l'import!" -ForegroundColor Red
    exit 1
}

