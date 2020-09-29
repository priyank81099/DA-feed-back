const mongoose = require("mongoose");

const post_schema = mongoose.Schema({
    user_id:{
        type: String,
        require: true
    },
    user_name:{
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    content: {
        type: Object,
        require: true
    },
    catagory: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("Post", post_schema);