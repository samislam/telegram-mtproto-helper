import { bot } from '../lib/bot'

export const processTerminateListener = () => {
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
