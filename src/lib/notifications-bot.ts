import { Telegraf } from 'telegraf'
import { env } from '../service/validate-env'

export const notificationsBot = new Telegraf(env.NOTIFICATIONS_BOT_TOKEN)
