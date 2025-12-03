'use client'

import { Shield, Lock, CheckCircle, Award, Star } from 'lucide-react'

export function TrustSignals() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-cyan-400" />
        <span>DSGVO-konform</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-cyan-400" />
        <span>256-bit SSL verschlüsselt</span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-cyan-400" />
        <span>ISO 27001 zertifiziert</span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-cyan-400" />
        <span>Made in Germany</span>
      </div>
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-cyan-400" />
        <span>4.9/5 ⭐ (127 Bewertungen)</span>
      </div>
    </div>
  )
}
