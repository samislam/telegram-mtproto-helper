import type { Context } from 'telegraf'
import { isUserLoggedIn } from './is-user-logged-in'

export const protect = async (ctx: Context<any>) => {
  const loggedIn = await isUserLoggedIn(ctx?.chat?.id)
  if (!loggedIn) ctx.reply('❌ Please log in first using /login.')
  return loggedIn
}
