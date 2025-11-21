/**
 * Autopilot Stats API
 * 
 * Returns comprehensive statistics about the autopilot system
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jobQueue } from '@/lib/autopilot/job-queue'
import { eventBus } from '@/lib/autopilot/event-bus'
import { rateLimiter } from '@/lib/autopilot/rate-limiter'
import { policyEngine } from '@/lib/operator/policy-engine'
import { operatorRuntime } from '@/lib/autopilot/operator-runtime'

export const runtime = 'nodejs'

/**
 * GET /api/autopilot/stats
 * 
 * Query params:
 * - workspaceId (optional): Filter stats for specific workspace
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    const jobStats = await jobQueue.getStats()

    const eventStats = await eventBus.getStats()

    const operatorStatus = await operatorRuntime.getStatus()

    let workspaceStats = null
    if (workspaceId) {
      const [
        budgetStats,
        healthScore,
        policy,
        recentJobs,
        recentEvents
      ] = await Promise.all([
        rateLimiter.getStats(workspaceId),
        policyEngine.getHealthScore(workspaceId),
        policyEngine.getPolicy(workspaceId),
        prisma.autopilotJob.count({
          where: {
            workspaceId,
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        }),
        prisma.autopilotEvent.count({
          where: {
            workspaceId,
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        })
      ])

      workspaceStats = {
        workspaceId,
        healthScore,
        budgets: budgetStats,
        policy: {
          enabled: policy.enabled,
          features: policy.features,
          overagePolicy: policy.overagePolicy
        },
        activity: {
          jobsLast24h: recentJobs,
          eventsLast24h: recentEvents
        }
      }
    }

    const [
      totalWorkspaces,
      activeWorkspaces,
      totalJobs24h,
      totalEvents24h,
      failedJobs24h,
      failedEvents24h
    ] = await Promise.all([
      prisma.workspace.count(),
      prisma.workspace.count({
        where: {
          subscription: {
            status: 'active'
          }
        }
      }),
      prisma.autopilotJob.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.autopilotEvent.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.autopilotJob.count({
        where: {
          status: 'failed',
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.autopilotEvent.count({
        where: {
          status: 'failed',
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      })
    ])

    const systemStats = {
      workspaces: {
        total: totalWorkspaces,
        active: activeWorkspaces
      },
      activity: {
        jobsLast24h: totalJobs24h,
        eventsLast24h: totalEvents24h,
        failedJobsLast24h: failedJobs24h,
        failedEventsLast24h: failedEvents24h,
        jobFailureRate: totalJobs24h > 0 ? (failedJobs24h / totalJobs24h) : 0,
        eventFailureRate: totalEvents24h > 0 ? (failedEvents24h / totalEvents24h) : 0
      }
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      jobQueue: jobStats,
      eventBus: eventStats,
      operator: operatorStatus,
      system: systemStats,
      workspace: workspaceStats
    })
  } catch (error: any) {
    console.error('Error fetching autopilot stats:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch stats'
      },
      { status: 500 }
    )
  }
}
