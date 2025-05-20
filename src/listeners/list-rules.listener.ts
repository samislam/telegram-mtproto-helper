import { bot } from '../lib/bot'

export const listRulesListener = () => {
  return bot.action('cmd:list', async (ctx) => {
    await ctx.answerCbQuery() // remove “loading…” on the button
    return ctx.reply('▶️ Active Rules:')
  })
}
