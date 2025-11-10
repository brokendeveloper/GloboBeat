# Script de teste simplificado para o sistema de upload GloboBeat (PowerShell)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "GloboBeat Upload System - Test Suite" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:3000"
$ErrorActionPreference = "Stop"

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/health" -Method GET
    Write-Host "OK Health check passed" -ForegroundColor Green
    Write-Host "  Service: $($response.service)" -ForegroundColor Gray
}
catch {
    Write-Host "FAIL Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Create test file
Write-Host "Test 2: Creating test file..." -ForegroundColor Yellow
$TEST_FILE = "test-audio.mp3"
"This is a test audio file" | Out-File -FilePath $TEST_FILE -Encoding ASCII -NoNewline
Write-Host "OK Test file created: $TEST_FILE" -ForegroundColor Green
Write-Host ""

# Test 3: Upload file
Write-Host "Test 3: Uploading file..." -ForegroundColor Yellow
try {
    $filePath = (Resolve-Path $TEST_FILE).Path

    Add-Type -AssemblyName System.Net.Http
    $client = New-Object System.Net.Http.HttpClient
    $content = New-Object System.Net.Http.MultipartFormDataContent

    $fileStream = [System.IO.File]::OpenRead($filePath)
    $fileContent = New-Object System.Net.Http.StreamContent($fileStream)
    $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("audio/mpeg")
    $content.Add($fileContent, "file", $TEST_FILE)

    $response = $client.PostAsync("$API_URL/api/upload", $content).Result
    $responseContent = $response.Content.ReadAsStringAsync().Result
    $fileStream.Close()

    if ($response.IsSuccessStatusCode) {
        Write-Host "OK Upload successful (HTTP $([int]$response.StatusCode))" -ForegroundColor Green
        $result = $responseContent | ConvertFrom-Json
        $UPLOAD_ID = $result.upload.id
        Write-Host "  Upload ID: $UPLOAD_ID" -ForegroundColor Gray
    }
    else {
        Write-Host "FAIL Upload failed (HTTP $([int]$response.StatusCode))" -ForegroundColor Red
        Write-Host "  Response: $responseContent" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "FAIL Upload error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: Get upload by ID
if ($UPLOAD_ID) {
    Write-Host "Test 4: Fetching upload by ID..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/api/upload/$UPLOAD_ID" -Method GET
        Write-Host "OK Get upload successful" -ForegroundColor Green
        Write-Host "  Filename: $($response.upload.original_filename)" -ForegroundColor Gray
    }
    catch {
        Write-Host "FAIL Get upload failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 5: List all uploads
Write-Host "Test 5: Listing all uploads..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/uploads" -Method GET
    Write-Host "OK List uploads successful" -ForegroundColor Green
    Write-Host "  Total uploads: $($response.count)" -ForegroundColor Gray
}
catch {
    Write-Host "FAIL List uploads failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Cleanup
Write-Host "Cleaning up test files..." -ForegroundColor Yellow
Remove-Item -Path $TEST_FILE -ErrorAction SilentlyContinue
Write-Host "OK Cleanup complete" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Test Suite Complete!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Check AWS S3 Console to verify files were uploaded" -ForegroundColor Gray
Write-Host "2. Check PostgreSQL database to verify records were created" -ForegroundColor Gray
Write-Host "3. Test the frontend at http://localhost:3001/page_upload" -ForegroundColor Gray
Write-Host ""
Write-Host "To check database:" -ForegroundColor White
Write-Host '  docker exec -it trilhas_db psql -U user -d trilhas -c "SELECT * FROM uploads;"' -ForegroundColor Gray
Write-Host ""
