const mongoose = require('mongoose');
// const MONGO = 'mongodb+srv://admin:admin@cluster0.usfqigj.mongodb.net/?retryWrites=true&w=majority'
const MONGO='mongodb://185.196.213.112:20000/test'
mongoose.connect(MONGO,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

module.exports = mongoose;
