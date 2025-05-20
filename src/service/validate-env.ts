import { cleanEnv, str, bool, num } from 'envalid'

export const env = cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  TELEGRAM_BOT_USERNAME: str(),
  DATABASE_URL: str(),
  APP_API_ID: num(),
  APP_API_HASH: str(),
  OWNER_USER_ID: num({ default: 0 }),
})
