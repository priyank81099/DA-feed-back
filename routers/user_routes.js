const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt")
var cors = require('cors');

require("../mongo");

//Models or Tables
require("../models/post");
require("../models/user");
require("../models/comment")

//middleware
router.use(cors());
router.use(bodyparser.json());


var nodemailer = require('nodemailer');
const Comment = mongoose.model("Comment");


//---------------------------------------------------------

const User = mongoose.model("User");

router.route("/users").get(async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);
    } catch (error) {
        res.status(500);
    }
})

router.route("/users").post(async (req, res) => {

    User.findOne({ email: req.body.email }, async (err, user) => {
        if (!user && !err) {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = new User();
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                user.password = hashedPassword;
                user.email = req.body.email;
                user.facebook = "",
                user.instagram = "",
                user.linkedin = "",
                user.profile_image = "https://img.imageupload.net/2020/07/14/default.png"
                await user.save();
                res.send(user);
            } catch (error) {
                res.status(500);
            }
        }
        else {
            if (user) {
                res.send("User already Registerd");
            }
            else {
                res.status(500);
            }
        }
    })
})

router.route("/checkinusers").post(async (req, res) => {

    User.findOne({ email: req.body.email }, async (err, user) => {
        if (!user && !err) {
            try {
                
                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secureConnection: false,
                    auth: {
                        user: 'blog.daiict.ac.in@gmail.com',
                        pass: '201701183'
                    },
                    tls: {
                        ciphers: "SSLv3",
                        rejectUnauthorized: false,
                      },
                });
    
                const date = new Date();
                const url = `https://da-blogging-web.netlify.app/signup/:`+req.body.email+"-+-"+date;
                const slug_url = ":"+req.body.email+"-+-"+date;
                
                var mailOption = {
                    from: '"DA-Feed" <blog.daiict.ac.in@gmail.com>',
                    to: req.body.email,
                    subject: 'DA-Feed',
                    html: `Welcome to DA-Feed, <br><br>` +
                    `<p>Please click <a href="${url}">here</a> to verify your email and update your profile.</p><br>` +
                    "Regards,<br>" +
                    "DA-Feed."
                };

                transporter.sendMail(mailOption, function(error, info){
                    if(error) console.log(error);
                    else {console.log("Success");}
                });
    
                const user_with_slug = {
                    email : req.body.email,
                    slug_link : slug_url
                }
    
                return res.send(user_with_slug);

            } catch (error) {
                res.status(500);
            }
        }
        else {
            if (user) {
                res.send("User already Registerd");
            }
            else {
                res.status(500);
            }
        }
    })
})

router.route("/users/login").post(async (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {

        if (!user || err) {
            return res.send("Cannot find User")
        }
        else {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500);
                }
                else if (isMatch) {
                    return res.send(user);
                }
                else {
                    return res.send("Incorrect Password");
                }
            })
        }
    })
})

router.route("/users/update_password/:user_id").patch(async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await User.updateOne(
            { _id: req.params.user_id },
            { $set: { password: hashedPassword } }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500);
    }
})

router.route("/forgot_password").patch(async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await User.updateOne(
            { email: req.body.email },
            { $set: { password: hashedPassword } }
        );
        console.log(req.body.email);
        res.send(req.body.email);
    } catch (error) {
        res.send("null");
    }
})

router.route("/users/update_facebook/:user_id").patch(async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.user_id },
            { $set: { facebook: req.body.facebook } }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500);
    }
})

router.route("/users/update_instagram/:user_id").patch(async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.user_id },
            { $set: { instagram: req.body.instagram } }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500);
    }
})

router.route("/users/update_linkedin/:user_id").patch(async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.user_id },
            { $set: { linkedin: req.body.linkedin } }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500);
    }
})

router.route("/users/update_image/:user_id").patch(async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.user_id },
            { $set: { profile_image: req.body.profile_image } }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500);
    }
})

//---------------------------------------------------------
const Post = mongoose.model("Post");

router.route("/posts").get(async (req, res) => {
    try {
        const posts = await Post.find({})
        res.send(posts);
    } catch (error) {
        res.status(500);
    }
})

router.route("/posts").post(async (req, res) => {
    try {
        const post = new Post();
        post.user_id = req.body.user_id;
        post.title = req.body.title;
        post.catagory = req.body.catagory;
        post.content = req.body.editorState;
        post.user_name = req.body.user_name;
        await post.save();
        res.send(post);
    } catch (error) {
        res.status(500);
    }

})

router.delete('/delete/:id',async function(req, res) {

    Post.findByIdAndRemove(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
       });
});

//-----------------------------------------------------------

router.route("/comments").get(async (req, res) => {
    try {
        const comments = await Comment.find({})
        res.send(comments);
    } catch (error) {
        res.status(500);
    }
})

router.route("/comments").post(async (req, res) => {
    try {
        const comment = new Comment();
        comment.post_id = req.body.post_id;
        comment.user_id = req.body.user_id;
        comment.user_name = req.body.user_name;
        comment.content = req.body.editorState;
        await comment.save();
        res.send(comment);
    } catch (error) {
        res.status(500);
    }
})

//------------------------------------------------------------


router.route("/forgotpassword").post(async (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {

        if (!user || err) {
            const fack_user = {email : ""}
            return res.send(fack_user)
        }
        else{

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secureConnection: false,
                auth: {
                    user: 'blog.daiict.ac.in@gmail.com',
                    pass: '201701183'
                },
                tls: {
                    ciphers: "SSLv3",
                    rejectUnauthorized: false,
                  },
            });

            const date = new Date();
            const url = `https://da-blogging-web.netlify.app/resetpassword/:`+date+"+-+"+req.body.email;
            const slug_url = ":"+date+"+-+"+req.body.email;
            
            var mailOption = {
                from: '"DA-Feed" <blog.daiict.ac.in@gmail.com>',
                to: req.body.email,
                subject: 'Reset Password',
                html: `Hello, <br><br>` +
                `<p>Please click <a href="${url}">here</a> to change the password.</p><br>` +
                "Regards,<br>" +
                "DA-Feed."
            };

            transporter.sendMail(mailOption, function(error, info){
                if(error) console.log(error);
                else {console.log("Success");}
            });

            const user_with_slug = {
                email : user.email,
                slug_link : slug_url
            }

            return res.send(user_with_slug);
        }
    })
})




module.exports = router;
