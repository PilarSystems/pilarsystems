/**
 * Dashboard Layout
 * 
 * Protected layout for studio owner dashboard
 */

import { Sidebar } from '@/src/components/dashboard/Sidebar'
import { Topbar } from '@/src/components/dashboard/Topbar'
import { AuthProvider } from '@/src/components/dashboard/AuthProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Topbar */}
          <Topbar />

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
