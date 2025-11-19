import OpenAI from 'openai'

let openaiInstance: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
    })
  }
  return openaiInstance
}

export const openai = getOpenAI()

export const AI_MODELS = {
  GPT4: 'gpt-4-turbo-preview',
  GPT4_MINI: 'gpt-4o-mini',
}
