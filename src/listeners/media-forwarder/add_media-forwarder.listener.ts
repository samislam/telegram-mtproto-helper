import { bot } from '../../lib/bot'
import { getChatList } from '../../functions/get-chat-list'
import { mediaForwarderSessions } from './media-forwarder.session'
import { renderChatListMarkdownV2 } from '../../utils/render-chat-list'

export const add_mediaForwarderListener = () => {
  bot.action('media:add', async (ctx) => {
    await ctx.answerCbQuery()

    const chats = await getChatList(ctx.from.id)
    if (!chats) return ctx.reply('⚠️ Failed to load chat list.')

    const { listText, indexMap } = renderChatListMarkdownV2(chats)

    mediaForwarderSessions.set(ctx.from.id, {
      step: 'await_source_index',
      chatList: Object.values(indexMap), // preserves order
    })

    await ctx.reply(listText, { parse_mode: 'MarkdownV2' })
    await ctx.reply('Choose source to auto-forward from:')
  })
}
