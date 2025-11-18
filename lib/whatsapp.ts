import axios from 'axios'

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN!
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    throw error
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}
