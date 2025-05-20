import { bot } from '../../lib/bot'

export const linksForwarderListener = () => {
  return bot.action('cmd:link_forwarder', async (ctx) => {
    await ctx.answerCbQuery() // remove “loading…” on the button
    return ctx.reply('▶️ link-auto-forwarder')
  })
}
