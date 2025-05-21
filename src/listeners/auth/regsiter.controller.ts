import { isUserLoggedIn } from '../../functions/is-user-logged-in'
import { bot } from '../../lib/bot'
import { authSessions } from './state'

export const registerController = () => {
  bot.command('register', async (ctx) => {
    const isLoggedIn = await isUserLoggedIn(ctx.from.id)
    if (isLoggedIn) return ctx.reply('✅ You are already logged in. Use /logout to log out.')

    ctx.reply('🔒 Enter the registration secret:')
    authSessions.set(ctx.from.id, { flow: 'register', step: 'await_secret' })
  })
}
