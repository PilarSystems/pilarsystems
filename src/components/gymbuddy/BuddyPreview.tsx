'use client'

import { PersonalityStyle } from '@/src/server/gymbuddy/gymBuddy.types'
import { getPersonalityProfile } from '@/src/server/gymbuddy/gymBuddy.personality'

interface BuddyPreviewProps {
  personalityStyle: PersonalityStyle
  userName?: string
}

export default function BuddyPreview({ personalityStyle, userName = 'Champion' }: BuddyPreviewProps) {
  const profile = getPersonalityProfile(personalityStyle)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">{profile.emoji}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {profile.name}
        </h3>
        <p className="text-sm text-gray-600">
          Dein persönlicher AI Coach
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Persönlichkeit
          </h4>
          <p className="text-sm text-gray-600">
            {profile.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Eigenschaften
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile.traits.map((trait) => (
              <span
                key={trait}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Beispiel Nachrichten
          </h4>
          <div className="space-y-2">
            {profile.exampleMessages.map((message, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700"
              >
                {message.replace('Champion', userName)}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Begrüßung:</span>
            <span className="font-medium">{profile.greetingStyle}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>Motivation:</span>
            <span className="font-medium">{profile.motivationStyle}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
