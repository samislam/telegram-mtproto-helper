import { bot } from '../lib/bot'
import { client } from '../functions/login'

export const processTerminateListener = () => {
  process.once('SIGINT', async () => {
    await bot.stop('SIGINT')
    await client.disconnect()
  })
  process.once('SIGTERM', async () => {
    await bot.stop('SIGTERM')
    await client.disconnect()
  })
}
