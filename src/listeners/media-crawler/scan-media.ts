import { client } from '../../functions/login'

export const scanMedia = async (chatId: number, maxMessages: number) => {
  const entity = await client.getInputEntity(chatId)

  let stats = {
    total: 0,
    images: 0,
    videos: 0,
    stickers: 0,
  }

  const messages = []

  let scanned = 0

  for await (const msg of client.iterMessages(entity, { reverse: false })) {
    if (!msg) continue

    scanned++
    if (scanned % 100 === 0) {
      console.log(`🧭 Scanned ${scanned} messages... media: ${stats.total}`)
    }

    if (msg.photo || msg.video || msg.document || msg.sticker) {
      stats.total++
      if (msg.photo) stats.images++
      if (msg.video) stats.videos++
      if (msg.sticker) stats.stickers++
      messages.push(msg)
    }

    if (scanned >= maxMessages) break
  }

  console.log(`✅ Scan done: ${stats.total} media from ${scanned} messages.`)

  return { stats, messages }
}
