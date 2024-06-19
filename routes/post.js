const express = require('express');
const router = express.Router({mergeParams:true});

const Post = require('../models/post');
const Community = require('../models/community');
const {isLoggedIn} = require('../middleware');

router.get('/post/new',isLoggedIn,(req,res) => {
    const {id} = req.params;
    res.render('post/new',{id});
});

router.post('/post/new',async (req,res) => {

    const  {title,content} = req.body;
    const userId = req.user._id;

    const{id} = req.params;
    const community = await Community.findById(id);

    const post = await new Post({
        title,
        content,
        author:userId
    }) 

    await post.save();

    community.posts.push(post);

    await community.save();

    res.redirect(`/community/${id}`);

})

// router.get('/post/:postId/edit',async (req,res) => {

//     res.render('');

// });

router.patch('/post/:postId/edit',async (req,res) => {

    const  {title,content} = req.body;
    const{id,postId} = req.params;
    const post = await Post.findByIdAndUpdate(postId,{title,content},{new:true,runValidators:true});
    await post.save();
    res.redirect(`/community/${id}`);
})

router.patch('/post/:postId/upvote',async(req,res)=>{
    const currentUser=req.user;

    const {id,postId}=req.params;
    const post=await Post.findById(postId);

    const isUpvoted = await post.upvoters.indexOf(currentUser._id);
    const isDownvoted = await post.downvoters.indexOf(currentUser._id);

    if((isUpvoted == -1) &&(isDownvoted==-1)){
        post.upvotes+=1;
        post.upvoters.push(currentUser);
    }
    else{
        return res.redirect(`/community/${id}`);
    }
    
    await post.save();
    res.redirect(`/community/${id}`);
})

router.patch('/post/:postId/downvote',async(req,res)=>{
    const currentUser=req.user;

    const {id,postId}=req.params;
    const post=await Post.findById(postId);

    const isUpvoted = await post.upvoters.indexOf(currentUser._id);
    const isDownvoted = await post.downvoters.indexOf(currentUser._id);

    if((isUpvoted == -1) &&(isDownvoted==-1)){
        post.downvotes+=1;
        post.downvoters.push(currentUser);
    }
    else{
        return res.redirect(`/community/${id}`);
    }

    await post.save();
    res.redirect(`/community/${id}`);
})

module.exports = router;