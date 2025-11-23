#!/bin/bash

set -e

echo "🔧 Fixing API Routes Configuration"
echo "===================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

fixed=0
skipped=0

api_routes=$(find app/api -name "route.ts" -o -name "route.js")

echo "Found $(echo "$api_routes" | wc -l) API routes"
echo ""

for route in $api_routes; do
    route_name=$(echo "$route" | sed 's|app/api/||' | sed 's|/route.ts||' | sed 's|/route.js||')
    
    has_runtime=$(grep -c "export const runtime.*=.*['\"]nodejs['\"]" "$route" || echo 0)
    has_dynamic=$(grep -c "export const dynamic.*=.*['\"]force-dynamic['\"]" "$route" || echo 0)
    
    if [ "$has_runtime" -gt 0 ] && [ "$has_dynamic" -gt 0 ]; then
        skipped=$((skipped + 1))
        continue
    fi
    
    echo "Fixing: $route_name"
    
    tmp_file=$(mktemp)
    
    awk '
    BEGIN { added_runtime = 0; added_dynamic = 0; in_imports = 1 }
    
    /^import / { in_imports = 1; print; next }
    /^$/ && in_imports { print; next }
    
    in_imports && !/^import / && !/^$/ && !/^export const runtime/ && !/^export const dynamic/ {
        in_imports = 0
        
        if (added_runtime == 0 && !/export const runtime/) {
            print ""
            print "export const runtime = '\''nodejs'\''"
            added_runtime = 1
        }
        
        if (added_dynamic == 0 && !/export const dynamic/) {
            print "export const dynamic = '\''force-dynamic'\''"
            print ""
            added_dynamic = 1
        }
        
        print
        next
    }
    
    { print }
    ' "$route" > "$tmp_file"
    
    mv "$tmp_file" "$route"
    
    fixed=$((fixed + 1))
done

echo ""
echo "===================================="
echo "Fix Summary:"
echo -e "- Routes fixed: ${GREEN}$fixed${NC}"
echo -e "- Routes skipped (already OK): ${YELLOW}$skipped${NC}"
echo ""
echo -e "${GREEN}✅ API routes fixed!${NC}"
echo ""
echo "Run './scripts/verify-api-routes.sh' to verify the fixes"
