import { bot } from '../lib/bot'

export const setCommands = () => {
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Get help about the bot' },
    { command: 'whoami', description: 'See what the bot knows about you' },
  ])
}
