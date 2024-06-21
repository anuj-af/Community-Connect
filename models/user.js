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
    ],
    image : {
        url : {
            type : String,
            default : "https://img.freepik.com/free-photo/3d-portrait-people_23-2150794029.jpg?t=st=1718601772~exp=1718605372~hmac=e7f53db83aa6b891c9ceeb849a8a6866465aa530d92a8d2533ae9a3da82cef59&w=1060",
        },
        filename : String
    }
    
}) 

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User',userSchema);
