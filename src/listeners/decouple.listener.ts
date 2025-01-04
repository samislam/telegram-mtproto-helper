import { bot } from '../lib/bot'
import { concat } from 'concat-str'
import { message } from 'telegraf/filters'
import { env } from '../service/validate-env'
import ProcessedLink from '../db/links.schema'
import { sendNotification } from '../functions/send-notification'

export const decoupleListener = () => {
  return bot.on(message('text'), async (ctx) => {
    const chatId = ctx.chat.id
    const messageId = ctx.message.message_id
    const messageText = ctx.message.text

    const username = ctx.from.username || null
    const userId = ctx.from.id || null

    message: await sendNotification(
      [
        '@invitelinkscleaner:',
        'New incoming message',
        `sender: ${concat(ctx.from.first_name, ctx.from?.last_name ?? '')}`,
        `username: ${username}`,
        `${messageText}`,
      ].join('\n')
    )

    // Regular expression to detect any URL links
    const inviteLinkRegex = /(t\.me\/(?:\+[\w\d]+|[\w\d]+|addlist\/[\w\d]+))/g
    const anyLinkRegex = /https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+/g
    const linkRegex = env.ONLY_JOIN_LINKS ? inviteLinkRegex : anyLinkRegex

    // Extract invite links from the message
    const inviteLinks = messageText.match(linkRegex)

    if (inviteLinks) {
      const uniqueLinks: string[] = []

      for (const link of inviteLinks) {
        const isDuplicate = await ProcessedLink.exists({ chatId, link })

        if (!isDuplicate) {
          uniqueLinks.push(link)

          // Send each unique link as a separate message
          const sentMessage = await ctx.reply(link)

          // Save the sent message info in the database, not the original user message
          const sentLinkRecord = new ProcessedLink({
            chatId,
            link,
            username,
            userId,
            messageId: sentMessage.message_id, // Store the bot's sent messageId
          })
          await sentLinkRecord.save()
        }
      }

      // Log duplicates (optional)
      const duplicates = inviteLinks.filter((link) => !uniqueLinks.includes(link))
      if (duplicates.length > 0) {
        console.log('Duplicate links detected:', duplicates)
      }
    }

    // Delete the user's original message
    try {
      await bot.telegram.deleteMessage(chatId, messageId)
    } catch (error) {
      console.error(`Failed to delete message ${messageId}:`, error)
    }

    // If no invite links are found, log and do nothing further
    if (!inviteLinks) {
      console.log('No invite links found. Deleting message.')
    }
  })
}
