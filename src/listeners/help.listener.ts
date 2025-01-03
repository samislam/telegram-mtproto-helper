import { bot } from '../lib/bot'
import { env } from '../service/validate-env'

export const helpListener = () => {
  return bot.command('help', (ctx) =>
    ctx.reply(
      [
        'Simply forward any messages that include telegram invite links and the bot is going to do its job',
      ].join('\n')
    )
  )
}
