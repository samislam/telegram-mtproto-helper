import { authSessions } from './state'
// File: src/listeners/auth/logout.listener.ts
import { Api, TelegramClient } from 'telegram'
import { env } from '../../service/validate-env'
import { StringSession } from 'telegram/sessions'
import { SessionModel } from '../../db/session-schema'
import { UserSessionModel } from '../../db/user-session.schema'
import type { MessageListener } from '../../utils/register-message-listeners'

export const logoutListener: MessageListener = async (ctx) => {
  const session = authSessions.get(ctx.chat.id)
  const text = ctx.message?.text?.trim()
  if (!session || session.flow !== 'logout' || !text) return

  if (session.step === 'await_logout_choice') {
    if (text === '1') {
      await UserSessionModel.updateMany({ chatId: ctx.chat.id }, { $set: { status: 'expired' } })
      authSessions.delete(ctx.chat.id)
      return ctx.reply('✅ You have been logged out from this session.')
    }

    if (text === '2') {
      const activeUser = await UserSessionModel.findOne({
        chatId: ctx.chat.id,
        status: 'active',
      })

      if (!activeUser) {
        authSessions.delete(ctx.chat.id)
        return ctx.reply('❌ You are not logged in.')
      }

      const entry = await SessionModel.findOne({ phoneNumber: activeUser.phoneNumber })
      if (!entry) {
        authSessions.delete(ctx.chat.id)
        return ctx.reply('❌ Session not found.')
      }

      try {
        const client = new TelegramClient(
          new StringSession(entry.session),
          env.APP_API_ID,
          env.APP_API_HASH,
          { connectionRetries: 3 }
        )

        await client.connect()
        await client.invoke(new Api.auth.LogOut())

        await SessionModel.deleteOne({ phoneNumber: activeUser.phoneNumber })
        await UserSessionModel.updateMany(
          { phoneNumber: activeUser.phoneNumber },
          { $set: { status: 'expired' } }
        )

        authSessions.delete(ctx.chat.id)
        return ctx.reply('✅ Fully logged out and session removed.')
      } catch (err: any) {
        authSessions.delete(ctx.chat.id)
        console.error('❌ Error logging out:', err)
        return ctx.reply('❌ Failed to log out: ' + err.message)
      }
    }

    return ctx.reply('❌ Invalid option. Reply with 1 or 2.')
  }
}
