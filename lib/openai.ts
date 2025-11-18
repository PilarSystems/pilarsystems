import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
})

export const AI_MODELS = {
  GPT4: 'gpt-4-turbo-preview',
  GPT4_MINI: 'gpt-4o-mini',
}
