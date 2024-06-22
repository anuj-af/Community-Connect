const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary/index');

const Post = require('./post');
const User = require('./user');
const { boolean } = require('joi');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No Description Available for this community."
    },
    image: {
        url: {
            type: String,
            default: "https://img.freepik.com/free-photo/3d-portrait-people_23-2150794029.jpg?t=st=1718601772~exp=1718605372~hmac=e7f53db83aa6b891c9ceeb849a8a6866465aa530d92a8d2533ae9a3da82cef59&w=1060",
        },
        filename: String
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    category:{

        type:String,
        default:"public"
    },
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

communitySchema.post('findOneAndDelete', async function (data) {

    if (data.posts) {
        for (let post of data.posts) {
            await Post.findByIdAndDelete(post._id);
        }
    }
    if(data.image.filename){
        const file = data.image.filename;
        await cloudinary.uploader.destroy(file);
    }

})

module.exports = mongoose.model('Community', communitySchema);