import { client } from './login'

let pingInterval: Timer | null = null

export const startKeepAlive = () => {
  if (pingInterval) return

  pingInterval = setInterval(async () => {
    try {
      await client.invoke({ _: 'ping' }) // low-level ping
      console.log('🔄 Pinged Telegram to keep connection alive.')
    } catch (err: any) {
      console.error('⚠️ Lost connection. Reconnecting...')
      try {
        await client.connect()
        console.log('✅ Reconnected to Telegram.')
      } catch (e: any) {
        console.error('❌ Reconnect failed:', e.message)
      }
    }
  }, 60_000) // every 1 minute
}
