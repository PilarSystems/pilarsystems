'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  MousePointerClick, 
  TrendingUp, 
  Euro,
  Copy,
  CheckCircle2,
  ExternalLink,
  Download
} from 'lucide-react'

interface AffiliateStats {
  code: string
  referralLink: string
  qrCodeUrl: string
  stats: {
    clicks: number
    leads: number
    customers: number
    totalCommission: number
    pendingCommission: number
    paidCommission: number
  }
  recentActivity: Array<{
    id: string
    type: 'click' | 'lead' | 'customer'
    date: string
    details: string
  }>
}

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/affiliate/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast.error('Affiliate-Statistiken konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (stats) {
      navigator.clipboard.writeText(stats.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Lade Affiliate-Daten...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Kein Affiliate-Account gefunden</h2>
          <p className="text-gray-400 mb-6">Du bist noch kein PILAR Partner.</p>
          <a href="/affiliate/signup">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Jetzt Partner werden
            </Button>
          </a>
        </div>
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
          <h1 className="text-4xl font-bold text-white mb-2">Affiliate Dashboard</h1>
          <p className="text-gray-400">
            Dein Code: <span className="text-cyan-400 font-mono font-semibold">{stats.code}</span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: MousePointerClick,
              label: 'Klicks',
              value: stats.stats.clicks,
              color: 'cyan',
            },
            {
              icon: Users,
              label: 'Leads',
              value: stats.stats.leads,
              color: 'blue',
            },
            {
              icon: TrendingUp,
              label: 'Kunden',
              value: stats.stats.customers,
              color: 'green',
            },
            {
              icon: Euro,
              label: 'Verdient',
              value: `${stats.stats.totalCommission.toFixed(2)}€`,
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
            </motion.div>
          ))}
        </div>

        {/* Commission Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Provisionen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Gesamt verdient</div>
              <div className="text-3xl font-bold text-white">{stats.stats.totalCommission.toFixed(2)}€</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Ausstehend</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.stats.pendingCommission.toFixed(2)}€</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Ausgezahlt</div>
              <div className="text-3xl font-bold text-green-400">{stats.stats.paidCommission.toFixed(2)}€</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Mindestauszahlung: 50€ • Auszahlung erfolgt monatlich
          </p>
        </motion.div>

        {/* Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Dein Referral-Link</h2>
          <p className="text-gray-400 mb-4">
            Teile diesen Link, um Provision zu verdienen:
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              readOnly
              value={stats.referralLink}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white font-mono text-sm"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex gap-4">
            <a href={stats.qrCodeUrl} download className="flex-1">
              <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                QR-Code herunterladen
              </Button>
            </a>
            <a href={stats.referralLink} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800">
                <ExternalLink className="h-4 w-4 mr-2" />
                Link testen
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Letzte Aktivitäten</h2>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'customer'
                          ? 'bg-green-400'
                          : activity.type === 'lead'
                          ? 'bg-blue-400'
                          : 'bg-gray-400'
                      }`}
                    />
                    <div>
                      <div className="text-white font-medium">
                        {activity.type === 'customer'
                          ? 'Neuer Kunde'
                          : activity.type === 'lead'
                          ? 'Neuer Lead'
                          : 'Klick'}
                      </div>
                      <div className="text-sm text-gray-400">{activity.details}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Noch keine Aktivitäten</p>
              <p className="text-sm text-gray-500 mt-2">
                Teile deinen Referral-Link, um loszulegen!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
