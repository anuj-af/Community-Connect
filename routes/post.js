const express = require('express');
const router = express.Router({ mergeParams: true });

const Post = require('../models/post');
const Community = require('../models/community');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const postController = require('../controllers/post');

router.route('/post/new', isLoggedIn,postController.renderPost);

router.route('/post/new', catchAsync(postController.createPost))

router.patch('/post/:postId/edit', catchAsync(postController.editPost))

router.patch('/post/:postId/upvote', catchAsync(postController.upvote))

router.patch('/post/:postId/downvote', catchAsync(postController.downvote))

router.delete('/post/:postId', catchAsync(postController.deletePost))

module.exports = router;