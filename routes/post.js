const express = require('express');
const router = express.Router({ mergeParams: true });

const Post = require('../models/post');
const Community = require('../models/community');
const { isLoggedIn, storeReturnTo } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const postController = require('../controllers/post');

router.route('/post/new')
    .get(isLoggedIn,postController.renderPost)
    .post(catchAsync(postController.createPost))

router.patch('/post/:postId/edit', catchAsync(postController.editPost))

router.post('/post/:postId/upvote',isLoggedIn,catchAsync(postController.upvote))

router.post('/post/:postId/downvote',isLoggedIn,catchAsync(postController.downvote))

router.delete('/post/:postId', catchAsync(postController.deletePost))

module.exports = router;