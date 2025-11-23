#!/bin/bash

set -e

echo "🔧 Removing Duplicate Export Declarations"
echo "=========================================="
echo ""

fixed=0

api_routes=$(find app/api -name "route.ts" -o -name "route.js")

for route in $api_routes; do
    runtime_count=$(grep -c "export const runtime" "$route" || echo 0)
    dynamic_count=$(grep -c "export const dynamic" "$route" || echo 0)
    
    if [ "$runtime_count" -gt 1 ] || [ "$dynamic_count" -gt 1 ]; then
        route_name=$(echo "$route" | sed 's|app/api/||' | sed 's|/route.ts||' | sed 's|/route.js||')
        echo "Fixing duplicates in: $route_name"
        
        awk '
        BEGIN { seen_runtime = 0; seen_dynamic = 0 }
        
        /export const runtime/ {
            if (seen_runtime == 0) {
                print
                seen_runtime = 1
            }
            next
        }
        
        /export const dynamic/ {
            if (seen_dynamic == 0) {
                print
                seen_dynamic = 1
            }
            next
        }
        
        { print }
        ' "$route" > "$route.tmp"
        
        mv "$route.tmp" "$route"
        fixed=$((fixed + 1))
    fi
done

echo ""
echo "=========================================="
echo "Fixed $fixed files with duplicate exports"
echo "✅ Done!"
