import { isUserLoggedIn } from '../../functions/is-user-logged-in'
import { bot } from '../../lib/bot'
import { authSessions } from './state'

export const loginController = () => {
  bot.command('login', async (ctx) => {
    const alreadyLoggedIn = await isUserLoggedIn(ctx.from.id)
    if (alreadyLoggedIn) return ctx.reply('✅ You are already logged in.')
    ctx.reply('🔒 Enter the login secret:')
    authSessions.set(ctx.from.id, { flow: 'login', step: 'await_secret' })
  })
}
