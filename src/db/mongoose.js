const mongoose = require('mongoose');

mongoose.connect(process.env.MONOGDB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});