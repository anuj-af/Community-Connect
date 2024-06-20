const mongoose = require('mongoose');
const PassportLocalMongoose=require('passport-local-mongoose');
const Community= require('./community');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
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
