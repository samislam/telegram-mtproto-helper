import mongoose from 'mongoose'

export interface ISessionDoc extends mongoose.Document {
  session: string
}

const sessionSchema = new mongoose.Schema<ISessionDoc>({
  session: { type: String, required: true },
})

export const SessionModel = mongoose.model<ISessionDoc>('Session', sessionSchema)
