'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Phone, CheckCheck } from 'lucide-react'

interface WhatsAppMessage {
  id: number
  direction: 'inbound' | 'outbound'
  sender: string
  message: string
  timestamp: string
}

interface PhoneMessage {
  id: number
  speaker: 'AI' | 'Kunde'
  text: string
}

interface ChatExampleProps {
  type: 'whatsapp' | 'phone'
  messages: WhatsAppMessage[] | PhoneMessage[]
  title?: string
}

export function ChatExample({ type, messages, title }: ChatExampleProps) {
  if (type === 'whatsapp') {
    const whatsappMessages = messages as WhatsAppMessage[]
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        {title && (
          <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        )}
        
        {/* WhatsApp UI */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10">
          {/* Header */}
          <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold">PILAR AI</div>
              <div className="text-xs text-gray-300">Online</div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-[#0a0a0a] p-4 space-y-3 min-h-[300px]">
            {whatsappMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.direction === 'inbound' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.direction === 'outbound'
                      ? 'bg-[#005C4B] text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    {msg.direction === 'outbound' && (
                      <CheckCheck className="h-3 w-3 text-blue-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const phoneMessages = messages as PhoneMessage[]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {title && (
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      )}
      
      {/* Phone UI */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold">PILAR AI Rezeption</div>
            <div className="text-xs text-white/80">Anruf läuft...</div>
          </div>
        </div>

        {/* Conversation */}
        <div className="p-6 space-y-4 min-h-[300px]">
          {phoneMessages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex gap-3"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.speaker === 'AI'
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                    : 'bg-gray-700'
                }`}
              >
                <span className="text-white text-xs font-bold">
                  {msg.speaker === 'AI' ? 'AI' : 'K'}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">
                  {msg.speaker === 'AI' ? 'PILAR AI' : 'Kunde'}
                </div>
                <div className="bg-gray-800 rounded-lg px-4 py-2">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
