const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {User} = require('../models/user');
const { string } = require('joi');
const {cloudinary}=require('../cloudinary/index');

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
    }],
    image : {
        url : {
            type : String,
        },
        filename : String
    }
    // comments:{

    // },
})


postSchema.post('findOneAndDelete',async function(data) {
    
    if(data){
        const file=data.image.filename;
        await cloudinary.uploader.destroy(file);
    }
    
})


module.exports = mongoose.model('Post',postSchema);