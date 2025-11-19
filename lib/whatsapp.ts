import axios from 'axios'

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'

function getWhatsAppConfig() {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!token || !phoneNumberId) {
    throw new Error('WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID are required');
  }
  
  return { token, phoneNumberId };
}

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const { token, phoneNumberId } = getWhatsAppConfig();
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
    const { token, phoneNumberId } = getWhatsAppConfig();
    await axios.post(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error marking message as read:', error)
  }
}
