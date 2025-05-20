import type { TelegramClient } from 'telegram'

export type AuthFlow = 'login' | 'register' | 'accounts' | 'logout'

export type AuthStep =
  | 'await_secret'
  | 'await_phone'
  | 'await_code'
  | 'await_password'
  | 'await_logout_choice' // ✅ used in logout.listener.ts

export interface AuthSession {
  flow: AuthFlow
  step: AuthStep
  phoneNumber?: string
  phoneCodeHash?: string
  client?: TelegramClient
  attempts?: number
}

export const authSessions = new Map<number, AuthSession>()
