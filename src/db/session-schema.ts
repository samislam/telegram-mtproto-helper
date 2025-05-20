import mongoose from 'mongoose'

export interface ISessionDoc extends mongoose.Document {
  session: string
  phoneNumber: string
}

const sessionSchema = new mongoose.Schema<ISessionDoc>({
  session: { type: String, required: true },
  phoneNumber: { type: String, required: true }, // ← NEW
})

export const SessionModel = mongoose.model<ISessionDoc>('Session', sessionSchema)
