const mongoose = require('mongoose');

const UserStartedSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    telegramId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserStarted', UserStartedSchema);
