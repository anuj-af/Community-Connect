const Post = require('../models/post');
const CustomError = require('../utils/CustomError');
const Community = require('../models/community');


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
        await post.save();
        res.redirect(`/community/${id}`);
    } catch (e) {
        next(new CustomError("Internal Server Error", 500));
    }


}

module.exports.upvote = async (req, res, next) => {

    try {
        const { postId, id } = req.params;
        const redirect = req.query.q;

        const userId = req.user._id;

        const post = await Post.findById(postId);
        const userUpvoted = post.upvotes.includes(userId);

        if (userUpvoted) {
            post.upvotes = post.upvotes.filter(upvote => upvote.toString() !== userId.toString());
        } else {
            post.upvotes.push(userId);
        }

        await post.save();
        if (redirect === "home") {
            res.redirect('/');
        } else {
            res.redirect(`/community/${id}`);
        }

    } catch (e) {
        next(new CustomError("", 400));
    }
}

module.exports.downvote = async (req, res, next) => {

    try {
        const { postId, id } = req.params;
        const redirect = req.query.q;

        const userId = req.user._id;

        const post = await Post.findById(postId);
        const userDownvoted = post.downvotes.includes(userId);

        if (userDownvoted) {
            post.downvotes = post.downvotes.filter(downvote => downvote.toString() !== userId.toString());
        } else {
            post.downvotes.push(userId);
        }

        await post.save();
        if (redirect === "home") {
            res.redirect('/');
        } else {
            res.redirect(`/community/${id}`);
        }
    } catch (e) {
        next(new CustomError("", 400));
    }


};

module.exports.deletePost = async (req, res, next) => {


    try {
        const { id, postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.redirect(`/community/${id}`);
    } catch (e) {
        next(new CustomError("Unable to delete post", 400));
    }

};