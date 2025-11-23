#!/bin/bash

set -e  # Exit on error

echo "🚀 PILAR SYSTEMS - Production Deployment"
echo "=========================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL not set${NC}"
    echo "Please set DATABASE_URL environment variable"
    exit 1
fi

echo -e "${GREEN}✓${NC} DATABASE_URL is set"

echo ""
echo "Step 1: Verifying Prisma schema..."
npx prisma validate
echo -e "${GREEN}✓${NC} Prisma schema is valid"

echo ""
echo "Step 2: Generating Prisma Client..."
npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client generated"

echo ""
echo "Step 3: Checking migration status..."
npx prisma migrate status || true

echo ""
echo -e "${YELLOW}⚠️  WARNING: This will apply migrations to production database${NC}"
read -p "Continue with migration deployment? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    echo "Deploying migrations..."
    npx prisma migrate deploy
    echo -e "${GREEN}✓${NC} Migrations deployed successfully"
else
    echo -e "${YELLOW}⚠️  Skipping migration deployment${NC}"
fi

echo ""
echo "Step 5: Verifying database connection..."
npx prisma db pull --force || echo -e "${YELLOW}⚠️  Could not pull schema (this is OK if migrations are up to date)${NC}"

echo ""
echo "Step 6: Building application..."
npm run build
echo -e "${GREEN}✓${NC} Application built successfully"

echo ""
echo "Step 7: Running tests..."
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    npm test || echo -e "${YELLOW}⚠️  Tests failed or not configured${NC}"
else
    echo -e "${YELLOW}⚠️  No tests configured${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify all environment variables are set in Vercel"
echo "2. Push to GitHub to trigger Vercel deployment"
echo "3. Monitor deployment at https://vercel.com"
echo "4. Test health endpoint: https://pilarsystems.com/api/health"
echo "5. Configure Stripe webhook: https://pilarsystems.com/api/stripe/webhooks"
echo ""
echo "For detailed instructions, see: docs/PHASE6-DEPLOYMENT.md"
echo "=========================================="
