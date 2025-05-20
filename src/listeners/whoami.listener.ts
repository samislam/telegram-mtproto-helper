import { bot } from '../lib/bot'

export const whoamiListener = () => {
  return bot.command('whoami', async (ctx) => {
    const chatId = ctx.chat.id
    const messageId = ctx.message.message_id
    const username = ctx.from.username || null
    const userId = ctx.from.id || null
    await ctx.reply(
      [
        `chatId: ${chatId}`,
        `messageId: ${messageId}`,
        `username: ${username}`,
        `userId: ${userId}`,
      ].join('\n')
    )
  })
}
