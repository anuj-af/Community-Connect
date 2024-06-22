const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');
const {isLoggedIn, validateCommunity, storeReturnTo} = require('../middleware');
const Community = require('../models/community');
const User = require('../models/user');
const Message = require('../models/message');

const {storage} = require('../cloudinary');
const multer=require('multer');
const community = require('../models/community');
const upload=multer({storage});


router.route('/new')
    .get(isLoggedIn,communityController.newForm)
    .post(isLoggedIn,upload.single('communityProfile'),validateCommunity,communityController.createCommunity);

router.delete('/:id',isLoggedIn,communityController.deleteCommunity);

router.get('/:id/' ,communityController.showCommunity);

router.route('/:id/edit')
    .get(isLoggedIn,communityController.editForm)
    .patch(upload.single('communityProfile'),validateCommunity,communityController.updateCommunity);

// Folow a community
router.post('/:id/follow',isLoggedIn,communityController.follow);

// router.post('/:id/request',isLoggedIn,async (req,res) => {

    // const {id} = req.params;
    // const userId = req.user._id;

    // const community = await Community.findById(id);
    // await community.requests.push(userId);

    // console.log(community);

    // res.redirect(`/community/${id}`);

    // await community.save();

// })

// router.post('/:id/accept/:userId',isLoggedIn,async(req,res) => {

    // const {id,userId} = req.params;

    // const community = await Community.findById(id);
    // const user = await User.findById(userId);
  
    // community.followers.push(userId);
    // user.followings.push(id);

    // community.requests = community.requests.filter(request => request.toString() !== userId.toString());

    // console.log(community);

    // await community.save();
    // await user.save();

    // res.redirect(`/community/${id}`);

// })

module.exports = router;