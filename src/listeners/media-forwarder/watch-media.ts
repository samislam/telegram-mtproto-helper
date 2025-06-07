import { Api } from 'telegram'
import { getClientForChat } from '../../lib/mtproto-client-manager'
import { MediaForwardingModel } from '../../db/media-forwarding.schema'

type ForwarderKey = `${number}:${number}` // e.g. "123456:987654"

const activeHandlers = new Map<ForwarderKey, (update: any) => void>()

export const registerMediaForwarderHandler = (
  chatId: number,
  sourceId: number,
  targetId: number,
  sourceType: 'chat' | 'channel' | 'self',
  sourceHash: string,
  targetType: 'chat' | 'channel' | 'self',
  targetHash: string
) => {
  const key: ForwarderKey = `${chatId}:${sourceId}`

  const handler = async (update: any) => {
    const msg = update.message
    if (!msg) return

    if (msg.className !== 'Message' || msg.editDate || !msg.media) return

    const peerId =
      msg.peerId?.channelId?.toJSNumber?.() ??
      msg.peerId?.chatId?.toJSNumber?.() ??
      msg.peerId?.userId?.toJSNumber?.()

    if (peerId !== sourceId) return

    console.log(`📥 Matched rule for ${sourceId} -> ${targetId}`)

    const client = await getClientForChat(chatId)
    if (!client) {
      console.error(`❌ No client found for chatId ${chatId}`)
      return
    }
    if(!client.connected) await client.connect()

    try {
      const fromPeer = await client.getInputEntity(msg.peerId)

      let toPeer: Api.TypeInputPeer
      if (targetType === 'channel') {
        toPeer = new Api.InputPeerChannel({ channelId: targetId, accessHash: BigInt(targetHash) })
      } else if (targetType === 'chat') {
        toPeer = new Api.InputPeerChat({ chatId: targetId })
      } else if (targetType === 'self') {
        toPeer = new Api.InputPeerSelf()
      } else {
        toPeer = new Api.InputPeerUser({ userId: targetId, accessHash: BigInt(targetHash) }) // ✅ new
      }

      await client.forwardMessages(toPeer, {
        fromPeer,
        messages: [msg.id],
      })

      console.log(`✅ Forwarded media from ${sourceId} to ${targetId}`)
    } catch (e: any) {
      console.error(`❌ Failed to forward from ${sourceId}:`, e.message)
    }
  }

  getClientForChat(chatId).then((client) => {
    if (!client) {
      console.error(`❌ Cannot add handler: no client for chatId ${chatId}`)
      return
    }

    client.addEventHandler(handler)
    activeHandlers.set(key, handler)
  })
}

export const removeMediaForwarderHandler = (chatId: number, sourceId: number) => {
  const key: ForwarderKey = `${chatId}:${sourceId}`
  const handler = activeHandlers.get(key)

  if (handler) {
    getClientForChat(chatId).then((client) => {
      if (client) {
        client.removeEventHandler(handler)
        console.log(`🧹 Removed forwarder for chat ${chatId} source ${sourceId}`)
      }
    })

    activeHandlers.delete(key)
  }
}

export const startMediaForwarder = async () => {
  const rules = await MediaForwardingModel.find()

  for (const rule of rules) {
    registerMediaForwarderHandler(
      rule.chatId,
      rule.sourceId,
      rule.targetId,
      rule.sourceType,
      rule.sourceHash,
      rule.targetType,
      rule.targetHash
    )
  }
}
