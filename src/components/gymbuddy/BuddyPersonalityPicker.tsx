'use client'

import { PersonalityStyle } from '@/src/server/gymbuddy/gymBuddy.types'
import { getAllPersonalityProfiles } from '@/src/server/gymbuddy/gymBuddy.personality'

interface BuddyPersonalityPickerProps {
  selected: PersonalityStyle | null
  onSelect: (style: PersonalityStyle) => void
}

export default function BuddyPersonalityPicker({ selected, onSelect }: BuddyPersonalityPickerProps) {
  const personalities = getAllPersonalityProfiles()

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string; selectedBg: string; selectedBorder: string }> = {
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', selectedBg: 'bg-orange-100', selectedBorder: 'border-orange-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', selectedBg: 'bg-blue-100', selectedBorder: 'border-blue-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', selectedBg: 'bg-green-100', selectedBorder: 'border-green-500' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', selectedBg: 'bg-purple-100', selectedBorder: 'border-purple-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', selectedBg: 'bg-pink-100', selectedBorder: 'border-pink-500' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', selectedBg: 'bg-red-100', selectedBorder: 'border-red-500' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', selectedBg: 'bg-teal-100', selectedBorder: 'border-teal-500' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', selectedBg: 'bg-yellow-100', selectedBorder: 'border-yellow-500' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', selectedBg: 'bg-indigo-100', selectedBorder: 'border-indigo-500' },
      gold: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', selectedBg: 'bg-amber-100', selectedBorder: 'border-amber-500' },
    }
    
    const colorSet = colors[color] || colors.blue
    return isSelected
      ? `${colorSet.selectedBg} ${colorSet.selectedBorder} ${colorSet.text}`
      : `${colorSet.bg} ${colorSet.border} ${colorSet.text} hover:${colorSet.selectedBg}`
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Wähle deinen Coach-Stil
        </h3>
        <p className="text-sm text-gray-600">
          Jeder Coach hat eine einzigartige Persönlichkeit. Wähle den Stil, der am besten zu dir passt!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalities.map((personality) => {
          const isSelected = selected === personality.style
          
          return (
            <button
              key={personality.style}
              onClick={() => onSelect(personality.style)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${getColorClasses(personality.color, isSelected)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-3xl">{personality.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-base mb-1">
                    {personality.name}
                  </h4>
                  <p className="text-sm mb-2">
                    {personality.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {personality.traits.map((trait) => (
                      <span
                        key={trait}
                        className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  <p className="text-xs italic">
                    "{personality.exampleMessages[0]}"
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
