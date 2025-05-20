// import { bot } from '../../lib/bot'
// import { client } from '../../functions/login'
// import { isOwner } from '../../utils/is-owner'
// import { mediaCrawlerSessions } from './media-crawler.session'
// import { Api } from 'telegram'

// export const onMediaCrawlerCommand = () => {
//   bot.action('cmd:media_crawler', async (ctx) => {
//     if (!isOwner(ctx)) return

//     // ✅ Invoke raw getDialogs request instead of client.getDialogs()
//     const result = await client.invoke(
//       new Api.messages.GetDialogs({
//         limit: 100,
//         offsetDate: 0,
//         offsetId: 0,
//         offsetPeer: new Api.InputPeerEmpty(),
//         hash: 0,
//       })
//     )

//     // ✅ Extract dialogs safely
//     const entitiesMap = new Map(
//       result.users.concat(result.chats).map((e) => [BigInt(e.id).toString(), e])
//     )

//     const rawChats = result.dialogs
//       .map((dialog) => {
//         const peer = dialog.peer
//         let id: string
//         let title: string

//         if (peer instanceof Api.PeerUser) {
//           id = BigInt(peer.userId).toString()
//           title = (entitiesMap.get(id)?.firstName || 'User') as string
//         } else if (peer instanceof Api.PeerChat) {
//           id = BigInt(peer.chatId).toString()
//           title = (entitiesMap.get(id)?.title || 'Chat') as string
//         } else if (peer instanceof Api.PeerChannel) {
//           id = BigInt(peer.channelId).toString()
//           title = (entitiesMap.get(id)?.title || 'Channel') as string
//         } else {
//           return null
//         }

//         return { id, title }
//       })
//       .filter(Boolean)

//     // ✅ Deduplicate by ID
//     const seen = new Set<string>()
//     const chats = rawChats.filter((chat) => {
//       if (seen.has(chat!.id)) return false
//       seen.add(chat!.id)
//       return true
//     })

//     const numberedList = chats.map((c, i) => `[${i + 1}] ${c!.title}`).join('\n')

//     mediaCrawlerSessions.set(ctx.from.id, {
//       step: 'await_source_index',
//       chatList: chats as any,
//     })

//     await ctx.reply(`Chat list:\n${numberedList}`)
//     await ctx.reply('Choose source:')
//   })
// }

import { bot } from '../../lib/bot'
import { isOwner } from '../../utils/is-owner'
import { mediaCrawlerSessions } from './media-crawler.session'
import { getChatList } from '../../functions/get-chat-list'

export const onMediaCrawlerCommand = () => {
  bot.action('cmd:media_crawler', async (ctx) => {
    if (!isOwner(ctx)) return

    const chats = await getChatList()
    const numberedList = chats.map((c, i) => `[${i + 1}] ${c.title}`).join('\n')

    mediaCrawlerSessions.set(ctx.from.id, {
      step: 'await_source_index',
      chatList: chats,
    })

    await ctx.reply(`Chat list:\n${numberedList}`)
    await ctx.reply('Choose source:')
  })
}
