const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = require('./post');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No Description Available for this community."
    },
    profileImg: {
        type: String,
        default: "https://img.freepik.com/free-photo/3d-portrait-people_23-2150794029.jpg?t=st=1718601772~exp=1718605372~hmac=e7f53db83aa6b891c9ceeb849a8a6866465aa530d92a8d2533ae9a3da82cef59&w=1060"
    },
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('Community',communitySchema);