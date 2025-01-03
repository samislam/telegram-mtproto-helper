import mongoose from 'mongoose'

const processedLinkSchema = new mongoose.Schema({
  chatId: { type: Number, required: true },
  link: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  username: { type: String, required: false },
  userId: { type: String, required: false },
  messageId: { type: Number, required: true },
})

const ProcessedLink = mongoose.model('ProcessedLink', processedLinkSchema)

export default ProcessedLink
