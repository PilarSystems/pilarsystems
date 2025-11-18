'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    leadConversion: {
      totalLeads: 0,
      showedUp: 0,
      converted: 0,
      conversionRate: 0,
    },
    channelPerformance: {
      whatsapp: 0,
      email: 0,
      phone: 0,
      website: 0,
    },
    revenueMetrics: {
      mrr: 0,
      newMembers: 0,
      churnRate: 0,
    },
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
    }
    fetchAnalytics()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your studio's performance and growth
          </p>
        </div>

        <Tabs defaultValue="conversion">
          <TabsList>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="conversion" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.leadConversion.totalLeads}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Showed Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.leadConversion.showedUp}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {analytics.leadConversion.totalLeads > 0
                      ? Math.round(
                          (analytics.leadConversion.showedUp /
                            analytics.leadConversion.totalLeads) *
                            100
                        )
                      : 0}
                    % show rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Converted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.leadConversion.converted}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">New members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.leadConversion.conversionRate}%
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lead to member</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead journey from inquiry to membership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">Leads</div>
                    <div className="flex-1 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-medium">
                      {analytics.leadConversion.totalLeads}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">Showed Up</div>
                    <div
                      className="h-8 bg-green-600 rounded flex items-center justify-center text-white text-sm font-medium"
                      style={{
                        width: `${
                          analytics.leadConversion.totalLeads > 0
                            ? (analytics.leadConversion.showedUp /
                                analytics.leadConversion.totalLeads) *
                              100
                            : 0
                        }%`,
                      }}
                    >
                      {analytics.leadConversion.showedUp}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">Converted</div>
                    <div
                      className="h-8 bg-purple-600 rounded flex items-center justify-center text-white text-sm font-medium"
                      style={{
                        width: `${
                          analytics.leadConversion.totalLeads > 0
                            ? (analytics.leadConversion.converted /
                                analytics.leadConversion.totalLeads) *
                              100
                            : 0
                        }%`,
                      }}
                    >
                      {analytics.leadConversion.converted}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.channelPerformance.whatsapp}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.channelPerformance.email}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.channelPerformance.phone}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Website</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.channelPerformance.website}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MRR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{analytics.revenueMetrics.mrr}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Monthly Recurring Revenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.revenueMetrics.newMembers}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.revenueMetrics.churnRate}%</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Monthly churn</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
