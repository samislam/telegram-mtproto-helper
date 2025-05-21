import { bot } from '../../lib/bot'
import { mediaCrawlerSessions } from './media-crawler.session'
import { getChatList } from '../../functions/get-chat-list'
import { renderChatListMarkdownV2 } from '../../utils/render-chat-list'

export const onMediaCrawlerCommand = () => {
  bot.action('cmd:media_crawler', async (ctx) => {
    const chatId = ctx.from.id

    try {
      const chats = await getChatList(chatId)
      if (!chats || chats.length === 0) {
        return ctx.reply(
          '❌ Failed to load your chats or no available chats found. Make sure you are logged in.'
        )
      }

      const { listText, indexMap } = renderChatListMarkdownV2(chats)

      mediaCrawlerSessions.set(chatId, {
        step: 'await_source_index',
        chatList: Object.values(indexMap), // preserve selection order
      })

      await ctx.reply(listText, { parse_mode: 'MarkdownV2' })
      await ctx.reply('Choose source:')
    } catch (err: any) {
      console.error(`[media-crawler] Failed to load chats for ${chatId}:`, err.message)
      await ctx.reply('❌ Error while loading chats. Try logging in again.')
    }
  })
}
