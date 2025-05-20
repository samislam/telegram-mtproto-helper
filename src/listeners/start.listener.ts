import { bot } from '../lib/bot'
import { Markup } from 'telegraf'

export const mainKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('📤 Media-Forwarder', 'cmd:media_forwarder')],
    [Markup.button.callback('🔗 Link-Forwarder', 'cmd:link_forwarder')],
    [Markup.button.callback('🗂️ Media-Crawler', 'cmd:media_crawler')],
    [Markup.button.callback('📋 List Rules', 'cmd:list')],
  ])

export const startListener = () => {
  bot.start((ctx) => {
    ctx.reply('👋 Welcome! Choose a feature:', mainKeyboard())
  })

  bot.action('screen:main', async (ctx) => {
    await ctx.editMessageText('👋 Welcome! Choose a feature:', mainKeyboard())
  })
}
