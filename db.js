const mongoose = require('mongoose');
// const MONGO = 'mongodb+srv://admin:admin@cluster0.usfqigj.mongodb.net/?retryWrites=true&w=majority'
const MONGO='mongodb+srv://agasiarakelyan:5jARMLMRtOKmAkE9@cluster0.uxixzvm.mongodb.net/uz?retryWrites=true&w=majority'
mongoose.connect(MONGO,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

module.exports = mongoose;
