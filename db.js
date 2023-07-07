const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@cluster0.usfqigj.mongodb.net/?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

module.exports = mongoose;
