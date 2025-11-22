'use client'

/**
 * Dashboard Topbar
 * 
 * Header with tenant name and user menu
 */

import { useAuth } from './AuthProvider'
import { LogOut, User } from 'lucide-react'
import { useState } from 'react'

export function Topbar() {
  const { session, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left side - empty for now */}
      <div />

      {/* Right side - Tenant name + User menu */}
      <div className="flex items-center space-x-4">
        {/* Tenant name */}
        {session?.tenantName && (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{session.tenantName}</div>
            <div className="text-xs text-gray-500">Studio Dashboard</div>
          </div>
        )}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <User className="h-4 w-4" />
            <span>{session?.email}</span>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                    }}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
