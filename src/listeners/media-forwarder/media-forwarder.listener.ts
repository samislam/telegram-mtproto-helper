import { Markup } from 'telegraf'
import { bot } from '../../lib/bot'

export const mediaForwarderListener = () => {
  bot.action('cmd:media_forwarder', async (ctx) => {
    await ctx.editMessageText(
      '📤 Media Forwarder - Select an action:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🧾 List listening groups', 'media:list')],
        [Markup.button.callback('🗑 Remove listening groups', 'media:remove')],
        [Markup.button.callback('➕ Add new', 'media:add')],
        [Markup.button.callback('⬅️ Back', 'screen:main')],
      ])
    )
  })
}
