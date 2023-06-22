
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const TOKEN = '6143502881:AAEQmvcZkDavYqOjfvvjXl7tpWLskmI7OEc'
const url = 'https://fine-plum-crab-ring.cyclic.app'

const port = process.env.PORT || 3000;

const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: port
    }
});
bot.setWebHook(`${url}/bot${TOKEN}`);

const app = express();
app.use(bodyParser.json());

app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello, Welcome to my bot!');
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'This is a help message');
});

// Deep linking
bot.onText(/\/start (\w+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const deepLinkId = match[1]; // the captured "whatever"

    // Use deepLinkId to decide what to do
    bot.sendMessage(chatId, `Deep link clicked with ID: ${deepLinkId}`);
});

app.listen(port, () => {
    console.log(`Express server is listening on ${port}`);
});
