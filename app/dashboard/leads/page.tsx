'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        if (response.ok) {
          const data = await response.json()
          setLeads(data)
        }
      } catch (error) {
        // console.error('Failed to fetch leads:', error)
      }
    }
    fetchLeads()
  }, [])

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'A':
        return 'bg-green-600'
      case 'B':
        return 'bg-yellow-600'
      case 'C':
        return 'bg-gray-600'
      default:
        return 'bg-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600'
      case 'medium':
        return 'bg-orange-600'
      case 'low':
        return 'bg-blue-600'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track your studio leads
            </p>
          </div>
          <Button>Add Lead</Button>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="A">Class A</TabsTrigger>
            <TabsTrigger value="B">Class B</TabsTrigger>
            <TabsTrigger value="C">Class C</TabsTrigger>
            <TabsTrigger value="unclassified">Unclassified</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {leads.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No leads yet. Your AI will automatically create leads from incoming messages and calls.
                    </p>
                    <Button>Add Your First Lead</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {lead.name}
                            <Badge className={getClassificationColor(lead.classification)}>
                              {lead.classification || 'Unclassified'}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                              {lead.priority}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {lead.email} • {lead.phone}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Source:</span>{' '}
                          <span className="font-medium">{lead.source}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>{' '}
                          <span className="font-medium">{lead.status}</span>
                        </div>
                        {lead.lastContactedAt && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Last Contact:</span>{' '}
                            <span className="font-medium">
                              {new Date(lead.lastContactedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
