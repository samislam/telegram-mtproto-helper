import { bot } from '../lib/bot'

export const setCommands = () => {
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Get help about the bot' },
    { command: 'whoami', description: 'See what the bot knows about you' },
    { command: 'register', description: 'Register a new account' },
    { command: 'login', description: 'Login to another account' },
    { command: 'accounts', description: 'List registered accounts' },
    { command: 'logout', description: 'Logout from your current session' },
  ])
}
