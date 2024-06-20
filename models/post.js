const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {User} = require('../models/user');
const { string } = require('joi');

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
    upvotes: [{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
    downvotes: [{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }]
    // comments:{

    // },
})
module.exports = mongoose.model('Post',postSchema);