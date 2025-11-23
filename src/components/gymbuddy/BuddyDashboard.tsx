'use client'

import { Trophy, Flame, Calendar, MessageCircle } from 'lucide-react'

interface BuddyDashboardProps {
  stats: {
    totalWorkouts: number
    currentStreak: number
    longestStreak: number
    totalMessages: number
    lastActive?: Date
  }
  profile: {
    name: string
    personalityStyle: string
    fitnessGoal: string
    fitnessLevel: string
  }
}

export default function BuddyDashboard({ stats, profile }: BuddyDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Hey {profile.name}! 💪
        </h2>
        <p className="text-blue-100">
          Bereit für dein nächstes Workout?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Trophy className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flame className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.longestStreak}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dein Profil
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Ziel</p>
            <p className="font-medium text-gray-900 capitalize">
              {profile.fitnessGoal.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Level</p>
            <p className="font-medium text-gray-900 capitalize">
              {profile.fitnessLevel}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Coach Stil</p>
            <p className="font-medium text-gray-900 capitalize">
              {profile.personalityStyle.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Letztes Training</p>
            <p className="font-medium text-gray-900">
              {stats.lastActive
                ? new Date(stats.lastActive).toLocaleDateString('de-DE')
                : 'Noch kein Training'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors">
          <p className="font-semibold">Neues Workout</p>
          <p className="text-sm text-blue-100">Starte jetzt!</p>
        </button>
        <button className="bg-purple-600 text-white rounded-lg p-4 hover:bg-purple-700 transition-colors">
          <p className="font-semibold">Chat öffnen</p>
          <p className="text-sm text-purple-100">Frag deinen Coach</p>
        </button>
      </div>
    </div>
  )
}
