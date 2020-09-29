const mongoose = require("mongoose");

const comment_schema = mongoose.Schema({
    post_id:{
        type: String,
        require: true
    },
    user_id:{
        type: String,
        require: true
    },
    user_name:
    {
        type: String,
        require:true
    },
    content: {
        type: Object,
        require: true
    }
})

module.exports = mongoose.model("Comment", comment_schema);