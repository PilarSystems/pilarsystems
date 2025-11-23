'use client'

import { Filter, X } from 'lucide-react'
import { LogLevel, LogType } from '@/src/server/logs/log.types'

interface MessageFiltersProps {
  level: LogLevel | 'all'
  type: LogType | 'all'
  onLevelChange: (level: LogLevel | 'all') => void
  onTypeChange: (type: LogType | 'all') => void
  onClear: () => void
}

export default function MessageFilters({
  level,
  type,
  onLevelChange,
  onTypeChange,
  onClear,
}: MessageFiltersProps) {
  const hasActiveFilters = level !== 'all' || type !== 'all'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Level Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Log Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLevelChange('all')}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                level === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onLevelChange(LogLevel.INFO)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                level === LogLevel.INFO
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              Info
            </button>
            <button
              onClick={() => onLevelChange(LogLevel.WARNING)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                level === LogLevel.WARNING
                  ? 'bg-yellow-600 text-white border-yellow-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => onLevelChange(LogLevel.ERROR)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                level === LogLevel.ERROR
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              Error
            </button>
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Log Type
          </label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as LogType | 'all')}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value={LogType.MESSAGE_RECEIVED}>Message Received</option>
            <option value={LogType.MESSAGE_SENT}>Message Sent</option>
            <option value={LogType.INTENT_DETECTED}>Intent Detected</option>
            <option value={LogType.ROUTING_DECISION}>Routing Decision</option>
            <option value={LogType.MODULE_EXECUTION}>Module Execution</option>
            <option value={LogType.AI_RESPONSE}>AI Response</option>
            <option value={LogType.ERROR}>Error</option>
            <option value={LogType.SYSTEM}>System</option>
          </select>
        </div>
      </div>
    </div>
  )
}
