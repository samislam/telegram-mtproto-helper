import { bot } from '../../lib/bot'
import { authSessions } from './state'
import { protect } from '../../functions/protect'

export const logoutController = () => {
  bot.command('logout', async (ctx) => {
    if (!(await protect(ctx))) return

    authSessions.set(ctx.from.id, {
      flow: 'logout',
      step: 'await_logout_choice', // ✅ skip secret if already logged in
    })

    return ctx.reply(
      'Are you sure you want to log out?\n1. ❌ Current session only\n2. 🚪 Log out completely\n\nReply with 1 or 2:'
    )
  })
}
