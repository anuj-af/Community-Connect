const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {User} = require('../models/user');

const postSchema = new Schema({

    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String
    },
    content:{
        type:String
    },
    upvotes:{
        type:Number,
        default:0
    },
    upvoters : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    downvotes:{
        type:Number,
        default:0
    },
    downvoters : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ],

})
module.exports = mongoose.model('Post',postSchema);