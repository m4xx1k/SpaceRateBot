const Telegraf = require('telegraf')

const BOT_TOKEN = '6143502881:AAEQmvcZkDavYqOjfvvjXl7tpWLskmI7OEc'
const URL = 'https://fine-plum-crab-ring.cyclic.app'
const PORT = process.env.PORT || 3000

const bot = new Telegraf(BOT_TOKEN)

// Встановлюємо команду start для генерації deep link
bot.start((ctx) => {
    ctx.reply(`Вітаю! Спробуйте deep link: https://t.me/${ctx.botInfo.username}?start=test_payload`)
})

// Обробка deep linking.
// Коли користувач натискає на посилання, бот отримає команду /start з вказаним payload.
bot.command('start', (ctx) => {
    const payload = ctx.message.text.split(' ')[1]
    ctx.reply(`Deep link payload: ${payload}`)
})

// Тут ви можете додати інші обробники команд і повідомлень.

// Налаштування вебхука
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`)
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)

console.log(`Bot is running on ${PORT}`)
