import type { ChatOption } from '../../functions/get-chat-list'

interface MediaCrawlerSession {
  step:
    | 'await_source_index'
    | 'await_target_index'
    | 'await_confirmation'
    | 'await_scan_depth'
    | 'crawling'
  sourceId?: number
  targetId?: number
  scanStats?: { total: number; images: number; videos: number; stickers: number }
  chatList?: ChatOption[]
}

export const mediaCrawlerSessions = new Map<number, MediaCrawlerSession>()
