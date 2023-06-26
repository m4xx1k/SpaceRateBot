const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

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

app.use(express.json())


app.use(cors({
    origin: ['http://localhost:5173', 'https://gilded-longma-21e97b.netlify.app', 'https://olive-iguana-tie.cyclic.app', 'https://cautious-pumps-toad.cyclic.app']
}))

app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
app.get('/photo/:id', (req, res) => {
    try {
        const {id} = req.params
        const user_profile = bot.getUserProfilePhotos(id);
        user_profile.then(function (res1) {
            const file_id = res1.photos[0][0].file_id;
            console.log(file_id)
            const file = bot.getFile(file_id);

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
// Deep linking
// bot.onText(/\/start (\w+)/, async (msg, match) => {
//     const chatId = msg.chat.id;
//     const deepLinkId = match[1]; // the captured "whatever"
//
//     // Use deepLinkId to decide what to do
//     await bot.sendMessage(chatId, `Deep link clicked with ID: ${deepLinkId}`);
// });

// const startBot = async () => {
//     try {
//
//         await bot.setWebHook(`${url}/bot${TOKEN}`);
//         app.listen(port, () => {
//             console.log(`Express server is listening on ${port}`);
//         });
//         console.log(3)
//
//     } catch (error) {
//         console.log(error);
//     }
// };
bot.startPolling().then(() => {
    console.log('bot started')
    app.listen(port, () => console.log(`Server started ${port}`))

}).catch(e => console.log(e))
// // startBot();// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
