require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors')
const axios = require('axios')
const crypto = require('crypto')
const path = require('path');
const fs = require('fs');


const TOKEN = '5735997728:AAFxneymHGk9ah-bLIhzo2yVlDG6v5NEoA8'
const url = 'https://goodjoy.uz'
const webappurl = 'https://goodjoy.uz'
const BOT_URL = 'https://bot.goodjoy.uz'
const port = process.env.PORT || 8080;

const bot = new TelegramBot(TOKEN);

const app = express();

app.use(express.json())


app.use(cors({
    origin: ['http://localhost:5173', 'https://api.goodjoy.uz', 'https://goodjoy.uz']
}))


app.get('/photo/:id', async (req, res) => {
    try {
        const {id} = req.params
        const user_profile = await bot.getUserProfilePhotos(id);
        const file_id = user_profile.photos[0][0].file_id;
        const file = await bot.getFile(file_id);
        const file_path = file.file_path;
        const photo_url = `https://api.telegram.org/file/bot${TOKEN}/${file_path}`;
        // Скачуємо файл
        const response = await axios({
            method: 'GET',
            url: photo_url,
            responseType: 'stream',
        });

        // Генеруємо випадкове ім'я файлу
        const fileName = `${crypto.randomBytes(16).toString('hex')}.${file_path.split('.').slice(-1)}`
        const localFilePath = path.join(__dirname, 'files', 'users', fileName);
        const writer = fs.createWriteStream(localFilePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            res.status(200).json(`${BOT_URL}/files/${fileName}`);
        });
        writer.on('error', (error) => {
            res.status(500).json({error: 'An error occurred while writing file.', details: error.message});
        });
    } catch (e) {
        res.status(500).json({error: e.toString()});
    }
})

// ... ваш код

app.use('/files', express.static(path.join(__dirname, 'files', 'users')));

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, 'Привествуем в боте GOODJOY!', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Войти в приложение', web_app: {url: webappurl}}]
            ]
        },
    });

});

bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'This is a help message');
});
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     const user_profile = bot.getUserProfilePhotos(msg.from.id);
//     user_profile.then(function (res) {
//         const file_id = res.photos[0][0].file_id;
//         const file = bot.getFile(file_id);
//         file.then(function (result) {
//             const file_path = result.file_path;
//             const photo_url = `https://api.telegram.org/file/bot${TOKEN}/${file_path}`
//             bot.sendMessage(chatId, photo_url);
//         });
//     });
// });

bot.startPolling().then(() => {
    console.log('bot started')
}).catch(e => console.log(e))
app.listen(port, () => console.log(`Server started ${port}`))

