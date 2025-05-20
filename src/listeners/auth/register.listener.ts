import { Api } from 'telegram'
import { authSessions } from './state'
import { TelegramClient } from 'telegram'
import { env } from '../../service/validate-env'
import { StringSession } from 'telegram/sessions'
import { SessionModel } from '../../db/session-schema'
import type { MessageListener } from '../../utils/register-message-listeners'

export const registerListener: MessageListener = async (ctx) => {
  const session = authSessions.get(ctx.chat.id)
  if (!session || session.flow !== 'register') return

  const text = ctx.message?.text?.trim()
  if (!text) return

  // Step 1: Secret check
  if (session.step === 'await_secret') {
    if (text !== env.REGISTER_SECRET) {
      return ctx.reply('❌ Invalid secret.')
    }

    session.step = 'await_phone'
    return ctx.reply('📱 Enter your phone number (e.g. +905xxxxxxxxx):')
  }

  // Step 2: Phone number check and sendCode
  if (session.step === 'await_phone') {
    const phone = text.trim()
    if (!phone.startsWith('+')) {
      return ctx.reply('❌ Please enter a valid international phone number starting with +')
    }

    const exists = await SessionModel.findOne({ phoneNumber: phone })
    if (exists) {
      authSessions.delete(ctx.chat.id)
      return ctx.reply('ℹ️ This phone is already registered. Use /login or /refresh-session.')
    }

    session.phoneNumber = phone
    session.client = new TelegramClient(new StringSession(''), env.APP_API_ID, env.APP_API_HASH, {
      connectionRetries: 5,
    })

    try {
      await session.client.disconnect() // ensure it's not logged in
      await session.client.connect()
      const sentCode = await session.client.invoke(
        new Api.auth.SendCode({
          phoneNumber: phone,
          apiId: env.APP_API_ID,
          apiHash: env.APP_API_HASH,
          settings: new Api.CodeSettings({}),
        })
      )

      session.phoneCodeHash = sentCode.phoneCodeHash
      session.codeSentAt = Date.now()
      session.step = 'await_code'

      return ctx.reply('📩 Enter the code sent to your phone:')
    } catch (err: any) {
      authSessions.delete(ctx.chat.id)
      console.error('❌ Error sending code:', err)
      return ctx.reply('❌ Failed to send code: ' + err.message)
    }
  }

  // Step 3: Code entry
  if (session.step === 'await_code') {
    const MAX_TIMEOUT = 2 * 60 * 1000 // 2 minutes
    const now = Date.now()

    if (
      !session.phoneCodeHash ||
      !session.phoneNumber ||
      now - (session.codeSentAt || 0) > MAX_TIMEOUT
    ) {
      authSessions.delete(ctx.chat.id)
      return ctx.reply('⏱️ Code expired. Please use /register to try again.')
    }

    try {
      const result = await session.client.invoke(
        new Api.auth.SignIn({
          phoneNumber: session.phoneNumber,
          phoneCodeHash: session.phoneCodeHash,
          phoneCode: text,
        })
      )

      if (result instanceof Api.auth.AuthorizationSignUpRequired) {
        throw new Error('This phone number is not registered with Telegram.')
      }

      const stringSession = session.client.session.save()
      await SessionModel.create({ phoneNumber: session.phoneNumber, session: stringSession })

      authSessions.delete(ctx.chat.id)
      return ctx.reply('✅ Registration successful. Use /login to access.')
    } catch (err: any) {
      if (err.errorMessage === 'SESSION_PASSWORD_NEEDED') {
        session.step = 'await_password'
        return ctx.reply('🔐 This account has 2FA. Please enter your password:')
      }

      authSessions.delete(ctx.chat.id)
      console.error('❌ Error signing in:', err)
      return ctx.reply('❌ Invalid code or error: ' + err.message)
    }
  }

  // Step 4: Handle 2FA
  if (session.step === 'await_password') {
    try {
      const pwd = await session.client.invoke(new Api.account.GetPassword())
      const password = await session.client.checkPassword(pwd, text)

      await session.client.invoke(new Api.auth.CheckPassword({ password }))

      const stringSession = session.client.session.save()
      await SessionModel.create({ phoneNumber: session.phoneNumber!, session: stringSession })

      authSessions.delete(ctx.chat.id)
      return ctx.reply('✅ Registration successful. Use /login to access.')
    } catch (err: any) {
      console.error('❌ 2FA password error:', err)
      authSessions.delete(ctx.chat.id)
      return ctx.reply('❌ Wrong password: ' + err.message)
    }
  }
}
