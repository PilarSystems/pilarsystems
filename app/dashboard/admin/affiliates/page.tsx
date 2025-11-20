'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  MousePointerClick, 
  TrendingUp, 
  Euro,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download
} from 'lucide-react'

interface Affiliate {
  id: string
  code: string
  name: string
  email: string
  company: string | null
  status: 'active' | 'pending' | 'suspended'
  createdAt: string
  stats: {
    clicks: number
    leads: number
    customers: number
    totalCommission: number
    pendingCommission: number
    paidCommission: number
  }
}

interface AdminStats {
  totalAffiliates: number
  activeAffiliates: number
  totalClicks: number
  totalLeads: number
  totalCustomers: number
  totalCommissionPaid: number
  totalCommissionPending: number
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setAdminStats({
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalClicks: 0,
        totalLeads: 0,
        totalCustomers: 0,
        totalCommissionPaid: 0,
        totalCommissionPending: 0,
      })
      setAffiliates([])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Lade Admin-Daten...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Affiliate Management</h1>
          <p className="text-gray-400">Übersicht aller Partner und deren Performance</p>
        </motion.div>

        {/* Admin Stats Grid */}
        {adminStats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Users,
                label: 'Partner',
                value: adminStats.totalAffiliates,
                subtext: `${adminStats.activeAffiliates} aktiv`,
                color: 'cyan',
              },
              {
                icon: MousePointerClick,
                label: 'Gesamt Klicks',
                value: adminStats.totalClicks,
                color: 'blue',
              },
              {
                icon: TrendingUp,
                label: 'Gesamt Kunden',
                value: adminStats.totalCustomers,
                color: 'green',
              },
              {
                icon: Euro,
                label: 'Provisionen',
                value: `${adminStats.totalCommissionPaid.toFixed(0)}€`,
                subtext: `${adminStats.totalCommissionPending.toFixed(0)}€ ausstehend`,
                color: 'yellow',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 text-${stat.color}-400`} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                {stat.subtext && (
                  <div className="text-xs text-gray-500 mt-1">{stat.subtext}</div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Suche nach Name, E-Mail oder Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
            />
          </div>
          <Button
            variant="outline"
            className="border-gray-600 hover:bg-gray-800"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </motion.div>

        {/* Affiliates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 overflow-hidden"
        >
          {filteredAffiliates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Partner</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Klicks</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Leads</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Kunden</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Provision</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredAffiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{affiliate.name}</div>
                          <div className="text-sm text-gray-400">{affiliate.email}</div>
                          {affiliate.company && (
                            <div className="text-xs text-gray-500">{affiliate.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-cyan-400 font-mono text-sm">{affiliate.code}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            affiliate.status === 'active'
                              ? 'bg-green-500/10 text-green-400'
                              : affiliate.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {affiliate.status === 'active' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : affiliate.status === 'pending' ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {affiliate.status === 'active'
                            ? 'Aktiv'
                            : affiliate.status === 'pending'
                            ? 'Ausstehend'
                            : 'Gesperrt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-white">{affiliate.stats.clicks}</td>
                      <td className="px-6 py-4 text-right text-white">{affiliate.stats.leads}</td>
                      <td className="px-6 py-4 text-right text-white">{affiliate.stats.customers}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-white font-medium">
                          {affiliate.stats.totalCommission.toFixed(2)}€
                        </div>
                        <div className="text-xs text-gray-400">
                          {affiliate.stats.pendingCommission.toFixed(2)}€ ausstehend
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-800"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                {searchTerm ? 'Keine Partner gefunden' : 'Noch keine Partner registriert'}
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? 'Versuche einen anderen Suchbegriff'
                  : 'Partner können sich unter /affiliate/signup registrieren'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Provisionsauszahlung</h3>
          <p className="text-gray-400 text-sm">
            Provisionen werden monatlich ausgezahlt, sobald ein Partner die Mindestauszahlung von 50€ erreicht hat.
            Ausstehende Provisionen werden automatisch auf den nächsten Monat übertragen.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
