import { notificationsBot } from '../lib/notifications-bot'
import { env } from '../service/validate-env'

export const sendNotification = async (message: string) => {
  try {
    await notificationsBot.telegram.sendMessage(env.NOTIFICATIONS_BOT_OWNER_CHAT_ID, message)
    console.log('Notification sent')
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
