
const BOT_TOKEN = '6143502881:AAEQmvcZkDavYqOjfvvjXl7tpWLskmI7OEc'
const URL = 'https://fine-plum-crab-ring.cyclic.app'
const express = require('express')
const Telegraf = require('telegraf')

const PORT = process.env.PORT || 3000

const app = express()
const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => {
    ctx.reply(`Вітаю! Спробуйте deep link: https://t.me/${ctx.botInfo.username}?start=test_payload`)
})

bot.command('start', (ctx) => {
    const payload = ctx.message.text.split(' ')[1]
    ctx.reply(`Deep link payload: ${payload}`)
})

// Тут ви можете додати інші обробники команд і повідомлень.

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`)
app.use(bot.webhookCallback(`/bot${BOT_TOKEN}`))
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
