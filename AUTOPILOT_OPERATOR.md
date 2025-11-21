# PILAR AUTOPILOT v5.0 - Operator Runtime

## Overview

The Operator Runtime is the central orchestrator for PILAR AUTOPILOT v5.0. It provides a fully autonomous system that operates the entire SaaS platform for 100,000+ studios without manual intervention.

## Architecture

### Event-Driven Design

The Operator Runtime follows an event-driven architecture with three main components:

1. **Signal Aggregator** - Scans for signals across all workspaces
2. **Policy Engine** - Makes deterministic decisions based on signals
3. **Action Executor** - Executes actions with distributed locking

### Key Principles

- **Deterministic Control Plane**: All decisions are made via policy engine, not LLM
- **LLM for Content Only**: OpenAI is used only for generating messages, not control flow
- **Distributed Locking**: Prevents concurrent operations on the same workspace
- **Graceful Degradation**: System continues operating even if optional providers are offline
- **Audit Trail**: All operator actions are logged to ActivityLog

## Components

### 1. Signal Aggregator (`scanSignals`)

Scans for operational signals across all workspaces:

- **Health Degraded**: Workspaces with degraded or unhealthy status
- **Provisioning Needed**: Failed provisioning jobs that need retry
- **Followup Due**: Scheduled followups ready to be sent
- **Webhook Failed**: Failed webhook deliveries
- **Integration Offline**: Offline integrations needing restart

**Signals per run**: Up to 100 (configurable)

### 2. Policy Engine (`decideActions`)

Makes deterministic decisions based on signals:

```typescript
Signal Type           → Action Type           → Priority
health_degraded       → run_provisioning      → Critical/High
provisioning_needed   → run_provisioning      → Medium
followup_due          → send_followup         → Low
webhook_failed        → retry_webhook         → Medium
integration_offline   → restart_integration   → High
```

### 3. Action Executor (`executeActions`)

Executes actions with safety guarantees:

- **Distributed Locking**: Acquires workspace lock before execution (5min TTL)
- **Error Handling**: Logs errors, continues with next action
- **Activity Logging**: Records all operator actions to database
- **Workspace Isolation**: Never crosses workspaceId boundaries

**Actions per run**: Up to 50 (configurable)

## Invocation

The Operator Runtime can be invoked via:

1. **Vercel Cron** (daily at 10:00 UTC)
   ```
   GET/POST /api/operator/run
   ```

2. **Manual Trigger**
   ```bash
   curl -X POST https://your-domain.com/api/operator/run
   ```

3. **Opportunistic Trigger** (rate-limited)
   - After provisioning completion
   - After webhook processing
   - After health check degradation

## Scaling

### Current Limits

- **Max Signals per Run**: 100 workspaces
- **Max Actions per Run**: 50 actions
- **Lock TTL**: 5 minutes
- **Retry Attempts**: 1 (fail fast)

### 10,000+ Studios

For scaling to 10,000+ studios:

1. **Horizontal Scaling**: Run multiple operator instances with different workspace ranges
2. **Priority Queues**: Process critical signals first
3. **Backpressure**: Rate limit actions per workspace per day
4. **Sharding**: Partition workspaces by region or tier

## Monitoring

### Metrics

The Operator Runtime returns metrics after each run:

```typescript
{
  signalsProcessed: number    // Total signals scanned
  actionsExecuted: number      // Actions successfully executed
  errors: number               // Errors encountered
  workspacesAffected: string[] // List of workspace IDs affected
}
```

### Health Checks

Monitor operator health via:

```bash
GET /api/autopilot/health
```

Returns aggregated health status for all workspaces.

## Configuration

### Environment Variables

```bash
# Operator Runtime
OPERATOR_MAX_SIGNALS=100
OPERATOR_MAX_ACTIONS=50
OPERATOR_LOCK_TTL_MS=300000

# Vercel Cron (vercel.json)
{
  "crons": [
    {
      "path": "/api/operator/run",
      "schedule": "0 10 * * *"  # Daily at 10:00 UTC
    }
  ]
}
```

## Conclusion

The Operator Runtime is the foundation of PILAR AUTOPILOT v5.0. After launch, the founder only handles Marketing, Sales, and Support emails. Everything else is fully automated.
