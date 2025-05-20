import { isOwner } from '../../utils/is-owner'
import { mediaForwarderSessions } from './media-forwarder.session'
import { saveMediaForwarderRule } from './save-media-forwarder-rule'
import type { MessageListener } from '../../utils/register-message-listeners'

export const onMediaForwarderUserSelection: MessageListener = async (ctx) => {
  if (!isOwner(ctx)) return

  const session = mediaForwarderSessions.get(ctx.from.id)

  console.log(session)

  const text = ctx.message?.text?.trim()
  if (!session || !text || !session.chatList) return

  const index = parseInt(text)
  if (isNaN(index) || index < 1 || index > session.chatList.length) {
    await ctx.reply('❌ Invalid number. Try again.')
    return
  }

  const selected = session.chatList[index - 1]

  if (session.step === 'await_source_index') {
    session.sourceId = selected.id
    session.step = 'await_target_index'
    return ctx.reply('📥 Now choose where to forward to:')
  }

  if (session.step === 'await_target_index') {
    const targetId = selected.id
    if (session.sourceId === targetId) {
      mediaForwarderSessions.delete(ctx.from.id)
      return ctx.reply('⚠️ Source and target cannot be the same. Start again.')
    }

    await saveMediaForwarderRule(session.sourceId, targetId)
    await ctx.reply(`✅ Done. Forwarding media from "${session.sourceId}" ➜ "${targetId}"`)
    mediaForwarderSessions.delete(ctx.from.id)
  }
}
