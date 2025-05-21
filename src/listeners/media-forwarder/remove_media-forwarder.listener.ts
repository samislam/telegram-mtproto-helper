import { removeMediaForwarderHandler } from './watch-media'
import { mediaForwarderSessions } from './media-forwarder.session'
import { MediaForwardingModel } from '../../db/media-forwarding.schema'
import type { MessageListener } from '../../utils/register-message-listeners'

export const remove_mediaForwarderListener: MessageListener = async (ctx) => {
  const session = mediaForwarderSessions.get(ctx.from.id)
  if (!session || session.step !== 'awaiting_removal_index' || !session.forwarders) return

  console.log('deleting media...')
  const text = ctx.message.text.trim()
  const index = parseInt(text)
  if (isNaN(index) || index < 1 || index > session.forwarders.length) {
    return ctx.reply('❌ Invalid number.')
  }

  const entry = session.forwarders[index - 1]

  // ❗ Fix: Filter delete by user too
  await MediaForwardingModel.deleteOne({
    chatId: ctx.from.id, // 👈 ensure multi-tenant isolation
    sourceId: entry.sourceId,
  })

  removeMediaForwarderHandler(ctx.from.id, entry.sourceId) // 👈 Pass chatId

  mediaForwarderSessions.delete(ctx.from.id)

  return ctx.reply(`🗑 Removed listener from chat ${entry.sourceId}`)
}
