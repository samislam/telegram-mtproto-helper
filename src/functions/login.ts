import chalk from 'chalk'
import to from 'await-to-js'
import { input } from '@inquirer/prompts'
import { TelegramClient } from 'telegram'
import { env } from '../service/validate-env'
import { StringSession } from 'telegram/sessions'
import { SessionModel } from '../db/session-schema'

export let client: TelegramClient

export const login = async () => {
  // 2.1 look for an existing session doc
  let sessionDoc = await SessionModel.findOne().exec()
  let sessionString = sessionDoc?.session ?? ''

  // 2.2 build client
  const stringSession = new StringSession(sessionString)
  client = new TelegramClient(stringSession, env.APP_API_ID, env.APP_API_HASH, {
    connectionRetries: 5,
  })

  if (!sessionString) {
    // first run: prompt and start()
    console.log(`${chalk.blueBright.bold('[info]')} logging into Telegram…`)
    const phone = await input({ message: '📱 Your phone number (e.g. +90...)' })
    await client.start({
      phoneNumber: async () => phone,
      phoneCode: async () => await input({ message: '🔑 Enter the OTP code you received:' }),
      password: async () => await input({ message: '🔒 Your 2FA cloud password:' }),
      onError: (err) => console.error(`${chalk.red.bold('[Error]')}`, err),
    })
    console.log(`${chalk.greenBright.bold('[Success]')} Telegram logged in`)

    const newSession = stringSession.save()

    sessionDoc = new SessionModel({
      session: newSession,
      phoneNumber: phone, // ✅ required field
    })
    await sessionDoc.save()
    console.log(`${chalk.greenBright('[Saved]')} session stored in MongoDB`)
  } else {
    // subsequent runs: just connect
    console.log(`${chalk.blueBright.bold('[info]')} re-connecting Telegram…`)
    const [err] = await to(client.connect())
    if (err) {
      console.error(`${chalk.red.bold('[Error]')} Telegram reconnect failed`, err)
      process.exit(1)
    }
    console.log(`${chalk.greenBright.bold('[Success]')} Telegram re-connected`)
  }
  return client
}
