require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors')
const axios = require('axios')
const crypto = require('crypto')
const path = require('path');
const fs = require('fs');
const UserStarted = require('./models/UserStarted.model');
require('./db');
const multer = require('multer');
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




// налаштування multer
const upload = multer();

// ініціалізуємо сервер
app.use(express.json());

//...

// записуємо ID чату та ID користувача в базу даних, коли користувач натискає /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    try {
        const isUserInDatabase = await UserStarted.find({telegramId,chatId})
        if(!isUserInDatabase){
            await UserStarted.create({ chatId, telegramId });
        }
        await bot.sendMessage(chatId, 'Привествуем в боте GOODJOY!', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Войти в приложение', web_app: {url: webappurl}}]
                ]
            },
        });
    } catch (e) {
        console.log(e);
    }
});

// створюємо endpoint для надсилання повідомлень
// Multer обробляє форму multipart/form-data.
// .any() приймає всі файли, що надходять.
const { v4: uuidv4 } = require('uuid');

app.post('/broadcast', upload.array('file'), async (req, res) => {
    try {
        const usersStarted = await UserStarted.find({});

        let files = req.files; // отримання файлів з форми
        console.log({body:req.body})
        let text = req.body.text // отримання тексту з форми

        // масив для зберігання шляхів до всіх файлів
        let filePaths = [];

        // прохід по всім користувачам
        for (let userStarted of usersStarted) {
            try {
                // відправлення тексту
                // await bot.sendMessage(userStarted.chatId, text);

                // альбом для фотографій
                let photoAlbum = [];
                // відправлення медіафайлів
                for(let [i,file] of files.entries()) {
                    let uuidFileName = uuidv4() + path.extname(file.originalname);
                    let filePath = path.join(__dirname, uuidFileName);
                    fs.writeFileSync(filePath, file.buffer);
                    filePaths.push(filePath);  // зберігання шляху до файлу
                    let fileType = path.extname(file.originalname);

                    if(fileType === '.jpg' || fileType === '.png' ||fileType === '.webp' || fileType === '.svg' || fileType === '.jpeg' || fileType ==='.avif') {
                        const data = {
                            type: 'photo',
                            media: filePath // замість об'єкту використайте шлях до файлу як рядок
                        }
                        if(i===0) data.caption = text

                        photoAlbum.push(data);
                    } else if(fileType === '.mp4') {
                        // відправлення відео
                        await bot.sendVideo(userStarted.chatId, filePath); // замість об'єкту використайте шлях до файлу як рядок
                    } else {
                        // відправлення документа
                        await bot.sendDocument(userStarted.chatId, filePath); // замість об'єкту використайте шлях до файлу як рядок
                    }
                }

                // відправлення фотографій
                if (photoAlbum.length > 1) {
                    await bot.sendMediaGroup(userStarted.chatId, photoAlbum);
                } else if (photoAlbum.length === 1) {
                    await bot.sendPhoto(userStarted.chatId, photoAlbum[0].media,{caption:text});
                }

                console.log('sent')
            } catch (error) {
                console.log('err in sending', error.toJSON())
                if (error.message.includes('403')) {
                    await UserStarted.deleteOne({ chatId: userStarted.chatId });
                    console.log('користувач заблокував бота, видаляємо його з бази даних')
                }
            }
        }

        // Видаляємо файли після відправлення
        for (let path of filePaths) {
            fs.unlinkSync(path);
        }

        res.status(200).send({ success: true });
    } catch(err) {
        res.status(500).send({ success: false, message: err.message });
    }
});










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














// bot.onText(/\/start/, async (msg) => {
//     const chatId = msg.chat.id;
//
//     await bot.sendMessage(chatId, 'Привествуем в боте GOODJOY!', {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: 'Войти в приложение', web_app: {url: webappurl}}]
//             ]
//         },
//     });
//
// });
