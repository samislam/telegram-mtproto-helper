import mongoose from 'mongoose'

export interface IMediaForwardingDoc extends mongoose.Document {
  sourceId: number
  sourceType: 'chat' | 'channel'
  sourceHash: string

  targetId: number
  targetType: 'chat' | 'channel'
  targetHash: string
}

const mediaForwardingSchema = new mongoose.Schema<IMediaForwardingDoc>({
  sourceId: { type: Number, required: true, unique: true },
  sourceType: { type: String, required: true },
  sourceHash: { type: String, required: true },

  targetId: { type: Number, required: true },
  targetType: { type: String, required: true },
  targetHash: { type: String, required: true },
})

export const MediaForwardingModel = mongoose.model<IMediaForwardingDoc>(
  'MediaForwarding',
  mediaForwardingSchema
)
