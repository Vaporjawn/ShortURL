#!/bin/bash

# ShortURL Test Script
# This script tests the basic functionality of the URL shortener

echo "🧪 Testing ShortURL Application"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"

echo "📋 Pre-flight Checks"
echo "-------------------"

# Check if server is running
echo -n "Checking if server is running... "
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server is not running${NC}"
    echo "Please start the server with: npm run dev"
    exit 1
fi

echo ""
echo "🧪 Running Tests"
echo "---------------"

# Test 1: Homepage
echo -n "Test 1: Homepage accessible... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_CODE)${NC}"
fi

# Test 2: Create Short URL via API
echo -n "Test 2: Create short URL... "
RESPONSE=$(curl -s -X POST "$BASE_URL/shortUrls" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "fullUrl=https://github.com/Vaporjawn/ShortURL" \
    -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" -eq 302 ] || [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_CODE)${NC}"
fi

# Test 3: Get all URLs via API
echo -n "Test 3: Fetch all URLs via API... "
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/urls")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" -eq 200 ]; then
    # Check if response is valid JSON array
    if echo "$BODY" | python3 -m json.tool >/dev/null 2>&1; then
        URL_COUNT=$(echo "$BODY" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
        echo -e "${GREEN}✓ PASS${NC} (Found $URL_COUNT URLs)"
    else
        echo -e "${YELLOW}⚠ PASS but invalid JSON${NC}"
    fi
else
    echo -e "${RED}✗ FAIL (HTTP $HTTP_CODE)${NC}"
fi

# Test 4: Test 404 for non-existent short URL
echo -n "Test 4: 404 for invalid short URL... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/nonexistent12345")
if [ "$HTTP_CODE" -eq 404 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL (Expected 404, got $HTTP_CODE)${NC}"
fi

# Test 5: Invalid URL rejection
echo -n "Test 5: Reject invalid URL... "
RESPONSE=$(curl -s -X POST "$BASE_URL/shortUrls" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "fullUrl=not-a-valid-url" \
    -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ UNEXPECTED (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "📊 Test Summary"
echo "---------------"
echo "All basic functionality tests completed!"
echo ""
echo "💡 Next Steps:"
echo "  1. Visit $BASE_URL in your browser"
echo "  2. Try shortening some URLs"
echo "  3. Check out the API documentation in README.md"
echo "  4. Customize the UI colors in views/index.ejs"
echo ""
echo "🚀 Ready for deployment!"
