import { bot } from '../lib/bot'
import { env } from '../service/validate-env'

export const notifyOwner = async (message: string) => {
  try {
    await bot.telegram.sendMessage(env.OWNER_CHAT_ID, message)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
