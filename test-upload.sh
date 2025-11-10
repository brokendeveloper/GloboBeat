#!/bin/bash

# Script de teste automatizado para o sistema de upload GloboBeat
# Este script testa o fluxo completo de upload

set -e  # Exit on error

echo "========================================="
echo "🧪 GloboBeat Upload System - Test Suite"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"
UPLOAD_ENDPOINT="$API_URL/api/upload"
HEALTH_ENDPOINT="$API_URL/api/health"

# Test 1: Health Check
echo "📡 Test 1: Health Check..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$HEALTH_ENDPOINT")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "  Response: $BODY"
else
    echo -e "${RED}✗ Health check failed (HTTP $HTTP_CODE)${NC}"
    exit 1
fi
echo ""

# Test 2: Create test file
echo "📝 Test 2: Creating test file..."
TEST_FILE="test-audio.mp3"
echo "This is a test audio file" > "$TEST_FILE"
echo -e "${GREEN}✓ Test file created: $TEST_FILE${NC}"
echo ""

# Test 3: Upload file
echo "📤 Test 3: Uploading file..."
UPLOAD_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$UPLOAD_ENDPOINT" \
  -F "file=@$TEST_FILE")
HTTP_CODE=$(echo "$UPLOAD_RESPONSE" | tail -n 1)
BODY=$(echo "$UPLOAD_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✓ Upload successful (HTTP $HTTP_CODE)${NC}"
    echo "  Response: $BODY"

    # Extract upload ID
    UPLOAD_ID=$(echo "$BODY" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    echo "  Upload ID: $UPLOAD_ID"
else
    echo -e "${RED}✗ Upload failed (HTTP $HTTP_CODE)${NC}"
    echo "  Response: $BODY"
    exit 1
fi
echo ""

# Test 4: Get upload by ID
if [ -n "$UPLOAD_ID" ]; then
    echo "🔍 Test 4: Fetching upload by ID..."
    GET_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/upload/$UPLOAD_ID")
    HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n 1)
    BODY=$(echo "$GET_RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}✓ Get upload successful${NC}"
        echo "  Response: $BODY"
    else
        echo -e "${RED}✗ Get upload failed (HTTP $HTTP_CODE)${NC}"
        exit 1
    fi
    echo ""
fi

# Test 5: List all uploads
echo "📋 Test 5: Listing all uploads..."
LIST_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/uploads")
HTTP_CODE=$(echo "$LIST_RESPONSE" | tail -n 1)
BODY=$(echo "$LIST_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ List uploads successful${NC}"
    COUNT=$(echo "$BODY" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo "  Total uploads: $COUNT"
else
    echo -e "${RED}✗ List uploads failed (HTTP $HTTP_CODE)${NC}"
    exit 1
fi
echo ""

# Test 6: Invalid file type
echo "🚫 Test 6: Testing invalid file type..."
INVALID_FILE="test.txt"
echo "This is a text file" > "$INVALID_FILE"
INVALID_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$UPLOAD_ENDPOINT" \
  -F "file=@$INVALID_FILE")
HTTP_CODE=$(echo "$INVALID_RESPONSE" | tail -n 1)
BODY=$(echo "$INVALID_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✓ Invalid file type correctly rejected${NC}"
else
    echo -e "${YELLOW}⚠ Expected HTTP 400, got $HTTP_CODE${NC}"
fi
echo ""

# Test 7: No file provided
echo "🚫 Test 7: Testing upload without file..."
NO_FILE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$UPLOAD_ENDPOINT")
HTTP_CODE=$(echo "$NO_FILE_RESPONSE" | tail -n 1)
BODY=$(echo "$NO_FILE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✓ No file correctly rejected${NC}"
else
    echo -e "${YELLOW}⚠ Expected HTTP 400, got $HTTP_CODE${NC}"
fi
echo ""

# Cleanup
echo "🧹 Cleaning up test files..."
rm -f "$TEST_FILE" "$INVALID_FILE"
echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""

# Summary
echo "========================================="
echo "🎉 Test Suite Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Check AWS S3 Console to verify files were uploaded"
echo "2. Check PostgreSQL database to verify records were created"
echo "3. Test the frontend at http://localhost:3001/page_upload"
echo ""
echo "To check database:"
echo "  docker exec -it trilhas_db psql -U user -d trilhas -c 'SELECT * FROM uploads;'"
echo ""
echo "To check S3:"
echo "  aws s3 ls s3://globobeat-uploads/uploads/"
echo ""
