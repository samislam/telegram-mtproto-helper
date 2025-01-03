import { bot } from '../lib/bot'
import { Markup } from 'telegraf'

export const startListener = () => {
  return bot.start((ctx) => {
    const message = [
      '*Hello!*',
      '',
      "*It's Easy to get started! send me telegram invite links and I'll ensure:*",
      '',
      '- No duplicate links exist in our chat',
      '- No non-links exist in our chat',
      '- Split links in a message into multiple messages',
      '- Remove the original forwarder',
      '- Remove expired links (works only on telegram links)',
      '',
      '*Practical steps:*',
      '',
      '1- Send me here invite links, or forward them to me here',
      "2- That's it the bot will do the rest!",
    ].join('\n')

    ctx.reply(message, { parse_mode: 'Markdown' })
  })
}
