import { bot } from '../../lib/bot'
import { getClientForChat } from '../../lib/mtproto-client-manager'
import { MediaForwardingModel } from '../../db/media-forwarding.schema'

export const list_mediaForwarderListener = () => {
  bot.action('media:list', async (ctx) => {
    await ctx.answerCbQuery()
    const client = await getClientForChat(ctx.from.id)
    if (!client) return ctx.reply('❌ You must be logged in first.')

    const entries = await MediaForwardingModel.find({ chatId: ctx.from.id }) // 👈 Scoped per user
    if (entries.length === 0) return ctx.reply('📭 No active listeners.')

    let output = '📃 Active Media Forwarders:\n'
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      let sourceName = entry.sourceId.toString()
      let targetName = entry.targetId.toString()

      try {
        const sourceEntity = await client.getEntity(entry.sourceId)
        sourceName =
          'title' in sourceEntity ? sourceEntity.title : sourceEntity.username || sourceName
      } catch (e) {
        console.warn(`⚠️ Failed to resolve sourceId ${entry.sourceId}:`, e.message)
      }

      try {
        const targetEntity = await client.getEntity(entry.targetId)
        targetName =
          'title' in targetEntity ? targetEntity.title : targetEntity.username || targetName
      } catch (e) {
        console.warn(`⚠️ Failed to resolve targetId ${entry.targetId}:`, e.message)
      }

      output += `[${i + 1}] ${sourceName} --> ${targetName}\n`
    }

    return ctx.reply(output.trim())
  })
}
