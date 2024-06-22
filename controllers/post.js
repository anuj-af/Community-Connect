const Post = require('../models/post');
const CustomError = require('../utils/CustomError');
const Community = require('../models/community');
const {cloudinary} =require('../cloudinary/index');


module.exports.renderPost = (req, res, next) => {

    try {
        const { id } = req.params;
        res.render('post/new', { id });
    } catch (e) {
        next(new CustomError("Internal Server Error", 500));
    }

};

module.exports.createPost = async (req, res, next) => {


    try {
        const { title, content } = req.body;
        const userId = req.user._id;
        const { id } = req.params;
        const community = await Community.findById(id);
        const post = await new Post({
            title,
            content,
            author: userId
        })
        if(req.file){
            const {path,filename}=req.file;
            post.image = {url : path,filename : filename};
        }
        await post.save();
        community.posts.push(post);
        await community.save();
        res.redirect(`/community/${id}`);

    } catch (e) {
        next(new CustomError("Unable to create new post", 400));
    }

};

module.exports.editPost = async (req, res, next) => {

    try {
        const { title, content } = req.body;
        const { id, postId } = req.params;
        const post = await Post.findByIdAndUpdate(postId, { title, content }, { new: true, runValidators: true });
        const file = post.image.filename;

        if(req.file){
            
            await cloudinary.uploader.destroy(file);

            const {path,filename}=req.file;
            post.image = {url : path,filename : filename};
        }
        await post.save();

        res.redirect(`/community/${id}`);
    } catch (e) {
        next(new CustomError("Internal Server Error", 500));
    }


}


module.exports.deletePost = async (req, res, next) => {


    try {
        const { id, postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.redirect(`/community/${id}`);
    } catch (e) {
        next(new CustomError("Unable to delete post", 400));
    }

};