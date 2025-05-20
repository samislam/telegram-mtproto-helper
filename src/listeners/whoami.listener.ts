import { Api } from 'telegram'
import { bot } from '../lib/bot'
import { TelegramClient } from 'telegram'
import { env } from '../service/validate-env'
import { StringSession } from 'telegram/sessions'
import { UserSessionModel } from '../db/user-session.schema'

export const whoamiListener = () => {
  return bot.command('whoami', async (ctx) => {
    const chatId = ctx.chat.id
    const messageId = ctx.message.message_id
    const username = ctx.from.username || null
    const userId = ctx.from.id || null

    let replyLines = [
      `chatId: ${chatId}`,
      `messageId: ${messageId}`,
      `username: ${username}`,
      `userId: ${userId}`,
    ]

    try {
      const sessionEntry = await UserSessionModel.findOne({
        chatId,
        status: 'active',
      })

      if (sessionEntry) {
        const client = new TelegramClient(
          new StringSession(sessionEntry.session),
          env.APP_API_ID,
          env.APP_API_HASH,
          { connectionRetries: 3 }
        )

        await client.connect()
        const me = await client.getMe()

        replyLines.push(
          '',
          '🧾 Currently Logged-in MTProto Account:',
          `id: ${me.id}`,
          `username: ${me.username ?? '—'}`,
          `phone: +${me.phone ?? '—'}`,
          `firstName: ${me.firstName}`,
          `lastName: ${me.lastName ?? '—'}`
        )

        await client.disconnect()
      }
    } catch (err: any) {
      replyLines.push('', '⚠️ Failed to fetch MTProto session info:', err.message)
    }

    await ctx.reply(replyLines.join('\n'))
  })
}
