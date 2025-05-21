import mongoose from 'mongoose'

export interface IMediaForwardingDoc extends mongoose.Document {
  chatId: number // 👈 Telegram user ID (multi-tenancy scope)

  sourceId: number
  sourceType: 'chat' | 'channel'
  sourceHash: string

  targetId: number
  targetType: 'chat' | 'channel'
  targetHash: string
}

const mediaForwardingSchema = new mongoose.Schema<IMediaForwardingDoc>({
  chatId: { type: Number, required: true }, // 👈 required per-user isolation

  sourceId: { type: Number, required: true },
  sourceType: { type: String, required: true },
  sourceHash: { type: String, required: true },

  targetId: { type: Number, required: true },
  targetType: { type: String, required: true },
  targetHash: { type: String, required: true },
})

// Optional: compound unique index per user
mediaForwardingSchema.index({ chatId: 1, sourceId: 1 }, { unique: true })

export const MediaForwardingModel = mongoose.model<IMediaForwardingDoc>(
  'MediaForwarding',
  mediaForwardingSchema
)
