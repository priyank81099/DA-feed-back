const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;

const config = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.MONGOURI, { config });


