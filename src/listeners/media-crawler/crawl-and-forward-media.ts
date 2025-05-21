import { getClientForChat } from '../../lib/mtproto-client-manager'

export const crawlAndForwardMedia = async (
  userId: number,
  sourceId: number,
  targetId: number,
  messages: any[],
  onProgress?: (count: number, total: number) => void
) => {
  const client = await getClientForChat(userId)
  if (!client) throw new Error('Client not found.')

  let source, target

  try {
    source = await client.getInputEntity(sourceId)
    target = await client.getInputEntity(targetId)
  } catch (e) {
    console.error('❌ Failed to resolve source or target peer:', e)
    throw e
  }

  let forwarded = 0

  for (const msg of messages) {
    if (msg.photo || msg.video || msg.document || msg.sticker) {
      try {
        await client.forwardMessages(target, {
          messages: [msg.id],
          fromPeer: source,
        })

        forwarded++
        if (forwarded % 10 === 0 && onProgress) {
          await onProgress(forwarded, messages.length)
        }
      } catch (err: any) {
        if (err.message?.includes('FORBIDDEN')) {
          console.warn(`⚠️ Skipped msg ${msg.id} due to permission error: ${err.message}`)
        } else if (err.message?.includes('PEER_ID_INVALID')) {
          console.warn(`⚠️ PEER_ID_INVALID for msg ${msg.id}. Is the user a member?`)
        } else {
          console.error(`❌ Unexpected error forwarding msg ${msg.id}`, err)
        }
      }
    }
  }

  return forwarded
}
