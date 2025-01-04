import { cleanEnv, str, email, json, bool } from 'envalid'

export const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  TELEGRAM_BOT_USERNAME: str(),
  DATABASE_URL: str(),
  ONLY_JOIN_LINKS: bool({ default: false }),
  NOTIFICATIONS_BOT_TOKEN: str(),
  NOTIFICATIONS_BOT_USERNAME: str(),
  NOTIFICATIONS_BOT_OWNER_CHAT_ID: str(),
})
