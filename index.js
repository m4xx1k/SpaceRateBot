require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors')

const TOKEN = '6143502881:AAEQmvcZkDavYqOjfvvjXl7tpWLskmI7OEc'
const url = 'https://fine-plum-crab-ring.cyclic.app'
const webappurl = 'https://olive-iguana-tie.cyclic.app'
const port = process.env.PORT || 8080;

const bot = new TelegramBot(TOKEN);

const app = express();

app.use(express.json())


app.use(cors({
    origin: ['http://localhost:5173', 'https://gilded-longma-21e97b.netlify.app', 'https://olive-iguana-tie.cyclic.app', 'https://cautious-pumps-toad.cyclic.app']
}))


app.get('/photo/:id', (req, res) => {
    try {
        console.log(1)
        const {id} = req.params
        const user_profile = bot.getUserProfilePhotos(id);
        user_profile.then(function (res1) {
            const file_id = res1.photos[0][0].file_id;
            console.log(file_id)
            const file = bot.getFile(file_id);
            console.log(file)
            // res.status(200).json(file)

            file.then(function (result) {
                const file_path = result.file_path;
                console.log(file_path)
                const photo_url = `https://api.telegram.org/file/bot${TOKEN}/${file_path}`
                res.status(200).json(photo_url)
            });
        });
    } catch (e) {
        res.status(500).json({error: JSON.stringify(e)})
    }
})
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, 'Hello, Welcome to my bot!', {
        reply_markup: {
            keyboard: [
                [{text: 'go', web_app: {url: webappurl}}]
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

