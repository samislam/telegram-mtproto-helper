import { UserSessionModel } from '../db/user-session.schema'

export async function isUserLoggedIn(chatId: number): Promise<boolean> {
  const session = await UserSessionModel.findOne({ chatId, status: 'active' })
  return !!session
}
