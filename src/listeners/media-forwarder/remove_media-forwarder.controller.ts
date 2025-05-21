import { bot } from '../../lib/bot'
import { MediaForwardingModel } from '../../db/media-forwarding.schema'
import { mediaForwarderSessions } from './media-forwarder.session'

export const removeMediaForwarderController = () => {
  bot.action('media:remove', async (ctx) => {
    await ctx.answerCbQuery()

    const entries = await MediaForwardingModel.find({ chatId: ctx.from.id }) // 👈 Scoped per user
    if (!entries.length) return ctx.reply('📭 No listeners to remove.')

    const list = entries.map((e, i) => `[${i + 1}] ${e.sourceId} ➜ ${e.targetId}`).join('\n')

    mediaForwarderSessions.set(ctx.from.id, {
      step: 'awaiting_removal_index',
      forwarders: entries,
    })

    await ctx.reply(`📋 Active rules:\n${list}`)
    await ctx.reply('✏️ Reply with the number to remove:')
  })
}
