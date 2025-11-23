#!/bin/bash

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Testing API Endpoints"
echo "========================"
echo "Base URL: $BASE_URL"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

passed=0
failed=0

test_endpoint() {
    local method=$1
    local path=$2
    local expected_status=$3
    local description=$4
    local data=$5
    
    echo -n "Testing $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$path" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$path" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi
    
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $status)"
        passed=$((passed + 1))
        return 0
    else
        echo -e "${RED}✗${NC} (Expected $expected_status, got $status)"
        echo "  Response: $body"
        failed=$((failed + 1))
        return 1
    fi
}

test_endpoint "GET" "/api/health" "200" "Health Check"

test_endpoint "POST" "/api/stripe/webhooks" "400" "Stripe Webhook (no signature)" '{"type":"test"}'

test_endpoint "GET" "/api/stripe/subscription-status?userId=test-invalid" "404" "Subscription Status (not found)"

test_endpoint "POST" "/api/gymbuddy/start" "200" "Gym Buddy Start" '{"userId":"test-123","phoneNumber":"+49123456789"}'

test_endpoint "POST" "/api/gymbuddy/message" "200" "Gym Buddy Message" '{"userId":"test-123","content":"Test","channel":"web"}'

test_endpoint "GET" "/api/gymbuddy/me?userId=test-123" "200" "Gym Buddy Profile"

test_endpoint "GET" "/api/admin/metrics" "401" "Admin Metrics (no auth)"

test_endpoint "GET" "/api/autopilot/health" "200" "Autopilot Health"

echo ""
echo "========================"
echo "Test Summary:"
echo -e "- Passed: ${GREEN}$passed${NC}"
echo -e "- Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -gt 0 ]; then
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
fi
