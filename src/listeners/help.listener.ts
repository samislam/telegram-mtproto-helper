import { bot } from '../lib/bot'
import { protect } from '../functions/protect'

export const helpListener = () => {
  return bot.command('help', async (ctx) => {
    if (!(await protect(ctx))) return
    ctx.reply(
      [
        'Simply forward any messages that include telegram invite links and the bot is going to do its job',
      ].join('\n')
    )
  })
}
