import { scanMedia } from './scan-media'
import { isOwner } from '../../utils/is-owner'
import { mediaCrawlerSessions } from './media-crawler.session'
import { crawlAndForwardMedia } from './crawl-and-forward-media'
import type { MessageListener } from '../../utils/register-message-listeners'

export const onMediaCrawlerUserSelection: MessageListener = async (ctx) => {
  if (!isOwner(ctx)) return

  // // ✅ TEMP: Debug forwarded messages
  // if (ctx.message?.forward_from || ctx.message?.forward_sender_name || ctx.message?.sender_chat) {
  //   console.log('🧪 Forwarded message structure:')
  //   console.dir(ctx.message, { depth: null })
  // }

  const session = mediaCrawlerSessions.get(ctx.from.id)
  if (!session || !session.chatList) return

  const text = ctx.message.text.trim()

  // Step 1: User selects source
  if (session.step === 'await_source_index') {
    const index = parseInt(text)
    if (isNaN(index) || index < 1 || index > session.chatList.length) return

    const selected = session.chatList[index - 1]
    session.sourceId = Number(selected.id)
    session.step = 'await_target_index'
    return ctx.reply('Choose destination:')
  }

  // Step 2: User selects target
  if (session.step === 'await_target_index') {
    const index = parseInt(text)
    if (isNaN(index) || index < 1 || index > session.chatList.length) return

    const selected = session.chatList[index - 1]
    session.targetId = Number(selected.id)

    if (session.sourceId === session.targetId) {
      mediaCrawlerSessions.delete(ctx.from.id)
      return ctx.reply('⚠️ Source and target chats must be different. Start again.')
    }

    session.step = 'await_scan_depth'
    return ctx.reply('📊 Enter how many messages to scan (e.g. 1000, 5000, 10000):')
  }

  // Step 3: User chooses scan depth
  if (session.step === 'await_scan_depth') {
    const depth = parseInt(text)
    if (isNaN(depth) || depth < 100 || depth > 50000) {
      return ctx.reply('❌ Please enter a number between 100 and 50000.')
    }

    session.scanLimit = depth
    session.step = 'await_confirmation'
    await ctx.reply('Scanning...')

    const { stats, messages } = await scanMedia(session.sourceId!, session.scanLimit!)

    session.scanStats = stats
    ;(session as any).scannedMessages = messages

    return ctx.reply(
      `Scan complete, found ${stats.total} media:\n- Images: ${stats.images}\n- Videos: ${stats.videos}\n- Stickers: ${stats.stickers}\n\nStart crawling? [yes/no]`
    )
  }

  // Step 4: User confirms crawling
  if (session.step === 'await_confirmation') {
    const answer = text.toLowerCase()
    console.log('1- ', answer)

    if (answer === 'no') {
      console.log('2- ', answer)
      mediaCrawlerSessions.delete(ctx.from.id)
      return ctx.reply('Aborted.')
    }

    if (answer !== 'yes') return

    session.step = 'crawling'
    await ctx.reply('Crawling started...')

    let lastProgress = 0
    const messages = (session as any).scannedMessages

    await crawlAndForwardMedia(
      session.sourceId!,
      session.targetId!,
      messages,
      async (count, total) => {
        if (count - lastProgress >= 10) {
          await ctx.reply(`${count}/${total}`)
          lastProgress = count
        }
      }
    )

    await ctx.reply('Crawling complete.')
    mediaCrawlerSessions.delete(ctx.from.id)
  }
}
