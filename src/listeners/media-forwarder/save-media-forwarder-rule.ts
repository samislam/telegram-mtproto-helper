import { MediaForwardingModel } from '../../db/media-forwarding.schema'
import { getClientForChat } from '../../lib/mtproto-client-manager'
import { removeMediaForwarderHandler, registerMediaForwarderHandler } from './watch-media'
import { Api } from 'telegram'

function extractPeerTypeAndHash(peer: Api.TypeInputPeer): {
  peerType: 'chat' | 'channel' | 'self' | 'user'
  accessHash: string
} {
  if (peer instanceof Api.InputPeerChannel) {
    return { peerType: 'channel', accessHash: peer.accessHash.toString() }
  } else if (peer instanceof Api.InputPeerChat) {
    return { peerType: 'chat', accessHash: '0' }
  } else if (peer instanceof Api.InputPeerSelf) {
    return { peerType: 'self', accessHash: '0' }
  } else if (peer instanceof Api.InputPeerUser) {
    return { peerType: 'user', accessHash: peer.accessHash.toString() }
  }

  throw new Error('Unsupported peer type')
}

export const saveMediaForwarderRule = async (
  userId: number,
  sourceId: number,
  targetId: number
) => {
  const client = await getClientForChat(userId)
  if (!client) throw new Error('No client found for this user.')

  const sourceEntity = await client.getEntity(sourceId)
  const sourcePeer = await client.getInputEntity(sourceEntity)
  const { peerType: sourceType, accessHash: sourceHash } = extractPeerTypeAndHash(sourcePeer)

  const targetEntity = await client.getEntity(targetId)
  const targetPeer = await client.getInputEntity(targetEntity)
  const { peerType: targetType, accessHash: targetHash } = extractPeerTypeAndHash(targetPeer)

  // ✅ Store with chatId for multi-tenancy
  await MediaForwardingModel.updateOne(
    { chatId: userId, sourceId },
    {
      $set: {
        chatId: userId,
        sourceId,
        sourceType,
        sourceHash,
        targetId,
        targetType,
        targetHash,
      },
    },
    { upsert: true }
  )

  // ✅ Scoped handler by userId
  removeMediaForwarderHandler(userId, sourceId)
  registerMediaForwarderHandler(
    userId,
    sourceId,
    targetId,
    sourceType,
    sourceHash,
    targetType,
    targetHash
  )

  console.log(`🔁 Saved media forwarder: ${sourceId} ➜ ${targetId}`)
}
