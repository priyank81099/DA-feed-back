const mongoose = require("mongoose");

const user_schema = mongoose.Schema({
    first_name:{
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    facebook:{
        type: String
    },
    instagram:{
        type: String
    },
    linkedin:{
        type: String
    },
    profile_image:{
        type: String
    }
})

module.exports = mongoose.model("User", user_schema);