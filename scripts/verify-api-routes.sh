#!/bin/bash

set -e

echo "🔍 Verifying API Routes Configuration"
echo "======================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

errors=0
warnings=0
checked=0

api_routes=$(find app/api -name "route.ts" -o -name "route.js")

echo "Found $(echo "$api_routes" | wc -l) API routes"
echo ""

for route in $api_routes; do
    checked=$((checked + 1))
    route_name=$(echo "$route" | sed 's|app/api/||' | sed 's|/route.ts||' | sed 's|/route.js||')
    
    if ! grep -q "runtime.*=.*['\"]nodejs['\"]" "$route"; then
        echo -e "${RED}❌ Missing runtime='nodejs': $route_name${NC}"
        errors=$((errors + 1))
    fi
    
    if ! grep -q "dynamic.*=.*['\"]force-dynamic['\"]" "$route"; then
        echo -e "${YELLOW}⚠️  Missing dynamic='force-dynamic': $route_name${NC}"
        warnings=$((warnings + 1))
    fi
    
    if grep -q "from.*prisma\|from.*stripe\|from.*twilio\|from.*openai" "$route"; then
        if ! grep -q "runtime.*=.*['\"]nodejs['\"]" "$route"; then
            echo -e "${RED}❌ Server-only imports without runtime='nodejs': $route_name${NC}"
            errors=$((errors + 1))
        fi
    fi
done

echo ""
echo "======================================"
echo "Verification Summary:"
echo "- Routes checked: $checked"
echo -e "- Errors: ${RED}$errors${NC}"
echo -e "- Warnings: ${YELLOW}$warnings${NC}"

if [ $errors -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ Verification failed! Please fix errors before deploying.${NC}"
    exit 1
elif [ $warnings -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Verification passed with warnings. Consider fixing them.${NC}"
    exit 0
else
    echo ""
    echo -e "${GREEN}✅ All API routes properly configured!${NC}"
    exit 0
fi
