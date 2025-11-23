'use client'

/**
 * Voice Test Component
 * 
 * Browser microphone → Voice Engine → TTS response
 */

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react'

interface VoiceTestProps {
  onResult: (result: any) => void
  onLog: (log: { timestamp: string; type: 'request' | 'response' | 'error'; data: any }) => void
}

export default function VoiceTest({ onResult, onLog }: VoiceTestProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'de-DE'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        processVoiceInput(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError(`Speech recognition error: ${event.error}`)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setPermissionGranted(true)
      setError(null)
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      setError('Microphone permission denied. Please allow microphone access.')
      return false
    }
  }

  const startRecording = async () => {
    setError(null)

    if (!permissionGranted) {
      const granted = await requestMicrophonePermission()
      if (!granted) return
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
        setTranscript('')
        setAudioUrl(null)
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setError('Failed to start speech recognition')
      }
    } else {
      setError('Speech recognition not supported in this browser')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  const processVoiceInput = async (text: string) => {
    setIsProcessing(true)
    setError(null)

    onLog({
      timestamp: new Date().toISOString(),
      type: 'request',
      data: {
        channel: 'voice',
        transcript: text,
      },
    })

    try {
      const response = await fetch('/api/test/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          generateAudio: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process voice input')
      }

      onLog({
        timestamp: new Date().toISOString(),
        type: 'response',
        data: data,
      })

      onResult(data.result)

      if (data.result.audio) {
        playAudio(data.result.audio)
      }
    } catch (error) {
      console.error('Error processing voice input:', error)
      setError(error instanceof Error ? error.message : 'Failed to process voice input')

      onLog({
        timestamp: new Date().toISOString(),
        type: 'error',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const playAudio = (base64Audio: string) => {
    try {
      const byteCharacters = atob(base64Audio)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)

      setAudioUrl(url)

      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      setError('Failed to play audio response')
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Mic className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Voice Test</h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4 mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-purple-600 hover:bg-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </button>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">
            {isRecording
              ? 'Recording... Click to stop'
              : isProcessing
              ? 'Processing...'
              : 'Click to start recording'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Speak in German for best results
          </p>
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transcript
          </label>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-800">{transcript}</p>
          </div>
        </div>
      )}

      {/* Audio Playback */}
      {audioUrl && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Response (Audio)
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={isPlaying ? stopAudio : () => audioRef.current?.play()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-sm">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Play</span>
                </>
              )}
            </button>
            <audio
              ref={audioRef}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How to use:</h4>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Click the microphone button to start recording</li>
          <li>Speak your message in German</li>
          <li>Click again to stop recording</li>
          <li>Wait for the AI to process and respond</li>
          <li>Listen to the audio response</li>
        </ol>
      </div>
    </div>
  )
}
