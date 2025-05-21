import { escapeMarkdownV2 } from './escape-markdownv2'

export interface ChatOption {
  id: number
  title: string
  type: 'self' | 'group' | 'channel' | 'user'
}

export const renderChatListMarkdownV2 = (
  chats: ChatOption[]
): {
  listText: string
  indexMap: { [index: number]: ChatOption }
} => {
  let index = 1
  const replyLines: string[] = []
  const indexMap: { [i: number]: ChatOption } = {}

  const addSection = (label: string, items: ChatOption[]) => {
    if (items.length === 0) return
    replyLines.push(`*${escapeMarkdownV2(label)}:*`)
    for (const item of items.sort((a, b) => a.title.localeCompare(b.title))) {
      replyLines.push(`\\[${index}\\] ${escapeMarkdownV2(item.title)}`)
      indexMap[index] = item
      index++
    }
    replyLines.push('')
  }

  addSection(
    'Saved Messages',
    chats.filter((c) => c.type === 'self')
  )
  addSection(
    'Groups',
    chats.filter((c) => c.type === 'group')
  )
  addSection(
    'Channels',
    chats.filter((c) => c.type === 'channel')
  )
  addSection(
    'Other',
    chats.filter((c) => c.type === 'user')
  )

  return {
    listText: replyLines.join('\n'),
    indexMap,
  }
}
