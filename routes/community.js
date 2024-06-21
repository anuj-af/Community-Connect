const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');
const {isLoggedIn, validateCommunity, storeReturnTo} = require('../middleware');
const Community = require('../models/community');
const Message = require('../models/message');

const {storage} = require('../cloudinary');
const multer=require('multer');
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

module.exports = router;