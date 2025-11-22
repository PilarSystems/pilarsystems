# Open Questions - Backend Skeleton Implementation

**Date:** November 22, 2024  
**Task:** Phase 1, Task 1 - Repo Cleanup & /server Skeleton  
**Status:** In Progress

## Missing Documentation

### Critical Missing Files
1. **AGENTS.md** - Referenced in task instructions but not found in repository
2. **docs/ARCHITECTURE-PILAR-SYSTEMS.md** - Referenced in task instructions but not found

**Action Taken:** Using AUTOPILOT_V6_ARCHITECTURE.md as architectural guide

## Implementation Strategy

### Directory Structure
Created `/src/server/` alongside existing structure to minimize risk:
- `/src/server/core` - Core business logic
- `/src/server/connectors` - External service connectors
- `/src/server/orchestrator` - Workflow orchestration
- `/src/server/tenants` - Multi-tenant management
- `/src/server/webhooks` - Webhook handlers
- `/src/server/db` - Database client (bridges to lib/prisma)

### Fastify Integration
Using Fastify as module with server.inject() pattern for serverless-friendly deployment.

### Cleanup Decision
All existing backend code (lib/autopilot, services/, app/api/) is actively used and preserved.
