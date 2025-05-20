import { bot } from '../../lib/bot'
import { isOwner } from '../../utils/is-owner'
import { getChatList } from '../../functions/get-chat-list'
import { mediaForwarderSessions } from './media-forwarder.session'

export const add_mediaForwarderListener = () => {
  bot.action('media:add', async (ctx) => {
    if (!isOwner(ctx)) return
    await ctx.answerCbQuery()

    const chats = await getChatList()
    const numberedList = chats.map((c, i) => `[${i + 1}] ${c.title}`).join('\n')

    mediaForwarderSessions.set(ctx.from.id, {
      step: 'await_source_index',
      chatList: chats,
    })

    await ctx.reply(`Chat list:\n${numberedList}`)
    await ctx.reply('Choose source to auto-forward from:')
  })
}
