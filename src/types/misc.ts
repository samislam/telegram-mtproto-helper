import type { Message as TelegrafMessage, Update } from 'telegraf/types'

export type Message = Update.New &
  (Update.NonChannel & TelegrafMessage) & {
    photo: any
    document: any
    video: any
    sticker: any
  }
