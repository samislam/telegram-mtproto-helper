import type { ChatOption } from '../../functions/get-chat-list'
import type { IMediaForwardingDoc } from '../../db/media-forwarding.schema'

type MediaForwarderStep = 'await_source_index' | 'await_target_index' | 'awaiting_removal_index'

interface MediaForwarderSession {
  step: MediaForwarderStep
  chatList?: ChatOption[]
  forwarders?: IMediaForwardingDoc[]
  sourceId?: number
}

export const mediaForwarderSessions = new Map<number, MediaForwarderSession>()
