
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const {keyboard} = require("telegraf/src/markup");
const TOKEN = '6143502881:AAEQmvcZkDavYqOjfvvjXl7tpWLskmI7OEc'
const url = 'https://fine-plum-crab-ring.cyclic.app'
const webappurl = 'https://olive-iguana-tie.cyclic.app'
const port = process.env.PORT || 6562;

const bot = new TelegramBot(TOKEN, {
    webHook: {
        port
    }
});

const app = express();
app.use(bodyParser.json());

app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, 'Hello, Welcome to my bot!', {
        reply_markup: {keyboard:[
            [{text:'go',web_app:{url:webappurl}}]
    ]},
    });

});

bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'This is a help message');
});

// Deep linking
bot.onText(/\/start (\w+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const deepLinkId = match[1]; // the captured "whatever"

    // Use deepLinkId to decide what to do
    await bot.sendMessage(chatId, `Deep link clicked with ID: ${deepLinkId}`);
});

const startBot = async () => {
    try {

        await bot.setWebHook(`${url}/bot${TOKEN}`);
        app.listen(port, () => {
            console.log(`Express server is listening on ${port}`);
        });
        console.log(3)

    } catch (error) {
        console.log(error);
    }
};

startBot();// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
