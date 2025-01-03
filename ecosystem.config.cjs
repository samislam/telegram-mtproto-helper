// This file is used by pm2 for deployment
module.exports = {
  apps: [
    {
      name: 'telegram-invite-links-cleaner-bot',
      script: 'bun',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      exec_mode: 'cluster',
    },
  ],
}
