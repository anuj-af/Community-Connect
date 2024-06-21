const mongoose = require('mongoose');
const PassportLocalMongoose=require('passport-local-mongoose');
const Community= require('./community');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type : String,
    },
    email : {
        type : String,
    },
    googleId: String,
    githubId: String,
    profileUrl: String,
    avatarUrl: String,
    //password will be automatically set by passport local mongoose
    followings : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Community'
        }
    ]
}) 

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User',userSchema);
