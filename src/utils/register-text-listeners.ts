import { bot } from '../lib/bot'
import { message } from 'telegraf/filters'
import type { Message, Update } from 'telegraf/types'
import type { Context, NarrowedContext } from 'telegraf'

// A single message listener signature
export type TextListener = (
  ctx: NarrowedContext<
    Context<Update>,
    Update.MessageUpdate<Record<'text', {}> & Message.TextMessage>
  >
) => Promise<void> | unknown

/** Wire up ONE bot.on('message') that fan-outs into all your listeners. */
export function registerTextListeners(listeners: TextListener[]) {
  bot.on(message('text'), async (ctx) => {
    for (const fn of listeners) {
      try {
        await fn(ctx)
      } catch (err) {
        console.error('Error in text listener:', err)
      }
    }
  })
}
