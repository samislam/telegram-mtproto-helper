import mongoose from 'mongoose'

export interface IUserSessionDoc extends mongoose.Document {
  phoneNumber: string
  session: string
  chatId: number
  status: 'active' | 'expired'
}

const userSessionSchema = new mongoose.Schema<IUserSessionDoc>({
  phoneNumber: { type: String, required: true },
  session: { type: String, required: true },
  chatId: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
})

export const UserSessionModel = mongoose.model<IUserSessionDoc>('UserSession', userSessionSchema)
