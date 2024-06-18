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
    downvotes:{
        type:Number,
        default:0
    },
    // comments:{

    // },

})

module.exports = mongoose.model('Post',postSchema);