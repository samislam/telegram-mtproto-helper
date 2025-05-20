import { MediaForwardingModel } from '../../db/media-forwarding.schema'
import { client } from '../../functions/login'
import { removeMediaForwarderHandler, registerMediaForwarderHandler } from './watch-media'
import { Api } from 'telegram'

function extractPeerTypeAndHash(peer: Api.TypeInputPeer): {
  peerType: 'chat' | 'channel'
  accessHash: string
} {
  if (peer instanceof Api.InputPeerChannel) {
    return { peerType: 'channel', accessHash: peer.accessHash.toString() }
  } else if (peer instanceof Api.InputPeerChat) {
    return { peerType: 'chat', accessHash: '0' } // chats don’t have access_hash
  }

  throw new Error('Unsupported peer type')
}

export const saveMediaForwarderRule = async (sourceId: number, targetId: number) => {
  const sourceEntity = await client.getEntity(sourceId)
  const sourcePeer = await client.getInputEntity(sourceEntity)
  const { peerType: sourceType, accessHash: sourceHash } = extractPeerTypeAndHash(sourcePeer)

  const targetEntity = await client.getEntity(targetId)
  const targetPeer = await client.getInputEntity(targetEntity)
  const { peerType: targetType, accessHash: targetHash } = extractPeerTypeAndHash(targetPeer)

  await MediaForwardingModel.updateOne(
    { sourceId },
    {
      $set: {
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

  removeMediaForwarderHandler(sourceId)
  registerMediaForwarderHandler(sourceId, targetId, sourceType, sourceHash, targetType, targetHash)

  console.log(`🔁 Saved media forwarder: ${sourceId} ➜ ${targetId}`)
}
