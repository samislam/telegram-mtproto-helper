import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { UserSessionModel } from '../db/user-session.schema'

const clientMap = new Map<number, TelegramClient>()

export const getClientForChat = async (chatId: number): Promise<TelegramClient | null> => {
  console.log(`[getClientForChat] Looking up client for chatId: ${chatId}`)

  if (clientMap.has(chatId)) {
    console.log(`[getClientForChat] Using cached client for ${chatId}`)
    return clientMap.get(chatId)!
  }

  const session = await UserSessionModel.findOne({ chatId, status: 'active' })
  if (!session) {
    console.warn(`[getClientForChat] No session found for ${chatId}`)
    return null
  }

  console.log(`[getClientForChat] Creating new client for ${chatId}`)
  const stringSession = new StringSession(session.session)
  const client = new TelegramClient(
    stringSession,
    Number(process.env.APP_API_ID),
    process.env.APP_API_HASH!,
    {
      connectionRetries: 5,
    }
  )

  try {
    await client.connect()
    console.log(`[getClientForChat] Client connected for ${chatId}`)
    clientMap.set(chatId, client)
    return client
  } catch (err) {
    console.error(`[getClientForChat] Failed to connect client for ${chatId}:`, err)
    return null
  }
}
