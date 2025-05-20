import { authSessions } from './state'
import { TelegramClient } from 'telegram'
import { env } from '../../service/validate-env'
import { StringSession } from 'telegram/sessions'
import { SessionModel } from '../../db/session-schema'
import { UserSessionModel } from '../../db/user-session.schema'
import type { MessageListener } from '../../utils/register-message-listeners'

export const loginListener: MessageListener = async (ctx) => {
  const session = authSessions.get(ctx.chat.id)
  if (!session || session.flow !== 'login') return
  const text = ctx.message?.text?.trim()
  if (!text) return

  // Step 1: Validate secret
  if (session.step === 'await_secret') {
    if (text !== env.REGISTER_SECRET) {
      return ctx.reply('❌ Invalid secret.')
    }

    session.step = 'await_phone'
    return ctx.reply('📱 Enter your phone number:')
  }

  // Step 2: Match phone number in SessionModel
  if (session.step === 'await_phone') {
    const doc = await SessionModel.findOne({ phoneNumber: text })
    if (!doc) {
      authSessions.delete(ctx.chat.id)
      return ctx.reply('❌ Not registered. Please use /register first.')
    }

    // Expire previous sessions
    await UserSessionModel.updateMany({ phoneNumber: text }, { $set: { status: 'expired' } })

    // Create new session entry
    const newEntry = await UserSessionModel.create({
      phoneNumber: text,
      session: doc.session,
      chatId: ctx.chat.id,
      status: 'active',
    })

    authSessions.delete(ctx.chat.id)
    return ctx.reply('✅ Welcome back. You are now logged in!')
  }
}
