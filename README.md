# telegram-invite-links-cleaner-bot

A simple and powerful bot that can clean all your duplicated invite links and store them in one chat. Supports multi users.

# Setup

1. Rename the file `.env.example` to `.env.local`.
2. Obtain a bot token from the **telegram bot father**.
3. Paste your token in the `TELEGRAM_BOT_TOKEN` environment variable field in the `.env.local` file.
4. Paste your bot username in the `TELEGRAM_BOT_USERNAME`.
5. You'll need to setup MongoDB, follow guides online on how to run MongoDB on your machine, then paste your MongoDB connection URL in the `DATABASE_URL` field of the `.env.local` file.
6. Run the following commands in your terminal:
```bash
$ bun install
$ bun start
```

> This bot requires bun to be installed, if you don't have bun, download it from [it's website](https://bun.sh/).
> Bun is faster than Nodejs.

# Guide
Chat with the bot, tap "start" to start the chat, the bot includes information on how to get started, it's easy, just send the bot any URL and see how it functions.

For example, try to send the bot the following URL:
`https://example.com`, it's going to delete your message and send you the URL in a message like `https://example.com`. If you tried to send `https://example.com` again, it's going to drop your message. Try to send `Hello`, and it's going to delete your message. Try to send
```
Hello
https://google.com
```
and it's going to drop your message, and send you back `https://google.com`
The resulting chat would be 
```
@bot: https://example.com
@bot: https://google.com
```
So you'll have clean links base.

Now, you might wonder why the bot is accepting any URL and not only telegram invitation links. This behaviour can be changed easily by changing the environment variable `ONLY_JOIN_LINKS=false` to `ONLY_JOIN_LINKS=true` in your `.env.local` file.

Rembmer that after changing any file, if you want to see the results, you have to restart your running service by stopping the process and rerunning the command `bun start`.

# Usage Notifications

You can get notified when someone uses your bot easily, 
1. create a new bot using the bot father and copy the generated token and your bot username.
2. paste the values in `.env.local` environment variables `NOTIFICATIONS_BOT_TOKEN` and `NOTIFICATIONS_BOT_USERNAME`.
3. Get your chat id with your notifications bot, you can find tutorials online on how to get the chat id between you and your bot online, the library used in this code is `telegraf`. Then paste your chat id in the `NOTIFICATIONS_BOT_OWNER_CHAT_ID` environment variable.
4. set the environment variable `NOTIFICATIONS_ENABLED` to `true`.