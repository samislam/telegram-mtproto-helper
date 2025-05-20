import { bot } from '../../lib/bot'
import { MediaForwardingModel } from '../../db/media-forwarding.schema'
import { client } from '../../functions/login'

export const list_mediaForwarderListener = () => {
  bot.action('media:list', async (ctx) => {
    await ctx.answerCbQuery()

    const entries = await MediaForwardingModel.find()
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
