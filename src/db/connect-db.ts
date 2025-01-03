import mongoose from 'mongoose'
import { env } from '../service/validate-env'

export const connectDb = async () => {
  const connection = await mongoose.connect(env.DATABASE_URL)
  return connection
}
