import { cleanEnv, str, email, json } from 'envalid'

export const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  TELEGRAM_BOT_USERNAME: str(),
  DATABASE_URL: str(),
  OWNER_CHAT_ID: str(),
})
