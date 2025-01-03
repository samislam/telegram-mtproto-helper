import { bot } from '../lib/bot'

export const setCommands = () => {
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Get help about the bot' },
    { command: 'login', description: 'To enable deleting expired links from the chat' },
  ])
}
