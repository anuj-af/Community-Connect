const express = require('express');
const router = express.Router({ mergeParams: true });

const Post = require('../models/post');
const Community = require('../models/community');
const { isLoggedIn, storeReturnTo } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const postController = require('../controllers/post');


const {storage} = require('../cloudinary');
const multer=require('multer');
const upload=multer({storage});

router.route('/post/new')
    .get(isLoggedIn,postController.renderPost)
    .post(upload.single('postImage'),catchAsync(postController.createPost))

router.patch('/post/:postId/edit',upload.single('postImage'), catchAsync(postController.editPost))

router.delete('/post/:postId', catchAsync(postController.deletePost))

module.exports = router;