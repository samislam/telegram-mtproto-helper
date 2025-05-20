import { bot } from '../lib/bot'
import type { Message, Update } from 'telegraf/types'
import type { Context, NarrowedContext } from 'telegraf'

// A single message listener signature
export type MessageListener = (
  ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
) => unknown

/** Wire up ONE bot.on('message') that fan-outs into all your listeners. */
export function registerMessageListeners(listeners: MessageListener[]) {
  bot.on('message', async (ctx) => {
    console.log('mew')
    for (const fn of listeners) {
      try {
        await fn(ctx)
      } catch (err) {
        console.error('Error in message listener:', err)
      }
    }
  })
}
