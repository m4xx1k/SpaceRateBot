
const BOT_TOKEN = '6143502881:AAEQmvcZkDavYqOjfvvjXl7tpWLskmI7OEc'
const webhookDomain = 'https://fine-plum-crab-ring.cyclic.app'
const port = 5000 || process.env.PORT
import { Telegraf } from "telegraf";

const bot = new Telegraf(BOT_TOKEN);

bot.on("text", ctx => ctx.reply("Hello"));

// Start webhook via launch method (preferred)
bot
    .launch({ webhook: { domain: webhookDomain, port: port } })
    .then(() => console.log("Webhook bot listening on port", port));
