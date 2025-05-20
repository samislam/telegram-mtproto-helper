import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { env } from '../service/validate-env'

const apiId = env.APP_API_ID
const apiHash = env.APP_API_HASH
const stringSession = new StringSession(env.STRING_SESSION)

export const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
})
