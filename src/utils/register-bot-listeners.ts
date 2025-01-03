import type { Update } from 'telegraf/types'
import type { Context, Telegraf } from 'telegraf'

export const registerBotListeners = (listeners: (() => Telegraf<Context<Update>>)[]) => {
  listeners.forEach((fn) => fn())
}
