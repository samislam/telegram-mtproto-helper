import { client } from '../../functions/login'
import { MediaForwardingModel } from '../../db/media-forwarding.schema'
import { Api } from 'telegram'

const activeHandlers = new Map<number, (update: any) => void>()

export const registerMediaForwarderHandler = (
  sourceId: number,
  targetId: number,
  sourceType: 'chat' | 'channel',
  sourceHash: string,
  targetType: 'chat' | 'channel',
  targetHash: string
) => {
  const handler = async (update: any) => {
    const msg = update.message
    if (!msg) return

    if (msg.className !== 'Message' || msg.editDate || !msg.media) return

    const peerId = msg.peerId?.channelId?.toJSNumber?.() ?? msg.peerId?.chatId?.toJSNumber?.()
    if (peerId !== sourceId) return

    console.log(`📥 Matched rule for ${sourceId} -> ${targetId}`)

    try {
      const fromPeer = await client.getInputEntity(msg.peerId)

      let toPeer: Api.TypeInputPeer
      if (targetType === 'channel') {
        toPeer = new Api.InputPeerChannel({
          channelId: targetId,
          accessHash: BigInt(targetHash),
        })
      } else {
        toPeer = new Api.InputPeerChat({
          chatId: targetId,
        })
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

  client.addEventHandler(handler)
  activeHandlers.set(sourceId, handler)
}

export const removeMediaForwarderHandler = (sourceId: number) => {
  const handler = activeHandlers.get(sourceId)
  if (handler) {
    client.removeEventHandler(handler)
    activeHandlers.delete(sourceId)
    console.log(`🧹 Removed forwarder for source ${sourceId}`)
  }
}

export const startMediaForwarder = async () => {
  const rules = await MediaForwardingModel.find()

  for (const rule of rules) {
    registerMediaForwarderHandler(
      rule.sourceId,
      rule.targetId,
      rule.sourceType,
      rule.sourceHash,
      rule.targetType,
      rule.targetHash
    )
  }
}
