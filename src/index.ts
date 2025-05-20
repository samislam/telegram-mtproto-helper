import chalk from 'chalk'
import to from 'await-to-js'
import { bot } from './lib/bot'
import { configDotenv } from 'dotenv'
import { login } from './functions/login'
import { connectDb } from './db/connect-db'
import { setCommands } from './functions/set-commands'
import { startKeepAlive } from './functions/keep-alive'
import { helpListener } from './listeners/help.listener'
import { startListener } from './listeners/start.listener'
import { whoamiListener } from './listeners/whoami.listener'
import { loginListener } from './listeners/auth/login.listener'
import { logoutListener } from './listeners/auth/logout.listener'
import { listRulesListener } from './listeners/list-rules.listener'
import { loginController } from './listeners/auth/login.controller'
import { registerBotListeners } from './utils/register-bot-listeners'
import { registerListener } from './listeners/auth/register.listener'
import { logoutController } from './listeners/auth/logout.controller'
import { registerController } from './listeners/auth/regsiter.controller'
import { accountsController } from './listeners/auth/accounts.controller'
import { startMediaForwarder } from './listeners/media-forwarder/watch-media'
import { registerMessageListeners } from './utils/register-message-listeners'
import { processTerminateListener } from './service/process-terminate-listeners'
import { mediaCrawlerListener } from './listeners/media-crawler/media-crawler.listener'
import { onMediaCrawlerUserSelection } from './listeners/media-crawler/on-user-selection'
import { linksForwarderListener } from './listeners/links-forwarder/links-forwarder.listener'
import { onMediaForwarderUserSelection } from './listeners/media-forwarder/on-user-selection'
import { mediaForwarderController } from './listeners/media-forwarder/media-forwarder.controller'
import { remove_mediaForwarderListener } from './listeners/media-forwarder/remove_media-forwarder.listener'

async function main() {
  /*----- 1) Read env and connect to MongoDB -----*/
  configDotenv({ path: '../.env.local' })
  console.log(`${chalk.blueBright.bold('[info]')} connecting to MongoDB...`)
  {
    const [err] = await to(connectDb())
    if (err) {
      console.error(`${chalk.red.bold('[Error]')} DB connection failed`, err)
      process.exit(1)
    }
    console.log(`${chalk.greenBright.bold('[Success]')} MongoDB connected`)
  }

  /*----- 2) Load or prompt for Telegram string session -----*/
  const client = await login()

  /*----- 3) Send yourself a “hello” into Saved Messages -----*/
  await client.sendMessage('me', { message: 'hello' })
  await startMediaForwarder()
  startKeepAlive()

  /*----- 4) Setup Bot -----*/
  registerBotListeners([
    helpListener,
    startListener,
    whoamiListener,
    loginController,
    listRulesListener,
    registerController,
    mediaCrawlerListener,
    linksForwarderListener,
    mediaForwarderController,
    accountsController,
    logoutController,
  ])

  registerMessageListeners([
    logoutListener,
    loginListener,
    registerListener,
    onMediaCrawlerUserSelection,
    onMediaForwarderUserSelection,
    remove_mediaForwarderListener,
  ])
  setCommands()

  bot.launch(() => console.log('Bot connected successfully'))

  /*----- 4) Wait for termination -----*/
  processTerminateListener()
}

main().catch((err) => {
  console.error(err)
  // process.exit(1)
})
