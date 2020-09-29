const express = require("express");
const bodyparser = require("body-parser");
var cors = require('cors');
const app = express();
const userRoute = require('./routers/user_routes')
// Database Connection
require("./mongo");

//Models or Tables
require("./models/post");
require("./models/user");

//middleware
app.use(cors());
app.use(bodyparser.json());
app.use('/', userRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server started on 5000");
})
