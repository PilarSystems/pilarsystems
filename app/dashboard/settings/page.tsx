'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your studio settings and integrations
          </p>
        </div>

        <Tabs defaultValue="studio">
          <TabsList>
            <TabsTrigger value="studio">Studio Info</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="ai">AI Rules</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="studio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Studio Information</CardTitle>
                <CardDescription>Update your studio details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studioName">Studio Name</Label>
                    <Input id="studioName" placeholder="My Fitness Studio" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+49123456789" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Street Address" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Berlin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="10115" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">You (Owner)</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        owner@studio.com
                      </p>
                    </div>
                    <Badge>Owner</Badge>
                  </div>
                  <Button>Invite Team Member</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Rules</CardTitle>
                <CardDescription>Configure AI automation rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">High Intent Lead Classification</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically classify leads with high purchase intent
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Missed Call Follow-up</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Send WhatsApp follow-up for missed calls
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Probetraining Reminder</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Send reminder 24h before probetraining
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  </div>
                  <Button>Add New Rule</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Manage your connected services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">WhatsApp Business API</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI-powered WhatsApp messaging
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Twilio Phone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI call handling and transcription
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email (IMAP/SMTP)</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI email automation
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Calendar sync and automation
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">PILAR BASIC</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">€100/month</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Billing History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">November 2025</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Paid on Nov 1, 2025
                        </p>
                      </div>
                      <p className="font-medium">€100.00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
