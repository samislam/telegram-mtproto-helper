import { cleanEnv, str, bool, num } from 'envalid'

export const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  TELEGRAM_BOT_USERNAME: str(),
  DATABASE_URL: str(),
  ONLY_JOIN_LINKS: bool({ default: false }),
  NOTIFICATIONS_BOT_TOKEN: str({ default: '' }),
  NOTIFICATIONS_BOT_USERNAME: str({ default: '' }),
  NOTIFICATIONS_BOT_OWNER_CHAT_ID: str({ default: '' }),
  NOTIFICATIONS_ENABLED: bool({ default: false }),
  OWNER_USER_ID: num({ default: 0 }),
})
