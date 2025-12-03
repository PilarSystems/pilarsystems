'use client'

import { SubscriptionGuard } from '@/components/auth/SubscriptionGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SubscriptionGuard>
      {children}
    </SubscriptionGuard>
  )
}
