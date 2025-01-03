import chalk from 'chalk'
import qrcode from 'qrcode-terminal'
import { env } from './validate-env'

export const headerLogs = () => {
  console.log(`${chalk.bold.underline.yellow('@' + env.TELEGRAM_BOT_USERNAME)}: Hello there!`)
  console.log(chalk.bold.greenBright('[Success]'), 'the bot is running')
  qrcode.generate(`https://t.me/${env.TELEGRAM_BOT_USERNAME}`, { small: true })
}
