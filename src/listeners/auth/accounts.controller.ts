import { bot } from '../../lib/bot'
import { protect } from '../../functions/protect'
import { SessionModel } from '../../db/session-schema'

export const accountsController = () => {
  bot.command('accounts', async (ctx) => {
    if (!(await protect(ctx))) return

    const accounts = await SessionModel.find()
    if (accounts.length === 0) {
      return ctx.reply('📭 No registered accounts found.')
    }

    const list = accounts.map((acc, i) => `[${i + 1}] ${acc.phoneNumber}`).join('\n')
    return ctx.reply(`✅ Registered Accounts:\n${list}`)
  })
}
