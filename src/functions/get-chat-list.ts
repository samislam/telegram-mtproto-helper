import { Api } from 'telegram'
import { getClientForChat } from '../lib/mtproto-client-manager'
import { timeout } from '../utils/timeout'

export interface ChatOption {
  id: number
  title: string
}

export const getChatList = async (chatId: number): Promise<ChatOption[] | null> => {
  try {
    const client = await getClientForChat(chatId)
    if (!client) {
      console.warn(`[getChatList] No client found for chatId: ${chatId}`)
      return null
    }

    const result = await timeout(
      () =>
        client.invoke(
          new Api.messages.GetDialogs({
            limit: 100,
            offsetDate: 0,
            offsetId: 0,
            offsetPeer: new Api.InputPeerEmpty(),
            hash: 0,
          })
        ),
      10000 // 10s timeout
    )

    const entitiesMap = new Map(
      result.users.concat(result.chats).map((e) => [BigInt(e.id).toString(), e])
    )

    const rawChats = result.dialogs
      .map((dialog) => {
        const peer = dialog.peer
        let id: string
        let title: string

        if (peer instanceof Api.PeerUser) {
          id = BigInt(peer.userId).toString()
          title = (entitiesMap.get(id)?.firstName || 'User') as string
        } else if (peer instanceof Api.PeerChat) {
          id = BigInt(peer.chatId).toString()
          title = (entitiesMap.get(id)?.title || 'Chat') as string
        } else if (peer instanceof Api.PeerChannel) {
          id = BigInt(peer.channelId).toString()
          title = (entitiesMap.get(id)?.title || 'Channel') as string
        } else {
          return null
        }

        return { id, title }
      })
      .filter(Boolean) as { id: string; title: string }[]

    const seen = new Set<string>()
    const chats = rawChats.filter((chat) => {
      if (seen.has(chat.id)) return false
      seen.add(chat.id)
      return true
    })

    return chats.map((c) => ({
      id: Number(c.id),
      title: c.title,
    }))
  } catch (err: any) {
    console.error(`[getChatList] Failed for chatId ${chatId}:`, err.message)
    return null
  }
}
