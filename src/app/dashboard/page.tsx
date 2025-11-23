'use client'

/**
 * Dashboard Overview Page
 * 
 * Main dashboard page for studio owners
 */

import { useAuth } from '@/src/components/dashboard/AuthProvider'
import { Activity, Users, MessageSquare, Phone } from 'lucide-react'

export default function DashboardPage() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session?.email}! Here's what's happening with your studio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Conversations */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Conversations</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">No conversations yet</p>
        </div>

        {/* Active Leads */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Leads</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">No leads yet</p>
        </div>

        {/* Voice Calls */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Voice Calls</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">No calls yet</p>
        </div>

        {/* Agent Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agent Status</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">Active</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-green-600">● All systems operational</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <button className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left hover:bg-gray-100">
            <h3 className="font-medium text-gray-900">Configure Agent</h3>
            <p className="mt-1 text-sm text-gray-600">
              Set up your AI assistant personality and rules
            </p>
          </button>

          <button className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left hover:bg-gray-100">
            <h3 className="font-medium text-gray-900">Connect Channels</h3>
            <p className="mt-1 text-sm text-gray-600">
              Link WhatsApp, Voice, and Email channels
            </p>
          </button>

          <button className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left hover:bg-gray-100">
            <h3 className="font-medium text-gray-900">View Logs</h3>
            <p className="mt-1 text-sm text-gray-600">
              Monitor real-time conversations and events
            </p>
          </button>
        </div>
      </div>

      {/* Getting Started */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-semibold text-blue-900">Getting Started</h2>
        <p className="mt-2 text-sm text-blue-700">
          Your dashboard is ready! Here's what you can do next:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <span className="mr-2">1.</span>
            <span>Configure your AI agent in the Agent Builder</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2.</span>
            <span>Connect your WhatsApp and Voice channels</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3.</span>
            <span>Set up your studio settings and business hours</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4.</span>
            <span>Test your agent in the Live Console</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
